import { NextResponse } from 'next/server';
import { LeadsService } from '@/lib/leads';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Validate basic data
        if (!data.name || !data.phone || !data.county) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const lead = await LeadsService.addLead(data);

        return NextResponse.json({ success: true, lead });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process lead' }, { status: 500 });
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
