import { NextResponse } from 'next/server';
import { LeadsService, simpleRateLimit } from '@/lib/leads';
import { z } from 'zod';

const leadSchema = z.object({
    name: z.string().min(2, 'Nume prea scurt').max(100, 'Nume prea lung'),
    phone: z.string()
        .transform((val) => val.replace(/[^\d]/g, '')) // Remove non-digits
        .refine((val) => /^07\d{8}$/.test(val), {
            message: 'Telefon invalid (trebuie să fie număr de mobil RO cu 10 cifre)'
        }),
    email: z.string().email('Email invalid').optional().or(z.literal('')),
    county: z.string().max(100).optional().default(''),
    hectares: z.number().min(0, 'Suprafață invalidă').max(10000, 'Max 10000 ha').optional().default(0),
    crops: z.array(z.string()).max(10, 'Max 10 culturi').optional().default([]),
    urgency: z.string().max(100).optional().default(''),
    subsidyIncome: z.number().optional(),
    fuelSavings: z.number().optional(),
    totalBenefit: z.number().optional()
});

export async function POST(request: Request) {
    try {
        // Rate limiting
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const allowed = simpleRateLimit(ip, 5, 900000); // 5 requests per 15 minutes

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
            totalBenefit: validatedData.totalBenefit || 0
        };

        const lead = await LeadsService.addLead(leadData);

        return NextResponse.json({ success: true, lead });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Date invalide', details: error.issues },
                { status: 400 }
            );
        }
        console.error('Lead processing error:', error);
        return NextResponse.json({ error: 'Eroare la procesare' }, { status: 500 });
    }
}

import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
    try {
        // Use supabaseAdmin to bypass RLS and fetch all leads
        const { data, error } = await supabaseAdmin
            .from('leads')
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
