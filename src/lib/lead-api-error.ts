/**
 * Mesaj prietenos din răspunsul de eroare al `/api/leads` (Zod trimite `details`
 * ca listă de probleme per câmp; serverul trimite `error` generic în rest).
 */
export function formatLeadApiError(data: {
    error?: string;
    details?: unknown;
}): string {
    if (typeof data.details === 'string' && data.details.trim()) {
        const base = data.error || 'Cererea nu a putut fi procesată';
        return `${base} ${data.details}`;
    }
    if (Array.isArray(data.details) && data.details.length > 0) {
        const parts = data.details
            .map((d) => (d && typeof d === 'object' && 'message' in d ? String((d as { message?: string }).message || '') : ''))
            .filter(Boolean);
        if (parts.length) return parts.join(' ');
    }
    return data.error || 'Cererea nu a putut fi procesată.';
}
