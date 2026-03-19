import { NextResponse } from 'next/server';
import { simpleRateLimit } from '@/lib/leads';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const leadSchema = z.object({
    name: z.string().min(2, 'Nume prea scurt').max(100, 'Nume prea lung'),
    phone: z.string()
        .transform((val) => {
            let digits = val.replace(/[^\d+]/g, '');
            return digits;
        })
        .refine((val) => val.length >= 8, {
            message: 'Telefon invalid'
        }),
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

    const dbData = {
            name: leadData.name,
            phone: leadData.phone || '',
            email: leadData.email || '',
            county: leadData.county || '',
        hectares: leadData.hectares || 0,
        crops: leadData.crops || [],
        urgency: leadData.urgency || '',
        subsidy_income: leadData.subsidyIncome || 0,
        fuel_savings: leadData.fuelSavings || 0,
        total_benefit: leadData.totalBenefit || 0,
            notes: leadData.notes || '',
        source: leadData.source || 'Website Form',
        status: 'Lead'
        };

    // --- SOLUȚIE PENTRU DUBLA ÎNREGISTRARE ---
    // Blocăm a doua cerere dacă există deja un client cu același telefon înregistrat în ultimele 5 minute
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: existingLead } = await supabaseAdmin
        .from('leads' as any)
        .select('id')
        .eq('phone', dbData.phone)
        .gte('created_at', fiveMinsAgo)
        .limit(1);

    if (existingLead && existingLead.length > 0) {
        // Oprim salvarea dublurii și returnăm succes pentru a nu bloca / da eroare pe site
        return NextResponse.json({ success: true, message: 'Dublură evitată automat' });
    }

        const { data: insertedData, error: dbError } = await supabaseAdmin
        .from('leads' as any)
        .insert([dbData] as any)
            .select()
            .single();

        if (dbError) {
            console.error('Supabase DB Error:', dbError);
            return NextResponse.json({ 
                error: 'Eroare_DB_Noua', 
                details: dbError?.message || JSON.stringify(dbError) || 'Detalii indisponibile'
            }, { status: 500 });
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
            .from('leads' as any)
            .select('*')
            .order('created_at', { ascending: false });

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
            hectares: row.hectares,
            crops: row.crops,
            urgency: row.urgency,
            subsidyIncome: row.subsidy_income,
            fuelSavings: row.fuel_savings,
            totalBenefit: row.total_benefit,
            createdAt: row.created_at,
            status: row.status,
            notes: row.notes,
            lastContacted: row.last_contacted
        }));

        return NextResponse.json({ leads });
    } catch (error) {
        console.error('Admin leads fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}
