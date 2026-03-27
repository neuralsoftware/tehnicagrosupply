import { getSupabaseCrmAdmin } from './supabaseCrmAdmin';

function crmOrThrow() {
    const c = getSupabaseCrmAdmin();
    if (!c) {
        throw new Error(
            'CRM Supabase neconfigurat: setează CRM_SUPABASE_URL și CRM_SUPABASE_SERVICE_ROLE_KEY (proiect CRM, nu marketing).'
        );
    }
    return c;
}

export interface Lead {
    id: string;
    name: string;
    phone: string;
    email: string;
    county: string;
    hectares: number;
    crops: string[];
    urgency: string;
    subsidyIncome: number;
    fuelSavings: number;
    totalBenefit: number;
    createdAt: string;
    status: 'new' | 'prospect' | 'lost' | 'win' | 'offer_sent' | 'contacted';
    notes?: string;
    lastContacted?: string;
}

// Simple in-memory rate limiting
const requestCounts = new Map<string, { count: number; resetAt: number }>();

export function simpleRateLimit(
    identifier: string,
    limit: number = 5,
    windowMs: number = 900000 // 15 minutes
): boolean {
    const now = Date.now();
    const record = requestCounts.get(identifier);

    if (!record || now > record.resetAt) {
        requestCounts.set(identifier, { count: 1, resetAt: now + windowMs });
        return true;
    }

    if (record.count >= limit) {
        return false;
    }

    record.count++;
    return true;
}

// Supabase CRM — tabel `clients` în proiectul Tehnicagri CRM (NU marketing).
export const LeadsService = {
    async addLead(lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) {
        const supabase = crmOrThrow();
        const { data, error } = await supabase
            .from('clients')
            .insert([{
                name: lead.name,
                phone: lead.phone,
                email: lead.email || '',
                county: lead.county,
                hectares: lead.hectares,
                crops: lead.crops || [],
                urgency: lead.urgency || '',
                subsidy_income: lead.subsidyIncome || 0,
                fuel_savings: lead.fuelSavings || 0,
                total_benefit: lead.totalBenefit || 0,
                notes: lead.notes || '',
                status: 'Lead',
                source: 'LeadsService',
                is_new: true,
                product_name: null,
            }])
            .select()
            .single();

        if (error) {
            console.error('Supabase insert error:', error);
            throw new Error('Failed to save lead');
        }

        // Map Supabase response to Lead interface
        return {
            id: data.id,
            name: data.name,
            phone: data.phone,
            email: data.email,
            county: data.county,
            hectares: data.hectares,
            crops: data.crops,
            urgency: data.urgency,
            subsidyIncome: data.subsidy_income,
            fuelSavings: data.fuel_savings,
            totalBenefit: data.total_benefit,
            createdAt: data.created_at,
            status: data.status,
            notes: data.notes,
            lastContacted: data.last_contacted
        } as Lead;
    },

    async getLeads() {
        const supabase = crmOrThrow();
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            console.error('Supabase fetch error:', error);
            return [];
        }

        // Map all leads from Supabase format to Lead interface
        return data.map(row => ({
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
        })) as Lead[];
    },

    async updateStatus(id: string, status: Lead['status']) {
        const supabase = crmOrThrow();
        const { data, error } = await supabase
            .from('clients')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Supabase update error:', error);
            return null;
        }

        return {
            id: data.id,
            name: data.name,
            phone: data.phone,
            email: data.email,
            county: data.county,
            hectares: data.hectares,
            crops: data.crops,
            urgency: data.urgency,
            subsidyIncome: data.subsidy_income,
            fuelSavings: data.fuel_savings,
            totalBenefit: data.total_benefit,
            createdAt: data.created_at,
            status: data.status,
            notes: data.notes,
            lastContacted: data.last_contacted
        } as Lead;
    },

    async updateLead(id: string, updates: Partial<Lead>) {
        // Map Lead interface fields to Supabase column names
        const supabaseUpdates: any = {};
        if (updates.name !== undefined) supabaseUpdates.name = updates.name;
        if (updates.phone !== undefined) supabaseUpdates.phone = updates.phone;
        if (updates.email !== undefined) supabaseUpdates.email = updates.email;
        if (updates.county !== undefined) supabaseUpdates.county = updates.county;
        if (updates.hectares !== undefined) supabaseUpdates.hectares = updates.hectares;
        if (updates.crops !== undefined) supabaseUpdates.crops = updates.crops;
        if (updates.urgency !== undefined) supabaseUpdates.urgency = updates.urgency;
        if (updates.subsidyIncome !== undefined) supabaseUpdates.subsidy_income = updates.subsidyIncome;
        if (updates.fuelSavings !== undefined) supabaseUpdates.fuel_savings = updates.fuelSavings;
        if (updates.totalBenefit !== undefined) supabaseUpdates.total_benefit = updates.totalBenefit;
        if (updates.status !== undefined) supabaseUpdates.status = updates.status;
        if (updates.notes !== undefined) supabaseUpdates.notes = updates.notes;
        if (updates.lastContacted !== undefined) supabaseUpdates.last_contacted = updates.lastContacted;

        const supabase = crmOrThrow();
        const { data, error } = await supabase
            .from('clients')
            .update(supabaseUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Supabase update error:', error);
            return null;
        }

        return {
            id: data.id,
            name: data.name,
            phone: data.phone,
            email: data.email,
            county: data.county,
            hectares: data.hectares,
            crops: data.crops,
            urgency: data.urgency,
            subsidyIncome: data.subsidy_income,
            fuelSavings: data.fuel_savings,
            totalBenefit: data.total_benefit,
            createdAt: data.created_at,
            status: data.status,
            notes: data.notes,
            lastContacted: data.last_contacted
        } as Lead;
    },

    async deleteLead(id: string) {
        const supabase = crmOrThrow();
        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Supabase delete error:', error);
            return false;
        }

        return true;
    }
};
