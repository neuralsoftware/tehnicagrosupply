import { NextResponse } from 'next/server';
import { simpleRateLimit } from '@/lib/leads';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const leadSchema = z.object({
    name: z.string().min(2, 'Nume prea scurt').max(100, 'Nume prea lung'),
    /** Opțional în formularul ROI; dacă e completat, minim 8 caractere numerice */
    phone: z.preprocess(
        (v) => (v === undefined || v === null ? '' : String(v)),
        z
            .string()
            .transform((val) => val.replace(/[^\d+]/g, ''))
            .refine((val) => val.length === 0 || val.replace(/^\+/, '').length >= 8, {
                message: 'Telefon invalid (minim 8 cifre dacă îl completezi)',
            })
    ),
    email: z.string().email('Email invalid').optional().or(z.literal('')),
    county: z.string().max(100).optional().default(''),
    hectares: z.number().min(0, 'Suprafață invalidă').max(10000, 'Max 10000 ha').optional().default(0),
    crops: z.array(z.string()).max(10, 'Max 10 culturi').optional().default([]),
    urgency: z.string().max(100).optional().default(''),
    subsidyIncome: z.number().optional(),
    fuelSavings: z.number().optional(),
    totalBenefit: z.number().optional(),
    message: z.string().max(10000, 'Mesaj prea lung').optional().default(''),
    source: z.string().optional().default('Website Form'),
    productName: z.string().max(200).optional(),
});

export async function POST(request: Request) {
    try {
        // Rate limiting
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const allowed = simpleRateLimit(ip, 50, 900000); // 50 requests per 15 minutes pt testare

        if (!allowed) {
            return NextResponse.json(
                { error: 'Prea multe cereri. Te rugăm să încerci din nou în 15 minute.' },
                { status: 429 }
            );
        }

        const data = await request.json();

        // Validate input with Zod
        const validatedData = leadSchema.parse(data);

        // Ensure all required fields have proper defaults
        const leadData = {
            ...validatedData,
            email: validatedData.email || '',
            subsidyIncome: validatedData.subsidyIncome || 0,
            fuelSavings: validatedData.fuelSavings || 0,
            totalBenefit: validatedData.totalBenefit || 0,
            notes: validatedData.message || '',
            source: validatedData.source || 'Website Form',
        };

        const notesBlock = [
            `Sursa: ${leadData.source}`,
            `Produs interesat: ${validatedData.productName || '-'}`,
            `Mesaj: ${leadData.notes || '-'}`,
            `Hectare: ${leadData.hectares ?? 0}`,
            `Culturi: ${(leadData.crops || []).join(', ') || '-'}`,
            `Urgență: ${leadData.urgency || '-'}`,
        ].join('\n');

        const dbRow = {
            name: leadData.name,
            phone: leadData.phone || '',
            email: leadData.email || '',
            county: leadData.county || '',
            hectares: leadData.hectares ?? 0,
            crops: leadData.crops ?? [],
            urgency: leadData.urgency || '',
            subsidy_income: leadData.subsidyIncome ?? 0,
            fuel_savings: leadData.fuelSavings ?? 0,
            total_benefit: leadData.totalBenefit ?? 0,
            notes: notesBlock,
            status: 'Lead',
            source: leadData.source,
            is_new: true,
            product_name: validatedData.productName?.trim() || null,
        };

        const { data: insertedData, error: dbError } = await supabaseAdmin
            .from('clients')
            .insert([dbRow])
            .select()
            .single();

        if (dbError) {
            console.error('Supabase DB Error:', dbError);
            const human =
                dbError.code === 'PGRST205' || /schema cache/i.test(String(dbError.message || ''))
                    ? 'Tabela CRM (clients) lipsește sau nu e expusă în API. Rulează scriptul SQL din repo (scripts/supabase-clients-leads-table.sql) în Supabase.'
                    : dbError.message || JSON.stringify(dbError);
            return NextResponse.json(
                {
                    error: 'Nu am putut salva cererea în CRM.',
                    details: human,
                    code: dbError.code,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, lead: insertedData });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Date invalide', details: error.issues },
                { status: 400 }
            );
        }
        console.error('Lead processing error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Eroare internă server' }, { status: 500 });
    }
}

export async function GET() {
    try {
        // Use supabaseAdmin to bypass RLS and fetch all leads
        const { data, error } = await supabaseAdmin
            .from('clients')
            .select('*')
            .eq('status', 'Lead')
            .order('id', { ascending: false });

        if (error) {
            console.error('Supabase fetch error:', error);
            return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
        }

        // Map data to match frontend expectations camelCase
        const leads = data.map(row => ({
            id: row.id,
            name: row.name,
            phone: row.phone,
            email: row.email,
            county: row.county,
            status: row.status,
            notes: row.notes,
        }));

        return NextResponse.json({ leads });
    } catch (error) {
        console.error('Admin leads fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}
