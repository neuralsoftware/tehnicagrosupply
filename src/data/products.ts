export interface Product {
    id: string;
    slug: string;
    category: 'pregatire-sol' | 'semanat-fertilizat' | 'protectia-plantelor' | 'recoltare-logistica';
    name: string;
    brand: string;
    badge?: string;
    description: string;
    imageSrc: string;
    specs: string[];
    detailedSpecs: any;
    expertVerdict: string;
    priceRange?: string;
    eligibility?: string;
}

export const PRODUCTS: Product[] = [
    {
        id: 'avers-agro-green-plains-ads',
        slug: 'green-plains-ads',
        category: 'semanat-fertilizat',
        name: 'Avers-Agro Green Plains ADS',
        brand: 'Avers-Agro',
        badge: 'ELIGIBIL APIA PD-04',
        description: 'Sistemul de suspensie paralelogram asigură o copiere perfectă a solului, iar presiunea de 190 kg/brăzdar garantează penetrarea în orice miriște. Singura soluție reală pentru încasarea subvenției de 56 EUR/ha fără compromisuri la răsărire.',
        imageSrc: '/products/avers-green-plains.jpg',
        specs: [
            'Presiune Brăzdar: 190 kg (reglabilă)',
            'Adâncime: 1 - 9 cm (precizie 0.5 cm)',
            'Sistem Suspensie: Paralelogram Independent',
            'Disc Despicător: Oțel rezistent, unghi 10°'
        ],
        detailedSpecs: {
            Generale: {
                'Model': 'Multisem ADS',
                'Tip': 'Semănătoare Directă Mecanică',
                'Tehnologie': 'No-Till / Mini-Till / Convențional',
                'Distanță rânduri': '18.75 cm',
                'Adâncime semănat': '1 - 9 cm (ajustabilă 0.5 cm)',
                'Viteză lucru': '8 - 12 km/h'
            },
            Performanta_si_Dimensiuni: [
                { Model: 'ADS 3', Latime: '3.0 m', Buncar: '2400 L', Brăzdare: '16', Putere: '90-110 CP' },
                { Model: 'ADS 4', Latime: '4.1 m', Buncar: '2400 L', Brăzdare: '22', Putere: '150-170 CP' },
                { Model: 'ADS 6', Latime: '6.3 m', Buncar: '4000 L', Brăzdare: '36', Putere: '180-200 CP' }
            ],
            Sistem_Semant: {
                'Brăzdar': 'Dublu disc decalat',
                'Presiune': 'Până la 190 kg',
                'Suspensie': 'Paralelogram Independent',
                'Roată tasare': 'Reglabilă, 3 poziții unghi atac'
            }
        },
        expertVerdict: 'O soluție tehnică remarcabilă care menține adâncimea de semănat constantă chiar și în soluri extrem de compactate, asigurând răsărirea uniformă esențială pentru conformarea cu eco-schema PD-04.',
    },
    {
        id: 'fliegl-chain-disc-kse-680',
        slug: 'chain-disc-kse-680',
        category: 'pregatire-sol',
        name: 'Fliegl Chain Disc KSE 680',
        brand: 'Fliegl',
        badge: 'SOLUȚIE GAEC 6 - 2026',
        description: 'Grapa cu lanțuri (6.8m) care nu îngroapă resturile vegetale, ci le presează plat, formând stratul de protecție obligatoriu prin GAEC 6. Viteza de 18 km/h îți permite să lucrezi 100ha într-o singură zi cu un consum minim.',
        imageSrc: '/products/fliegl-kse-680.jpg',
        specs: [
            'Lățime de lucru: 6.8 m',
            'Randament: ~12 ha/oră (Viteză 10-18 km/h)',
            'Greutate Variabilă: 120 - 148 kg/m',
            'Efect: Mărunțire agresivă fără îngropare'
        ],
        detailedSpecs: {
            Date_Tehnice: {
                'Lățime de lucru': 'aprox. 6.8 m',
                'Randament': 'până la 12 ha/oră',
                'Viteză de lucru': '10 - 18 km/h',
                'Putere necesară': '150 - 250 CP',
                'Greutate': '5700 kg',
                'Lungime': '10.8 m'
            },
            Constructie: {
                'Diametru discuri': '350 mm (Oțel călit)',
                'Distanță discuri': '130 mm',
                'Cadru': 'Cruce, 4 părți deschise',
                'Pliere': 'Hidraulică'
            },
            Echipare_Standard: {
                'Prindere': 'Tirant inferior Cat II / III',
                'Hidraulică': '3 conexiuni dublu efect',
                'Frânare': 'Sistem pneumatic inclus'
            }
        },
        expertVerdict: 'Esențială pentru fermierii care vor să respecte GAEC 6 fără să investească în utilaje complexe de prelucrare. Chain Disc-ul Fliegl transformă resturile vegetale într-o barieră termică pentru sol, păstrând umiditatea critică.',
    },
    {
        id: 'k-factor-powerbank',
        slug: 'powerbank',
        category: 'recoltare-logistica',
        name: 'K-Factor POWERBANK',
        brand: 'K-Factor',
        badge: 'Eficiență Maximă',
        description: 'Remorcă de transbordare de mare capacitate cu două axe, concepută pentru a elimina timpii morți ai combinelor. Permite descărcarea completă a 24 tone de cereale în mai puțin de 3 minute.',
        imageSrc: '/products/k-factor-powerbank.jpg',
        specs: [
            'Volum util: 30 m³',
            'Capacitate: 24 tone',
            'Viteză descărcare: 8 m³/min',
            'Putere tractor: 180 - 220 CP'
        ],
        detailedSpecs: {
            Performanță: {
                'Volum util': '30 m³',
                'Capacitate încărcare': '24.000 kg',
                'Viteză descărcare': '8 m³/min',
                'Timp descărcare': 'Sub 3 minute'
            },
            Tehnic: {
                'Masa proprie': '6.150 kg',
                'Viteză maximă': '40 km/h',
                'Diametru șnec': '410 mm',
                'Înălțime descărcare': '4.200 mm'
            },
            Avantaje: {
                'Presiune sol': 'Sub 1.4 kg/cm²',
                'Sistem axe': 'Dublă axă pentru stabilitate',
                'Mentenanță': 'Trapă mare pentru curățare rapidă'
            }
        },
        expertVerdict: 'Un "cal de povară" indispensabil pentru fermele mari. Stabilitatea celor două axe și viteza de descărcare fac din Powerbank soluția ideală pentru a păstra combinele în mișcare continuă.',
    },
    {
        id: 'k-factor-booster',
        slug: 'booster',
        category: 'recoltare-logistica',
        name: 'K-Factor BOOSTER',
        brand: 'K-Factor',
        badge: 'Protecție Sol & Tehnologie',
        description: 'Inovație pe o singură axă cu ecartament variabil hidraulic (3.0m - 3.5m). Ideală pentru fermele No-Till care pun preț pe manevrabilitate și reducerea tasării solului.',
        imageSrc: '/products/k-factor-booster.jpg',
        specs: [
            'Volum util: 31 m³',
            'Capacitate: 22.5 tone',
            'Ecartament Variabil: 3.0 - 3.5 m',
            'Transfer blând: Șnec 520 mm'
        ],
        detailedSpecs: {
            Performanță: {
                'Volum util': '31 m³',
                'Capacitate încărcare': '22.500 kg',
                'Viteză descărcare': '11.5 tone/min',
                'Sistem axe': 'O singură axă (Manevrabilitate)'
            },
            Inovație: {
                'Ecartament variabil': '3.0 m - 3.5 m (Hidraulic)',
                'Diametru șnec': '520 mm (Protecție semințe)',
                'Dimensiuni': '8.250 x 2.990 x 3.995 mm'
            },
            Expert: {
                'Protecție sol': 'Reducere maximă a tasării',
                'Manevrare': 'Ideală pentru spații strâmte',
                'Utilizare': 'Cereale, Leguminoase, Semințe delicate'
            }
        },
        expertVerdict: 'Booster este mai mult decât o remorcă; este un instrument de precizie. Ecartamentul variabil protejează stratul de sol, iar șnecul supradimensionat asigură un transfer extrem de blând al semințelor.',
    }
];
