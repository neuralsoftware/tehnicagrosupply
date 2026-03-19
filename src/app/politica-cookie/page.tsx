import Link from 'next/link';

export const metadata = {
  title: 'Politica de utilizare a Cookie-urilor | TEHNICAGRO SUPPLY',
  description: 'Află cum folosim cookie-urile pentru a-ți îmbunătăți experiența pe site-ul nostru.',
};

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 shadow-sm rounded-2xl border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Politica de utilizare a Cookie-urilor</h1>
        
        <div className="prose prose-slate prose-emerald max-w-none">
          <p className="lead text-lg text-slate-600 mb-6">
            Această politică expli            Această politică expli            Ace</s            Această politică expli            Aceastar            Această politică </            Această politicăext            Această politică expli         . Ce sunt cookie-urile?</h2>
          <p className="text-slate-600 mb-4">
            Cookie-urile sunt fișiere text mici care sunt stocate pe dispozitivul dumneavoastră (computer, tabletă, telefon) atunci când vizitați un site web. Ele sunt utilizate pe scară largă pentru a face site-urile să funcționeze sau să funcționeze mai eficient, precum și pentru a oferi informații proprietarilor site-ului.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">2. Ce tipuri de cookie-uri folosim?</h2>
          <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
            <li><strong>Cookie-uri strict necesare:</strong> Acestea sunt esențiale pentru funcționarea site-ului și nu pot fi oprite în sistemele noastre. De obicei, sunt setate doar ca răspuns la acțiunile pe care le faceți, cum ar fi setarea preferințelor de confidențialitate (cookie-ul <code>cookie_consent</code>).</li>
            <li><strong>Cookie-uri de analiză (Google Analytics):</strong> Ne permit să numărăm vizitele și sursele de trafic, astfel încât să putem măsura și îmbunătăți performanța site-ului nostru. Acestea colectează informații în mod agregat și anonim. Acestea sunt activate doar dacă apăsați butonul "Accept Toate".</li>
            <li><strong>Cookie-uri de marketing:</strong> Pot fi setate prin intermediul site-ului nostru de către partenerii noștri de publicitate pentru a vă construi un profil al intereselor și a vă afișa reclame relevante pe alte site-uri.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">3. Cum puteți controla cookie-urile?</h2>
          <p className="text-slate-600 mb-4">
            Aveți dreptul să decideți dacă acceptați sau respingeți cookie-urile (cu excepția celor strict necesare). Puteți face acest lucru prin intermediul bannerului de cookie-uri care apare la prima vizită.
          </p>
          <p className="text-slate-600 mb-4">
            De asemenea, vă puteți seta sau modifica controalele browserului web pentru a accepta sau refuza cookie-urile. Dacă alegeți să respingeți cookie-urile, puteți utiliza în continuare site-ul nostru, deși accesul la anumite funcționalități ar putea fi restricționat.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">4. Contact</h2>
          <p className="text-slate-600 mb-4">
            Dacă aveți întrebări despre utilizarea cookie-urilor, ne puteți contacta la:
          </p>
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 mt-4 text-sm text-slate-700">
            <strong>TEHNICAGRO SUPPLY S.R.L.</strong><br/>
            Adresa: Sos. Tulcei 69 A Ap. BIR. 1, Sat Lumina, Jud. Constanta, Cod 907175<br/>
            CUI: RO52736574 | Reg. Com.: J2025080370001<br/>
            Email: <a href="mailto:tehnicagro.supply@gmail.com" className="text-emerald-600 hover:underline">tehnicagro.supply@gmail.com</a>
          </div>
          
          <div className="mt-8">
            <Link href="/" className="text-emerald-600 font-medium hover:underline">
              &larr; Înapoi la pagina principală
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
