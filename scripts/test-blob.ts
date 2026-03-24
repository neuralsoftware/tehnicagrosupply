import { put, list } from '@vercel/blob';

async function testBlob() {
    console.log('--- TEST VERCEL BLOB & ENV VARS ---');
    
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const password = process.env.ADMIN_PASSWORD;

    console.log('BLOB_READ_WRITE_TOKEN:', token ? `Set (Length: ${token.length})` : 'MISSING');
    console.log('ADMIN_PASSWORD:', password ? `Set (Length: ${password.length})` : 'MISSING');

    if (!token) {
        console.error('❌ EROARE: BLOB_READ_WRITE_TOKEN lipsă.');
        return;
    }

    try {
        console.log('⏳ Se încearcă scrierea unui fișier de test...');
        const blob = await put('test/test-connection.txt', 'Connection test from Antigravity ' + new Date().toISOString(), {
            access: 'public',
        });
        console.log('✅ SUCCES: Fișier scris pe Blob:', blob.url);

        console.log('⏳ Se încearcă listarea blob-urilor...');
        const { blobs } = await list({ limit: 1 });
        console.log('✅ SUCCES: Listare reușită, am găsit:', blobs.length, 'fișiere.');
    } catch (err) {
        console.error('❌ EROARE BLOB:', err);
    }
}

testBlob();
