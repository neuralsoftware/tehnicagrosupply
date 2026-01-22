import { NextResponse } from 'next/server';
import { LeadsService, simpleRateLimit } from '@/lib/leads';
import { z } from 'zod';

const leadSchema = z.object({
    name: z.string().min(2, 'Nume prea scurt').max(100, 'Nume prea lung'),
    phone: z.string().regex(/^07\d{8}$/, 'Telefon invalid (format: 07xxxxxxxx)'),
    email: z.string().email('Email invalid').optional().or(z.literal('')),
    county: z.string().min(2, 'Județ invalid'),
    hectares: z.number().min(1, 'Min 1 ha').max(10000, 'Max 10000 ha'),
    crops: z.array(z.string()).max(10, 'Max 10 culturi'),
    urgency: z.string().max(100),
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

export async function GET() {
    try {
        const leads = await LeadsService.getLeads();
        return NextResponse.json({ leads });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}
