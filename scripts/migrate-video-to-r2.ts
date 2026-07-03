import crypto from 'crypto';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local', quiet: true });

const SUPABASE_BUCKET = 'tehnicagro';
const SUPABASE_VIDEO_PREFIX = 'video';
const R2_BUCKET = process.env.R2_BUCKET || 'technicagro-media';
const R2_ACCOUNT_ID = requiredEnv('R2_ACCOUNT_ID');
const R2_ACCESS_KEY_ID = requiredEnv('R2_ACCESS_KEY_ID');
const R2_SECRET_ACCESS_KEY = requiredEnv('R2_SECRET_ACCESS_KEY');
const VIDEO_CDN_BASE_URL = (
    process.env.NEXT_PUBLIC_VIDEO_CDN_BASE_URL ||
    process.env.R2_PUBLIC_BASE_URL ||
    ''
).replace(/\/+$/, '');

const R2_ENDPOINT_HOST = `${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_ENDPOINT = `https://${R2_ENDPOINT_HOST}`;
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.webm']);
const CONTENT_TYPES: Record<string, string> = {
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.webm': 'video/webm',
};

interface SupabaseObject {
    path: string;
    contentType: string;
    size: number;
}

function requiredEnv(name: string): string {
    const value = process.env[name]?.trim();
    if (!value) throw new Error(`Missing required env var: ${name}`);
    return value;
}

function assertProductionCdnBaseUrl(): void {
    if (!VIDEO_CDN_BASE_URL) {
        throw new Error('Missing NEXT_PUBLIC_VIDEO_CDN_BASE_URL.');
    }
}

function encodeStoragePath(storagePath: string): string {
    return storagePath.split('/').map((segment) => encodeURIComponent(segment)).join('/');
}

function publicUrl(storagePath: string): string {
    return `${VIDEO_CDN_BASE_URL}/${encodeStoragePath(storagePath)}`;
}

function hmac(key: crypto.BinaryLike | crypto.KeyObject, value: string): Buffer {
    return crypto.createHmac('sha256', key).update(value).digest();
}

