export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    imageSrc: string;
    category: 'fonduri-europene' | 'tehnologie' | 'noutati';
}

export const BLOG_POSTS: BlogPost[] = [
    {
        id: 'subventia-apia-pd-04',
        slug: 'subventia-apia-pd-04-ghid-complet',
        title: 'Subvenția APIA PD-04: Cum primești 56 EUR/ha pentru No-Till',
        excerpt: 'Află cerințele tehnice pentru eco-schema PD-04 și cum poți transforma ferma ta într-o exploatație profitabilă și sustenabilă.',
        content: `
      <h2>Ce este Eco-schema PD-04?</h2>
      <p>Eco-schema PD-04 (Practici agricole benefice pentru mediu aplicabile pe terenul arabil) este una dintre cele mai atractive forme de sprijin pentru fermierii români care adoptă agricultura conservativă.</p>
      
      <h3>Cerințe principale:</h3>
      <ul>
        <li>Utilizarea tehnologiilor No-Till, Mini-Till sau Strip-Till.</li>
        <li>Menținerea resturilor vegetale la suprafața solului.</li>
        <li>Interdicția arăturii clasice cu răsturnarea brazdei.</li>
      </ul>

      <p>Utilajele precum semănătoarea <strong>Avers-Agro Green Plains</strong> sunt special concepute pentru a îndeplini aceste criterii, asigurând în același timp o răsărire uniformă.</p>
    `,
        author: 'Echipa TehnicAgro',
        date: '2026-02-15',
        imageSrc: '/blog/apia-pd04.jpg',
        category: 'fonduri-europene'
    }
];
