// Rosmar Soap — Firestore REST API Seeder
import { readFileSync } from 'fs';
import { homedir } from 'os';

const PROJECT_ID = 'rosmar-skincare-ph';
const BASE_URL   = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const config      = JSON.parse(readFileSync(homedir() + '/.config/configstore/firebase-tools.json', 'utf8'));
const accessToken = config.tokens.access_token;

const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

function toVal(val) {
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number' && Number.isInteger(val)) return { integerValue: String(val) };
  if (typeof val === 'number') return { doubleValue: val };
  if (typeof val === 'string') return { stringValue: val };
  return { stringValue: String(val) };
}
function toDoc(obj) {
  return { fields: Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, toVal(v)])) };
}

const products = [
  { name:'Luminous Gel Cleanser',       category:'cleanser',    price:890,  size:'150ml', benefit:'Deeply cleanses & brightens dull skin',      image:'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&auto=format&fit=crop&q=80',          badge:'best', inStock:true },
  { name:'Milk & Honey Oil Cleanser',    category:'cleanser',    price:1190, size:'100ml', benefit:'Melts makeup & nourishes deeply',             image:'https://images.unsplash.com/photo-1556228841-a3c527ebefe5?w=600&auto=format&fit=crop&q=80',          badge:'',     inStock:true },
  { name:'Rose Water Balancing Toner',   category:'toner',       price:790,  size:'200ml', benefit:'Balances pH & preps skin for serums',         image:'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop&q=80',      badge:'',     inStock:true },
  { name:'Niacinamide Clarity Toner',    category:'toner',       price:950,  size:'200ml', benefit:'Minimises pores & controls oil',              image:'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=601&auto=format&fit=crop&q=80', badge:'new',  inStock:true },
  { name:'24K Gold Radiance Serum',      category:'serum',       price:1590, size:'30ml',  benefit:'Firms, brightens & reduces dark spots',       image:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',        badge:'new',  inStock:true },
  { name:'Vitamin C Brightening Serum',  category:'serum',       price:1390, size:'30ml',  benefit:'Fades hyperpigmentation & evens skin tone',   image:'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=601&auto=format&fit=crop&q=80',  badge:'',     inStock:true },
  { name:'Desert Rose Moisturizer',      category:'moisturizer', price:1290, size:'50ml',  benefit:'Intensely hydrates & softens texture',        image:'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80',        badge:'best', inStock:true },
  { name:'Oud & Shea Night Butter',      category:'moisturizer', price:1490, size:'50ml',  benefit:'Rich overnight repair & restoration',         image:'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=601&auto=format&fit=crop&q=80',    badge:'',     inStock:true },
  { name:'Saffron Eye Revival Cream',    category:'treatment',   price:1890, size:'15ml',  benefit:'Reduces dark circles & puffiness',            image:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80',        badge:'new',  inStock:true },
  { name:'Gold Infusion Face Mask',      category:'treatment',   price:2490, size:'75ml',  benefit:'Instant luminosity & deep detox',             image:'https://images.unsplash.com/photo-1570194065650-d99fb4abbd90?w=600&h=601&auto=format&fit=crop&q=80',  badge:'',     inStock:true },
  { name:'Veil SPF 50+ Sunscreen Fluid', category:'spf',         price:990,  size:'50ml',  benefit:'Invisible protection with a dewy finish',     image:'https://images.unsplash.com/photo-1570194065650-d99fb4abbd90?w=600&auto=format&fit=crop&q=80',        badge:'best', inStock:true },
  { name:'Tinted SPF 40 Skin Tint',      category:'spf',         price:1190, size:'30ml',  benefit:'Sheer coverage with full sun protection',     image:'https://images.unsplash.com/photo-1556228841-a3c527ebefe5?w=600&h=601&auto=format&fit=crop&q=80',    badge:'',     inStock:true },
];

async function seed() {
  console.log('Seeding Rosmar Soap products...\n');

  // Check existing
  const check = await fetch(`${BASE_URL}/products?pageSize=1`, { headers });
  const checkData = await check.json();
  if (checkData.documents?.length) {
    console.log('Products already exist. Delete them from the admin panel first to re-seed.');
    process.exit(0);
  }
  if (checkData.error) {
    console.error('Firestore error:', checkData.error.message);
    console.error('Make sure Firestore is enabled at: https://console.firebase.google.com/project/rosmar-skincare-ph/firestore');
    process.exit(1);
  }

  const now = new Date().toISOString();
  let count = 0;
  for (const p of products) {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST', headers,
      body: JSON.stringify(toDoc({ ...p, createdAt: now, updatedAt: now })),
    });
    const result = await res.json();
    if (result.name) { console.log(`  Added: ${p.name}`); count++; }
    else console.error(`  Failed: ${p.name}`, result.error?.message || '');
  }

  console.log(`\nDone! ${count} products added to Firestore.`);
  process.exit(0);
}

seed().catch(e => { console.error('Error:', e.message); process.exit(1); });
