/**
 * Post-build prerenderer.
 *
 * The app is a client-rendered SPA whose built `dist/index.html` carries only
 * the homepage <head>. Search engines and social scrapers that fetch a URL
 * directly would otherwise see the same homepage title/description on every
 * route. This script writes a static HTML file per indexable route with the
 * correct, keyword-rich <title>, meta description, canonical, Open Graph /
 * Twitter tags and JSON-LD baked into the raw HTML — so the right metadata is
 * present without executing JavaScript.
 *
 * Route list is read from dist/sitemap.xml (single source of truth). Runs
 * automatically after `vite build` via the npm `postbuild` hook.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const SITE = 'https://cleannaija.com';
const DEFAULT_IMAGE = `${SITE}/images/hero-bg.jpg`;

/** Curated metadata for the main marketing routes (keyword-targeted). */
const META = {
  '/': {
    title: 'Professional Cleaning Services in Nigeria | CleanNaija',
    description:
      'CleanNaija is the #1 platform for professional cleaning services in Nigeria — home, office, post-construction, hospital, roof and fumigation cleaning across all 36 states and the FCT. NIN-verified, insured teams, instant online quotes. Spotless. Guaranteed. Nationwide.',
    keywords:
      'cleaning services nigeria, professional cleaners lagos, office cleaning abuja, post construction cleaning, fumigation services nigeria, roof cleaning, hospital cleaning, deep cleaning, house cleaning nigeria',
  },
  '/about': {
    title: 'About CleanNaija & Our Service Areas | CleanNaija',
    description:
      "CleanNaija is Nigeria's #1 digital platform for professional cleaning, serving all 36 states and the FCT with NIN-verified, insured teams and a 100% satisfaction guarantee.",
    keywords: 'about cleannaija, cleaning company nigeria, cleaning service areas, nationwide cleaners',
  },
  '/pricing': {
    title: 'Cleaning Service Pricing in Nigeria | CleanNaija',
    description:
      'Transparent CleanNaija pricing: home cleaning from ₦3,000/room, apartments from ₦15,000, offices from ₦500/sqm, plus fumigation, roof and post-construction rates. Save up to 30% on recurring plans.',
    keywords: 'cleaning prices nigeria, house cleaning cost lagos, office cleaning rates abuja, fumigation price nigeria',
  },
  '/book': {
    title: 'Book a Cleaning Service Online | CleanNaija',
    description:
      'Book professional cleaning in about 60 seconds. Add your locations, pick services, get an instant quote and schedule a NIN-verified CleanNaija team anywhere in Nigeria.',
    keywords: 'book cleaning service nigeria, online cleaning booking, hire cleaners lagos abuja',
  },
  '/blog': {
    title: 'Cleaning Tips & Insights Blog | CleanNaija',
    description:
      'Expert cleaning guides for Nigerian homes and businesses — maintenance in humidity, office hygiene, eco-friendly products and more from the CleanNaija team.',
    keywords: 'cleaning tips nigeria, home maintenance, office hygiene, cleaning blog',
  },
  '/faq': {
    title: 'FAQ & Help Center | CleanNaija',
    description:
      'Answers about booking, coverage, pricing, payments, our 100% satisfaction guarantee, NIN-verified cleaners and recurring plans at CleanNaija.',
    keywords: 'cleannaija faq, cleaning service questions, satisfaction guarantee, verified cleaners',
  },
  '/safety': {
    title: 'Safety & Trust | CleanNaija',
    description:
      'How CleanNaija keeps you safe: NIN-verified pros, real-time GPS tracking, in-app panic button, full asset insurance, before/after photo proof and 24/7 support.',
    keywords: 'safe cleaning service nigeria, verified cleaners, insured cleaning, nin verified',
  },
  '/careers': {
    title: 'Careers & Cleaning Jobs in Nigeria | CleanNaija',
    description:
      'Join the CleanNaija squad. Cleaning and facility roles in Lagos, Abuja and nationwide with training, insurance and the best tools in the industry.',
    keywords: 'cleaning jobs nigeria, cleaner jobs lagos abuja, facility jobs, cleaning careers',
  },
  '/cleaner': {
    title: 'Cleaner Portal & Jobs | CleanNaija',
    description:
      'Find professional cleaning jobs and manage your assignments on the CleanNaija cleaner portal. Get training, insurance and steady work across Nigeria.',
    keywords: 'cleaning jobs nigeria, become a cleaner, cleaner portal, cleaning gigs lagos',
  },
  '/contact': {
    title: 'Contact CleanNaija | 24/7 Cleaning Support',
    description:
      'Reach CleanNaija any time — call 0800-CLEAN-9JA, message us on WhatsApp or email hello@cleannaija.com for bookings, quotes and support nationwide.',
    keywords: 'contact cleannaija, cleaning service support nigeria, cleaning hotline',
  },
  '/privacy': {
    title: 'Privacy Policy | CleanNaija',
    description:
      'How CleanNaija collects, uses and protects your data when you use our professional cleaning services across Nigeria.',
    keywords: 'cleannaija privacy policy, data protection',
  },
  '/terms': {
    title: 'Terms of Service | CleanNaija',
    description:
      "CleanNaija's terms of service — how we deliver cleaning, our 100% satisfaction guarantee, security, NIN-verified pros and your responsibilities as a user.",
    keywords: 'cleannaija terms of service, cleaning terms',
  },
};

const escAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const titleCase = (slug) =>
  slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

function metaForPath(path) {
  if (META[path]) return META[path];
  if (path.startsWith('/services/')) {
    const slug = path.replace('/services/', '');
    const name = titleCase(slug);
    return {
      title: `${name} in Nigeria | CleanNaija`,
      description: `${name} by CleanNaija — professional cleaning across all 36 states and the FCT. NIN-verified, insured teams, transparent pricing and a 100% satisfaction guarantee. Book online in 60 seconds.`,
      keywords: `${name.toLowerCase()}, cleaning services nigeria, cleaners lagos abuja`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name,
        serviceType: name,
        areaServed: { '@type': 'Country', name: 'Nigeria' },
        provider: { '@type': 'Organization', name: 'CleanNaija', url: `${SITE}/` },
      },
    };
  }
  return null;
}

function replaceTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escAttr(title)}</title>`);
}
function replaceMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(">)`);
  return re.test(html) ? html.replace(re, `$1${escAttr(value)}$2`) : html;
}
function replaceCanonical(html, url) {
  return html.replace(/(<link rel="canonical" href=")[^"]*(">)/, `$1${escAttr(url)}$2`);
}
function injectJsonLd(html, obj) {
  if (!obj) return html;
  const safe = JSON.stringify(obj).replace(/</g, '\\u003c');
  return html.replace('</head>', `<script type="application/ld+json">${safe}</script></head>`);
}

function buildHtml(template, path, meta) {
  const url = `${SITE}${path === '/' ? '/' : path}`;
  const image = meta.image || DEFAULT_IMAGE;
  let html = template;
  html = replaceTitle(html, meta.title);
  html = replaceMeta(html, 'name', 'description', meta.description);
  if (meta.keywords) html = replaceMeta(html, 'name', 'keywords', meta.keywords);
  html = replaceCanonical(html, url);
  html = replaceMeta(html, 'property', 'og:title', meta.title);
  html = replaceMeta(html, 'property', 'og:description', meta.description);
  html = replaceMeta(html, 'property', 'og:url', url);
  html = replaceMeta(html, 'property', 'og:image', image);
  html = replaceMeta(html, 'name', 'twitter:title', meta.title);
  html = replaceMeta(html, 'name', 'twitter:description', meta.description);
  html = replaceMeta(html, 'name', 'twitter:image', image);
  html = injectJsonLd(html, meta.jsonLd);
  return html;
}

function getRoutesFromSitemap() {
  const xml = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return locs.map((loc) => loc.replace(SITE, '') || '/').map((p) => (p === '' ? '/' : p));
}

// --- run ---
let template = readFileSync(join(DIST, 'index.html'), 'utf8');
// Make the manifest reference root-absolute so it resolves from nested routes.
template = template.replaceAll('href="./site.webmanifest"', 'href="/site.webmanifest"');

const routes = getRoutesFromSitemap();
let count = 0;
for (const path of routes) {
  const meta = metaForPath(path);
  if (!meta) continue;
  const html = buildHtml(template, path, meta);
  const outDir = path === '/' ? DIST : join(DIST, path);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
  count++;
}

console.log(`Prerendered ${count} routes with per-page SEO metadata.`);
