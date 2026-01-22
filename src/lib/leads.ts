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

// In-memory store for demonstration purposes
// In production, this will be replaced by Supabase
let leadsStore: Lead[] = [];

export const LeadsService = {
    async addLead(lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) {
        const newLead: Lead = {
            ...lead,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            status: 'new',
        };
        leadsStore.unshift(newLead); // Add to beginning
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
        const leadIndex = leadsStore.findIndex(l => l.id === id);
        if (leadIndex !== -1) {
            leadsStore.splice(leadIndex, 1);
            return true;
        }
        return false;
    }
};