function sha256(value: Buffer | string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function awsDate(now = new Date()): { amzDate: string; dateStamp: string } {
    const iso = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    return { amzDate: iso, dateStamp: iso.slice(0, 8) };
}

function signingKey(dateStamp: string): Buffer {
    const kDate = hmac(`AWS4${R2_SECRET_ACCESS_KEY}`, dateStamp);
    const kRegion = hmac(kDate, 'auto');
    const kService = hmac(kRegion, 's3');
    return hmac(kService, 'aws4_request');
}

async function signedR2Request(
    method: 'PUT' | 'HEAD',
    objectPath: string,
    body?: Buffer,
    contentType?: string
): Promise<Response> {
    const payloadHash = sha256(body ?? '');
    const { amzDate, dateStamp } = awsDate();
    const pathname = objectPath ? `/${R2_BUCKET}/${encodeStoragePath(objectPath)}` : `/${R2_BUCKET}`;
    const headers: Record<string, string> = {
        host: R2_ENDPOINT_HOST,
        'x-amz-content-sha256': payloadHash,
        'x-amz-date': amzDate,
    };

    if (contentType) headers['content-type'] = contentType;
    if (body) headers['cache-control'] = 'public, max-age=31536000, immutable';

    const signedHeaders = Object.keys(headers).sort().join(';');
    const canonicalHeaders = Object.keys(headers)
        .sort()
        .map((key) => `${key}:${headers[key]}\n`)
        .join('');
    const canonicalRequest = [method, pathname, '', canonicalHeaders, signedHeaders, payloadHash].join('\n');
    const credentialScope = `${dateStamp}/auto/s3/aws4_request`;
    const stringToSign = ['AWS4-HMAC-SHA256', amzDate, credentialScope, sha256(canonicalRequest)].join('\n');
    const signature = crypto.createHmac('sha256', signingKey(dateStamp)).update(stringToSign).digest('hex');

    headers.authorization = `AWS4-HMAC-SHA256 Credential=${R2_ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    return fetch(`${R2_ENDPOINT}${pathname}`, {
        method,
        headers,
        body: body ? new Uint8Array(body) : undefined,
    });
}

async function ensureBucket(): Promise<void> {
    const res = await signedR2Request('PUT', '');
    if (res.ok || res.status === 409) return;
    throw new Error(`Could not create/confirm R2 bucket ${R2_BUCKET}: ${res.status} ${await res.text()}`);
}

async function listSupabaseVideos(): Promise<SupabaseObject[]> {
    const supabaseUrl = requiredEnv('NEXT_PUBLIC_SUPABASE_URL');
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || requiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);
    const videos: SupabaseObject[] = [];

    async function walk(prefix: string): Promise<void> {
        const { data, error } = await supabase.storage.from(SUPABASE_BUCKET).list(prefix, {
            limit: 1000,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
        });
        if (error) throw error;

        for (const item of data ?? []) {
            const itemPath = `${prefix}/${item.name}`;
            if (!item.metadata) {
                await walk(itemPath);
                continue;
            }
            const ext = path.extname(item.name).toLowerCase();
            if (!VIDEO_EXTENSIONS.has(ext)) continue;
            videos.push({
                path: itemPath,
                contentType: CONTENT_TYPES[ext] ?? item.metadata.mimetype ?? 'application/octet-stream',
                size: Number(item.metadata.size ?? 0),
            });
        }
    }

    await walk(SUPABASE_VIDEO_PREFIX);
    return videos;
}

async function downloadSupabaseObject(objectPath: string): Promise<Buffer> {
    const supabaseUrl = requiredEnv('NEXT_PUBLIC_SUPABASE_URL').replace(/\/+$/, '');
    const url = `${supabaseUrl}/storage/v1/object/public/${SUPABASE_BUCKET}/${encodeStoragePath(objectPath)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Download failed for ${objectPath}: ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
}

async function convertMovToMp4(input: Buffer, sourcePath: string, tempDir: string): Promise<Buffer | null> {
    const inputPath = path.join(tempDir, `${path.basename(sourcePath)}.mov`);
    const outputPath = path.join(tempDir, `${path.basename(sourcePath, path.extname(sourcePath))}.mp4`);
    await fs.writeFile(inputPath, input);

    const args = [
        '-y',
        '-i',
        inputPath,
        '-map',
        '0:v:0',
        '-map',
        '0:a?',
        '-c:v',
        'libx264',
        '-preset',
        'medium',
        '-crf',
        '24',
        '-pix_fmt',
        'yuv420p',
        '-movflags',
        '+faststart',
        '-c:a',
        'aac',
        '-b:a',
        '128k',
        outputPath,
    ];

    const code = await new Promise<number>((resolve) => {
        const child = spawn('ffmpeg', args, { stdio: 'inherit' });
        child.on('close', resolve);
    });

    if (code !== 0) return null;
    return fs.readFile(outputPath);
}

async function uploadObject(objectPath: string, body: Buffer, contentType: string): Promise<void> {
    const res = await signedR2Request('PUT', objectPath, body, contentType);
    if (!res.ok) throw new Error(`R2 upload failed for ${objectPath}: ${res.status} ${await res.text()}`);
}

async function validatePublicUrl(objectPath: string): Promise<void> {
    const res = await fetch(publicUrl(objectPath), { method: 'HEAD' });
    if (!res.ok) {
        throw new Error(
            `CDN/public URL is not reachable for ${objectPath}: ${res.status}. Check the bucket public access and Cloudflare custom domain.`
        );
    }
    const cacheControl = res.headers.get('cache-control') ?? '';
    if (!cacheControl.includes('max-age')) {
        console.warn(`[warn] ${objectPath} is reachable but CDN response has no max-age Cache-Control header.`);
    }
}

async function main(): Promise<void> {
    assertProductionCdnBaseUrl();
    await ensureBucket();

    const videos = await listSupabaseVideos();
    const mp4Paths = new Set(videos.filter((v) => v.path.toLowerCase().endsWith('.mp4')).map((v) => v.path));
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tehnicagro-r2-video-'));
    const uploaded: string[] = [];

    for (const video of videos) {
        const ext = path.extname(video.path).toLowerCase();
        let targetPath = video.path;
        let contentType = video.contentType;
        let body = await downloadSupabaseObject(video.path);

        if (ext === '.mov') {
            const convertedPath = video.path.replace(/\.mov$/i, '.mp4');
            if (mp4Paths.has(convertedPath)) {
                console.log(`skip ${video.path}: optimized MP4 sibling already exists`);
                continue;
            }
            const converted = await convertMovToMp4(body, video.path, tempDir);
            if (converted) {
                body = converted;
                targetPath = convertedPath;
                contentType = 'video/mp4';
            } else {
                console.warn(`[warn] ffmpeg conversion failed for ${video.path}; uploading original MOV`);
            }
        }

        await uploadObject(targetPath, body, contentType);
        uploaded.push(targetPath);
        console.log(`uploaded ${targetPath} -> ${publicUrl(targetPath)}`);
    }

    for (const objectPath of uploaded) {
        await validatePublicUrl(objectPath);
    }

    console.log(`done: ${uploaded.length} video objects uploaded to ${R2_BUCKET}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
