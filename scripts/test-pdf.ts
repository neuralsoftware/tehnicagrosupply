import { renderToBuffer } from '@react-pdf/renderer';
import { POST } from '../src/app/api/materiale/route.ts';
import { getProducts } from '../src/lib/products-store.ts';

async function test() {
  try {
    const products = await getProducts();
    console.log('Available slugs:', products.map(p => p.slug).slice(0, 3));
    if (products.length === 0) return;
    
    const req = new Request('http://localhost:3000/api/materiale', {
      method: 'POST',
      body: JSON.stringify({
        config: { title: 'Test PDF' },
        productSlugs: [products[0].slug],
        adminAuth: process.env.ADMIN_PASSWORD || 'tehnicagro2026'
      })
    });
    
    process.env.ADMIN_PASSWORD = 'tehnicagro2026';
    
    const res = await POST(req as any);
    console.log(res.status);
    const text = await res.text();
    console.log(text);
  } catch (e) {
    console.error(e);
  }
}

test();
