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

// In-memory store for demonstration purposes
// TODO: Replace with Supabase in Phase 1
let leadsStore: Lead[] = [];

export const LeadsService = {
    async addLead(lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) {
        const newLead: Lead = {
            ...lead,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            status: 'new',
        };
        leadsStore.unshift(newLead);
        return newLead;
    },

    async getLeads() {
        return leadsStore;
    },

    async updateStatus(id: string, status: Lead['status']) {
        const lead = leadsStore.find(l => l.id === id);
        if (lead) {
            lead.status = status;
        }
        return lead;
    },

    async updateLead(id: string, updates: Partial<Lead>) {
        const leadIndex = leadsStore.findIndex(l => l.id === id);
        if (leadIndex !== -1) {
            leadsStore[leadIndex] = { ...leadsStore[leadIndex], ...updates };
            return leadsStore[leadIndex];
        }
        return null;
    },

    async deleteLead(id: string) {
        const index = leadsStore.findIndex(l => l.id === id);
        if (index !== -1) {
            leadsStore.splice(index, 1);
            return true;
        }
        return false;
    }
};
