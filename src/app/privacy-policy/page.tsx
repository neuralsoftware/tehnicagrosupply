import Link from 'next/link';

export const metadata = {
  title: 'Politica de Confidențialitate | TEHNICAGRO SUPPLY',
  description: 'Informații despre modul în care colectăm, prelucrăm și protejăm datele dumneavoastră cu caracter personal.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 shadow-sm rounded-2xl border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Politica de Confidențialitate</h1>
        
        <div className="prose prose-slate prose-emerald max-w-none">
          <p className="lead text-lg text-slate-600 mb-6">
            Protecția datelor dumneavoastră cu caracter personal este o prioritate pentru <strong>TEHNICAGRO SUPPLY S.R.L.</strong>
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">1. Operatorul de Date</h2>
          <p className="text-slate-600 mb-4">
            Operatorul datelor dumneavoastră cu caracter personal este:
          </p>
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 mb-6 text-sm text-slate-700">
            <strong>TEHNICAGRO SUPPLY S.R.L.</strong><br/>
            Sediu social: Sos. Tulcei 69 A Ap. BIR. 1, Sat Lumina, Jud. Constanta, Cod 907175<br/>
            CUI/CIF: RO52736574<br/>
            Nr. Reg. Comerțului: J2025080370001<br/>
            Email de contact: <a href="mailto:tehnicagro.supply@gmail.com" className="text-emerald-600 hover:underline">tehnicagro.supply@gmail.com</a>
          </div>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">2. Ce date colectăm?</h2>
          <p className="text-slate-600 mb-2">Colectăm informații în următoarele moduri:</p>
          <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
            <li><strong>Informații furnizate direct de dumneavoastră:</strong> Când completați formularul de contact (Nume, Prenume, Număr de telefon, Adresă de email, Numele Companiei).</li>
            <li><strong>Informații colectate automat:</strong> Prin intermediul modulelor cookie (vezi Politica de Cookie-uri) și Google Analytics (adresa IP anonimizată, tipul browserului, paginile vizitate).</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">3. Scopul prelucrării</h2>
          <p className="text-slate-600 mb-4">Datele dumneavoastră sunt prelucrate exclusiv pentru următoarele scopuri:</p>
          <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
            <li>Pentru a răspunde solicitărilor și mesajelor dumneavoastră transmise prin formularele de pe site.</li>
            <li>Pentru procesul de ofertare și comunicare comercială pre-contractuală.</li>
            <li>Pentru a îmbunătăți experiența pe site-ul nostru (prin date analitice anonimizate).</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">4. Durata de păstrare a datelor</h2>
          <p className="text-slate-600 mb-4">
            Vom păstra datele dumneavoastră cu caracter personal doar atât timp cât este necesar pentru îndeplinirea scopurilor menționate, respectiv pe durata negocierilor comerciale sau conform obligațiilor legale aplicabile în România. Datele din formularele de contact sunt stocate în siguranță în sistemul nostru CRM intern.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">5. Drepturile dumneavoastră (GDPR)</h2>
          <p className="text-slate-600 mb-4">Conform Regulamentului General privind Protecția Datelor (GDPR), beneficiați de următoarele drepturi:</p>
          <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
            <li><strong>Dreptul de acces:</strong> de a afla ce date prelucrăm despre dvs.</li>
            <li><strong>Dreptul la rectificare:</strong> de a corecta datele inexacte.</li>
            <li><strong>Dreptul la ștergere:</strong> ("dreptul de a fi uitat") al datelor dumneavoastră.</li>
            <li><strong>Dreptul la restricționarea prelucrării</strong> și <strong>Dreptul la portabilitate</strong>.</li>
            <li><strong>Dreptul de a depune o plângere</strong> la autoritatea de supraveghere (ANSPDCP - www.dataprotection.ro).</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">6. Securitatea datelor</h2>
          <p className="text-slate-600 mb-4">
            Am implementat măsuri tehnice și organizatorice adecvate pentru a asigura securitatea datelor dumneavoastră împotriva prelucrării neautorizate sau ilegale și împotriva pierderii, distrugerii sau deteriorării accidentale.
          </p>

          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
            <Link href="/" className="text-emerald-600 font-medium hover:underline">
              &larr; Înapoi la pagina principală
            </Link>
            <span className="text-sm text-slate-400">Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
