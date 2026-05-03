// Rosmar Soap — Firestore REST API Seeder
import { readFileSync } from 'fs';
import { homedir } from 'os';

const PROJECT_ID = 'rosmar-soap-ph';
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
  { name:'Whitening Sunscreen SPF50',    category:'spf',         price:399,  size:'50ml',  benefit:'Helps prevent sunburn, dark spots, and premature aging',                            image:'', badge:'best', inStock:true },
  { name:'Milky Peeling Soap',           category:'cleanser',    price:199,  size:'135g',  benefit:'Helps brighten and even out skin tone',                                             image:'', badge:'',     inStock:true },
  { name:'SunMuse Sunscreen Lotion SPF50', category:'spf',       price:349,  size:'60ml',  benefit:'Strong SPF50 protection against UVA & UVB rays',                                   image:'', badge:'new',  inStock:true },
  { name:'Charcoal Lumay Soap',          category:'cleanser',    price:149,  size:'135g',  benefit:'Helps reduce blackheads & whiteheads',                                              image:'', badge:'',     inStock:true },
  { name:'Brightening Serum',            category:'serum',       price:499,  size:'30ml',  benefit:'Deeply hydrates and plumps skin',                                                   image:'', badge:'best', inStock:true },
  { name:'Instant Whitening Lotion',     category:'moisturizer', price:299,  size:'200ml', benefit:'Instant brightening effect for a more radiant, even-looking skin tone',             image:'', badge:'',     inStock:true },
  { name:'Babad Soap',                   category:'cleanser',    price:179,  size:'135g',  benefit:'Cleansing + refreshing feel — leaves skin soft and clean after use',                image:'', badge:'',     inStock:true },
  { name:'Glowing Facial Set',           category:'treatment',   price:899,  size:'set',   benefit:'Suitable for maintenance after rejuvenating sets',                                  image:'', badge:'new',  inStock:true },
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
