import { Contact } from '@/components/Contact';
import { TrustSignals } from '@/components/TrustSignals';
import { Settings, Wrench, ShieldCheck } from 'lucide-react';

export default function PieseSchimbPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100 pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
                        Piese de <span className="text-ea-green-500">Schimb</span> & Mentenanță
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        Asigurăm suport tehnic complet și piese de origine pentru toate utilajele din portofoliul TehnicAgro.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-24">
                    <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 space-y-4">
                        <Settings className="w-12 h-12 text-ea-green-500" />
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">Piese de Origine</h3>
                        <p className="text-zinc-500 text-sm">
                            Distribuim exclusiv piese certificate Avers-Agro și Fliegl pentru a garanta longevitatea utilajului tău.
                        </p>
                    </div>
                    <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 space-y-4">
                        <Wrench className="w-12 h-12 text-ea-green-500" />
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">Suport Tehnic 24/7</h3>
                        <p className="text-zinc-500 text-sm">
                            Echipa noastră de ingineri este disponibilă pentru diagnoză rapidă și intervenții în teren.
                        </p>
                    </div>
                    <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 space-y-4">
                        <ShieldCheck className="w-12 h-12 text-ea-green-500" />
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">Garanție Extinsă</h3>
                        <p className="text-zinc-500 text-sm">
                            Toate piesele montate de echipele noastre beneficiază de garanție completă conform normelor producătorului.
                        </p>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
                            Ai nevoie de o <span className="text-ea-green-500">piesă specifică?</span>
                        </h2>
                        <p className="text-zinc-400 text-lg">
                            Dacă nu găsești piesa dorită în lista noastră curentă, completează formularul cu modelul utilajului și piesa necesară. Te vom contacta în maxim 2 ore cu o ofertă de preț și termen de livrare.
                        </p>
                        <div className="pt-8">
                            <TrustSignals />
                        </div>
                    </div>
                    <div className="bg-zinc-900 p-2 rounded-3xl border border-zinc-800">
                        <Contact />
                    </div>
                </div>
            </div>
        </main>
    );
}
