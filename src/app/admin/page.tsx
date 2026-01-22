'use client';

import { useEffect, useState } from 'react';
import { Lead } from '@/lib/leads';
import { Users, Phone, MapPin, Search, Download, RefreshCcw, TrendingUp, MessageSquare, Mail, X, Send, Trash2, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [customMessage, setCustomMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [authError, setAuthError] = useState('');
    const [checkingAuth, setCheckingAuth] = useState(true);

    // CRM Filter State
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/leads');
            const data = await res.json();
            if (data.leads) {
                setLeads(data.leads);
            }
        } catch (err) {
            console.error('Failed to fetch leads', err);
        } finally {
            setLoading(false);
        }
    };

    const updateLeadNotes = async (id: string, notes: string) => {
        try {
            await fetch(`/api/leads/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes })
            });
            setLeads(prev => prev.map(l => l.id === id ? { ...l, notes } : l));
        } catch (err) {
            console.error('Failed to update notes', err);
        }
    };

    const updateLeadStatus = async (id: string, status: Lead['status']) => {
        try {
            await fetch(`/api/leads/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    const deleteLead = async (id: string) => {
        if (!confirm('Sigur vrei să ștergi acest lead? Această acțiune este ireversibilă.')) return;
        try {
            const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setLeads(prev => prev.filter(l => l.id !== id));
            }
        } catch (err) {
            console.error('Failed to delete lead', err);
        }
    };

    const markContacted = async (id: string) => {
        const now = new Date().toISOString();
        try {
            await fetch(`/api/leads/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'contacted', lastContacted: now })
            });
            setLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'contacted', lastContacted: now } : l));
        } catch (err) {
            console.error('Failed to mark contacted', err);
        }
    };

    const resendEmail = async (lead: Lead) => {
        try {
            const res = await fetch('/api/send-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lead)
            });
            if (res.ok) alert('Raport retrimis cu succes pe email!');
            else alert('Eroare la trimiterea email-ului.');
        } catch (err) {
            alert('Eroare la trimiterea email-ului.');
        }
    };

    const sendCustomOffer = async () => {
        if (!selectedLead || !customMessage) return;
        setIsSending(true);
        try {
            const res = await fetch('/api/send-offer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: selectedLead.email,
                    name: selectedLead.name,
                    message: customMessage,
                    leadData: selectedLead
                })
            });

            if (res.ok) {
                await updateLeadStatus(selectedLead.id, 'offer_sent');
                alert('Ofertă trimisă cu succes!');
                setSelectedLead(null);
                setCustomMessage('');
            } else {
                alert('Eroare la trimiterea ofertei.');
            }
        } catch (err) {
            console.error(err);
            alert('Eroare la trimiterea ofertei.');
        } finally {
            setIsSending(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        try {
            const res = await fetch('/api/admin-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: passwordInput })
            });
            if (res.ok) {
                localStorage.setItem('admin_auth', 'true');
                setIsAuthenticated(true);
                fetchLeads();
            } else {
                setAuthError('Parolă incorectă. Acces refuzat.');
            }
        } catch (err) {
            setAuthError('Eroare conexiune server.');
        }
    };

    useEffect(() => {
        const auth = localStorage.getItem('admin_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
            fetchLeads();
        }
        setCheckingAuth(false);
    }, []);

    const filteredLeads = leads.filter(lead => {
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.phone.includes(searchQuery) ||
            (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    const totalValue = filteredLeads.reduce((acc, lead) => acc + lead.totalBenefit, 0);

    const respondToLead = (lead: Lead) => {
        const cropsList = lead.crops?.join(', ') || 'Nespecificat';
        const message = `Bună ziua! Suntem de la TehnicAgro. Am primit cererea dvs. de validare a auditului pentru ferma de ${lead.hectares} ha din jud. ${lead.county}.\n\nAm observat interesul pentru culturile de: ${cropsList}.\n\nCând ați avea 5 minute să discutăm detaliile tehnice?`;

        if (lead.status === 'new') markContacted(lead.id);

        window.open(`https://wa.me/${lead.phone.replace(/\D/g, '').startsWith('4') ? lead.phone.replace(/\D/g, '') : '4' + lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (checkingAuth) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 uppercase font-black text-xs tracking-widest">Verificare Securitate...</div>;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900 border border-zinc-800 p-10 rounded-3xl shadow-2xl w-full max-w-md text-center"
                >
                    <div className="w-20 h-20 bg-ea-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10 text-ea-green-500" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Acces Securizat CRM</h2>
                    <p className="text-zinc-500 text-xs mb-8 uppercase font-bold tracking-widest">Introdu parola administrativă pentru a continua</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-center text-white focus:ring-1 focus:ring-ea-green-500 outline-none transition-all placeholder:text-zinc-800"
                            autoFocus
                        />
                        {authError && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{authError}</p>}
                        <button
                            type="submit"
                            className="w-full py-4 bg-ea-green-600 hover:bg-ea-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-ea-green-900/20 transition-all active:scale-95"
                        >
                            Logare Administrație
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8 font-sans">
            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-end border-b border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-tight text-ea-green-500">Expert CRM &mdash; Leads</h1>
                        <p className="text-zinc-400 mt-2">Gestiune avansată portofoliu TehnicAgro</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Căutare după nume, tel, email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-ea-green-500 outline-none w-64 transition-all"
                            />
                        </div>
                        <button
                            onClick={fetchLeads}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Actualizează
                        </button>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex items-center gap-2 bg-zinc-900/50 p-2 rounded-xl border border-zinc-800/50 w-fit">
                    <div className="px-3 text-zinc-500 border-r border-zinc-800 flex items-center gap-2 mr-2">
                        <Filter className="w-3 h-3" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Filtrare Status</span>
                    </div>
                    {[
                        { id: 'all', label: 'Toate', count: leads.length },
                        { id: 'new', label: 'Noi', color: 'bg-blue-500' },
                        { id: 'prospect', label: 'Prospect', color: 'bg-amber-500' },
                        { id: 'offer_sent', label: 'Ofertă', color: 'bg-ea-green-500' },
                        { id: 'win', label: 'Win', color: 'bg-emerald-500' },
                        { id: 'lost', label: 'Lost', color: 'bg-red-500' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${statusFilter === tab.id
                                ? 'bg-zinc-800 text-white shadow-lg'
                                : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            {tab.id !== 'all' && <div className={`w-1.5 h-1.5 rounded-full ${tab.color}`} />}
                            {tab.label}
                            {tab.id === 'all' && <span className="bg-zinc-700 px-1.5 rounded text-[8px]">{tab.count}</span>}
                        </button>
                    ))}
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-blue-500/10 transition-colors"></div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Users className="w-5 h-5 text-blue-500" />
                            </div>
                            <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Lead-uri Filtrate</span>
                        </div>
                        <span className="text-4xl font-black text-white">{filteredLeads.length}</span>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-ea-green-500/5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-ea-green-500/10 transition-colors"></div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-ea-green-500/10 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-ea-green-500" />
                            </div>
                            <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Valoare Pipeline (Filtered)</span>
                        </div>
                        <span className="text-4xl font-black text-white">{totalValue.toLocaleString('ro-RO')} RON</span>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl flex flex-col justify-center items-center text-center opacity-60">
                        <p className="text-zinc-500 text-[10px] italic font-medium uppercase tracking-widest">
                            "Fiecare contact este începutul unei relații."
                        </p>
                    </div>
                </div>

                {/* Leads Table */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-zinc-400 table-fixed">
                            <thead className="bg-zinc-950 text-zinc-200 uppercase font-black text-[10px] tracking-widest">
                                <tr>
                                    <th className="px-6 py-4 w-[110px]">Data Reg.</th>
                                    <th className="px-6 py-4 w-[240px]">Profil Fermă</th>
                                    <th className="px-6 py-4 w-[120px]">Urgență</th>
                                    <th className="px-6 py-4 min-w-[350px]">Note CRM & Istoric Discuții</th>
                                    <th className="px-6 py-4 w-[140px]">Locație / Ha</th>
                                    <th className="px-6 py-4 w-[180px] text-center">Status Pipeline</th>
                                    <th className="px-6 py-4 w-[160px] text-right">Acțiuni Clienți</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                <AnimatePresence mode='popLayout'>
                                    {filteredLeads.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-24 text-center text-zinc-600 italic">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Search className="w-8 h-8 opacity-20" />
                                                    <p>Nu s-au găsit lead-uri conform filtrelor aplicate.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredLeads.map((lead) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            key={lead.id}
                                            className="hover:bg-zinc-800/30 transition-colors group"
                                        >
                                            <td className="px-6 py-6 whitespace-nowrap font-mono text-[10px] text-zinc-500 leading-relaxed">
                                                <div className="text-zinc-300 font-bold">{new Date(lead.createdAt).toLocaleDateString('ro-RO')}</div>
                                                <div>{new Date(lead.createdAt).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}</div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="font-bold text-white text-base leading-tight group-hover:text-ea-green-400 transition-colors">{lead.name}</div>
                                                    <div className="flex items-center gap-2 text-zinc-300 font-bold bg-zinc-800/50 w-fit px-2 py-0.5 rounded text-xs border border-zinc-700">
                                                        <Phone className="w-3 h-3 text-ea-green-500" /> {lead.phone}
                                                    </div>
                                                    {lead.email && <div className="text-[10px] text-zinc-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</div>}
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {lead.crops?.map((crop, idx) => (
                                                            <span key={idx} className="bg-zinc-950 text-zinc-400 px-1.5 py-0.5 rounded text-[8px] border border-zinc-800 uppercase font-black tracking-tighter">
                                                                {crop}
                                                            </span>
                                                        )) || <span className="text-zinc-600 italic text-[9px]">nespecificat</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className={`inline-block px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${lead.urgency === 'urgent' ? 'bg-red-900/30 text-red-500 border border-red-800' :
                                                    lead.urgency === 'soon' ? 'bg-yellow-900/20 text-yellow-500 border border-yellow-800' :
                                                        'bg-zinc-800 text-zinc-500'
                                                    }`}>
                                                    {lead.urgency === 'urgent' ? 'Imediat' :
                                                        lead.urgency === 'soon' ? 'În Curând' : 'Observator'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <textarea
                                                    defaultValue={lead.notes || ''}
                                                    onBlur={(e) => updateLeadNotes(lead.id, e.target.value)}
                                                    placeholder="Adaugă detalii critice despre ferma, utilaje dorite, istoric apeluri..."
                                                    className="w-full bg-zinc-950/20 border border-zinc-800 focus:border-ea-green-900 rounded-xl p-4 text-xs text-zinc-300 focus:ring-1 focus:ring-ea-green-500/50 min-h-[140px] resize-y outline-none transition-all hover:bg-zinc-950/40 font-medium leading-relaxed"
                                                />
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3 h-3 text-ea-green-500" />
                                                        <span className="text-xs font-bold text-white uppercase">{lead.county}</span>
                                                    </div>
                                                    <div className="text-xs font-black text-zinc-400 border-t border-zinc-800 pt-2 flex justify-between">
                                                        <span>DIMENSIUNE:</span>
                                                        <span className="text-white">{lead.hectares} HA</span>
                                                    </div>
                                                    <div className="text-xs font-black text-ea-green-500 flex justify-between">
                                                        <span>EST. ROI:</span>
                                                        <span>{lead.totalBenefit.toLocaleString('ro-RO')} LEI</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col gap-2">
                                                    <select
                                                        value={lead.status}
                                                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                                                        className={`w-full px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border transition-all cursor-pointer shadow-sm ${lead.status === 'new' ? 'bg-blue-900/40 text-blue-400 border-blue-800' :
                                                            lead.status === 'prospect' ? 'bg-amber-900/40 text-amber-500 border-amber-800' :
                                                                lead.status === 'win' ? 'bg-emerald-900/40 text-emerald-400 border-emerald-800' :
                                                                    lead.status === 'lost' ? 'bg-red-900/30 text-red-500 border-red-800' :
                                                                        'bg-zinc-800 text-zinc-400 border-zinc-700'
                                                            }`}
                                                    >
                                                        <option value="new">NOU</option>
                                                        <option value="prospect">PROSPECT</option>
                                                        <option value="offer_sent">OFERTĂ TRIMISĂ</option>
                                                        <option value="win">WIN (CLIENT)</option>
                                                        <option value="lost">LOST</option>
                                                        <option value="contacted">CONTACTAT</option>
                                                    </select>
                                                    {lead.lastContacted && (
                                                        <div className="text-[8px] text-zinc-600 text-center uppercase font-bold tracking-tighter">
                                                            Ultim contact: {new Date(lead.lastContacted).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => respondToLead(lead)}
                                                        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border border-zinc-700 hover:border-zinc-600 shadow-sm"
                                                    >
                                                        <MessageSquare className="w-3 h-3 text-[#25D366]" />
                                                        WhatsApp
                                                    </button>

                                                    {lead.email && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedLead(lead);
                                                                setCustomMessage(`Bună ziua, ${lead.name}!\n\nRevenim cu propunerea tehnică pentru ferma dvs. de ${lead.hectares} ha din jud. ${lead.county}.\n\nDupă auditul efectuat, am identificat următoarea configurație optimă...`);
                                                            }}
                                                            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-ea-green-600 hover:bg-ea-green-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-ea-green-900/20"
                                                        >
                                                            <Mail className="w-3 h-3" />
                                                            Ofertă CRM
                                                        </button>
                                                    )}

                                                    <div className="flex gap-2 border-t border-zinc-800 pt-2 mt-1">
                                                        <button
                                                            onClick={() => resendEmail(lead)}
                                                            className="flex-1 text-[8px] text-zinc-600 hover:text-white uppercase font-bold text-center border border-zinc-800 rounded py-1 hover:bg-zinc-800 transition-all"
                                                            title="Retrimite Raport Tehnic"
                                                        >
                                                            Raport
                                                        </button>
                                                        <button
                                                            onClick={() => deleteLead(lead.id)}
                                                            className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded transition-all"
                                                            title="Șterge Lead (Trash)"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Custom Offer Modal */}
            <AnimatePresence>
                {selectedLead && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-1">Ofertă CRM TehnicAgro</h3>
                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Destinatar: <span className="text-white">{selectedLead.name}</span></p>
                                </div>
                                <button onClick={() => setSelectedLead(null)} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-500 hover:text-white transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div>
                                    <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2 tracking-widest">Mesaj Personalizat (Livrat Instat via Server)</label>
                                    <textarea
                                        value={customMessage}
                                        onChange={(e) => setCustomMessage(e.target.value)}
                                        className="w-full h-56 bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-sm text-zinc-200 focus:ring-1 focus:ring-ea-green-500 resize-none outline-none transition-all shadow-inner font-medium leading-relaxed"
                                        placeholder="Specifică aici detaliile tehnice, termenele de livrare și condițiile speciale de plată..."
                                    />
                                </div>
                                <div className="bg-ea-green-950/20 p-5 rounded-2xl border border-ea-green-900/30">
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp className="w-4 h-4 text-ea-green-500" />
                                        <p className="text-[10px] text-ea-green-500 leading-relaxed uppercase font-black tracking-widest">Atașamente Automate (ROI Dashboard):</p>
                                    </div>
                                    <ul className="text-[11px] text-zinc-400 space-y-2 font-medium">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 bg-ea-green-500 rounded-full" />
                                            Expertiza Tehnică pentru ferma de **{selectedLead.hectares} HA**
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 bg-ea-green-500 rounded-full" />
                                            Calcul Economii Combustibil & Input-uri
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 bg-ea-green-500 rounded-full" />
                                            Ghid Conformitate Subvenții EU (APIA PD-04)
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="p-8 bg-zinc-950 flex gap-4">
                                <button
                                    onClick={() => setSelectedLead(null)}
                                    className="flex-1 py-4 text-zinc-500 font-black uppercase tracking-widest text-xs hover:text-white transition-colors"
                                >
                                    Anulează
                                </button>
                                <button
                                    onClick={sendCustomOffer}
                                    disabled={isSending}
                                    className="flex-[2] py-4 bg-ea-green-600 hover:bg-ea-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-xl shadow-ea-green-900/20 active:scale-95"
                                >
                                    {isSending ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    Expediază Ofertă Oficială
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
