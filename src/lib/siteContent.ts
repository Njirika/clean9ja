/**
 * Single source of truth for Clean9ja marketing/site content.
 *
 * Shared by the SEO layer (JSON-LD structured data, sitemap) and the in-site
 * chat assistant's knowledge base, so facts about services, pricing, coverage
 * and policies stay consistent everywhere.
 */

export const SITE_URL = 'https://clean9ja.com';

export const BUSINESS = {
  name: 'Clean9ja',
  legalName: 'Clean9ja Professional Cleaning Services',
  tagline: 'Spotless. Guaranteed. Nationwide.',
  description:
    "Nigeria's premier platform for professional cleaning services — home, office, post-construction, hospital, roof/exterior and specialty cleaning across all 36 states and the FCT.",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/images/hero-bg.jpg`,
  phoneDisplay: '0800-CLEAN-9JA',
  phoneDial: 'tel:0800-CLEAN-9JA',
  whatsapp: 'https://wa.me/2348000000000',
  email: 'hello@clean9ja.com',
  currency: 'NGN',
  priceRange: '₦₦',
  languages: ['English', 'Nigerian Pidgin', 'Yoruba', 'Hausa', 'Igbo'],
  hubs: ['Lagos', 'Abuja', 'Port Harcourt'],
  areaServed: 'Nigeria (all 36 states and the FCT)',
  sameAs: [
    'https://web.facebook.com/clean9ja',
    'https://www.instagram.com/clean9ja',
    'https://twitter.com/clean9ja',
    'https://www.linkedin.com/company/clean9ja',
  ],
  hours: 'Mo-Su 08:00-20:00',
};

export interface ServiceInfo {
  title: string;
  slug: string;
  category: 'residential' | 'commercial';
  keywords: string[];
}

/** Deduped service catalogue (slugs mirror the routes used across the app). */
export const SERVICES: ServiceInfo[] = [
  { title: 'Full Building Face-lift', slug: 'full-building-face-lift', category: 'residential', keywords: ['building', 'facelift', 'exterior', 'restoration'] },
  { title: 'Interlock & Driveway Shine', slug: 'interlock-driveway-shine', category: 'residential', keywords: ['interlock', 'driveway', 'paving', 'stone'] },
  { title: 'Roof & Parapet Washing', slug: 'roof-parapet-washing', category: 'residential', keywords: ['roof', 'parapet', 'washing'] },
  { title: 'Low-Pressure Soft Wash', slug: 'low-pressure-soft-wash', category: 'residential', keywords: ['soft wash', 'pressure', 'gentle'] },
  { title: 'Annual Estate Power Wash', slug: 'annual-estate-power-wash', category: 'residential', keywords: ['estate', 'power wash', 'annual'] },
  { title: 'Fence & Stonework Washing', slug: 'fence-stonework-washing', category: 'residential', keywords: ['fence', 'stonework', 'wall'] },
  { title: 'Veranda & Deck Care', slug: 'veranda-deck-care', category: 'residential', keywords: ['veranda', 'deck', 'patio', 'pergola'] },
  { title: 'Gutter De-clogging', slug: 'gutter-de-clogging', category: 'residential', keywords: ['gutter', 'declog', 'drainage'] },
  { title: 'Standard Home Shine', slug: 'standard-home-shine', category: 'residential', keywords: ['home', 'house', 'apartment', 'standard', 'regular'] },
  { title: 'Deep Restoration Clean', slug: 'deep-restoration-clean', category: 'residential', keywords: ['deep clean', 'restoration', 'sofa', 'mattress', 'laundry', 'upholstery'] },
  { title: 'Professional Fumigation', slug: 'professional-fumigation', category: 'residential', keywords: ['fumigation', 'pest', 'insects', 'rodent', 'disinfection'] },
  { title: 'Festive Decor Installation', slug: 'festive-decor-installation', category: 'residential', keywords: ['festive', 'decor', 'christmas', 'event'] },
  { title: 'Corporate Fleet Maintenance', slug: 'corporate-fleet-maintenance', category: 'commercial', keywords: ['fleet', 'truck', 'vehicle', 'car wash', 'corporate'] },
  { title: 'Office & Workspace Hygiene', slug: 'office-workspace-hygiene', category: 'commercial', keywords: ['office', 'workspace', 'corporate', 'commercial', 'janitorial'] },
  { title: 'Restaurant & Eatery Cleaning', slug: 'restaurant-eatery-cleaning', category: 'commercial', keywords: ['restaurant', 'eatery', 'kitchen', 'food'] },
  { title: 'Shop Front & Signage Shine', slug: 'shop-front-signage-shine', category: 'commercial', keywords: ['shop', 'signage', 'storefront', 'retail'] },
  { title: 'Reception & Lobby Detail', slug: 'reception-lobby-detail', category: 'commercial', keywords: ['reception', 'lobby', 'entrance'] },
  { title: 'Estate & Block Maintenance', slug: 'estate-block-maintenance', category: 'commercial', keywords: ['estate', 'block', 'facility', 'maintenance'] },
  { title: 'Elderly Home Sanitization', slug: 'elderly-home-sanitization', category: 'commercial', keywords: ['elderly', 'medical', 'hospital', 'healthcare', 'sanitization', 'ward'] },
  { title: 'Hotel & Resort Maintenance', slug: 'hotel-resort-maintenance', category: 'commercial', keywords: ['hotel', 'resort', 'hospitality'] },
  { title: 'Post-Build Cleanup', slug: 'post-build-cleanup', category: 'commercial', keywords: ['post construction', 'post build', 'construction', 'debris', 'rough clean'] },
  { title: 'Arena & Sports Complex Care', slug: 'arena-sports-complex-care', category: 'commercial', keywords: ['arena', 'stadium', 'sports', 'complex'] },
  { title: 'Plaza & Mall Management', slug: 'plaza-mall-management', category: 'commercial', keywords: ['plaza', 'mall', 'shopping'] },
  { title: 'Public Building Cleaning', slug: 'public-building-cleaning', category: 'commercial', keywords: ['public', 'government', 'institution'] },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: 'How do I book a cleaning service?',
    answer:
      'You can book in about 60 seconds on our website. Choose your service, enter your location and details, and you get an instant quote. Pay securely with Paystack or Flutterwave and we dispatch a verified team.',
  },
  {
    question: 'What areas do you cover?',
    answer:
      'Clean9ja is nationwide — we serve all 36 states and the FCT, with dedicated local teams and hubs in Lagos, Abuja and Port Harcourt.',
  },
  {
    question: 'Are your cleaners background-checked?',
    answer:
      'Yes. Every cleaner undergoes a rigorous background check and NIN (National Identity Number) verification before joining a field team. Elite jobs are led by a NIN-verified team lead.',
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer:
      "We offer a 100% Satisfaction Guarantee. If you're not happy with the clean, we will re-clean for free.",
  },
  {
    question: 'Do you provide cleaning supplies?',
    answer:
      'Yes. Our teams arrive fully equipped with professional tools and eco-friendly cleaning products at no extra charge.',
  },
  {
    question: 'Can I reschedule or cancel my booking?',
    answer:
      'Absolutely. You can manage, reschedule or cancel bookings from your Customer Dashboard, or by calling our hotline 0800-CLEAN-9JA.',
  },
  {
    question: 'How do I pay?',
    answer:
      'Payments are secure and online via Paystack (primary) or Flutterwave — card, bank transfer and USSD are supported. There are no hidden processing fees.',
  },
  {
    question: 'Do you offer recurring or contract cleaning?',
    answer:
      'Yes. Recurring plans save you money: 25% off weekly, 20% off bi-weekly, 15% off monthly, and 30% off quarterly contracts.',
  },
];

export interface PricingTier {
  tier: string;
  desc: string;
  features: string[];
}

export const PRICING = {
  tiers: [
    { tier: 'Basic', desc: 'Standard shine for regular maintenance', features: ['Vacuum & mop', 'Surface dusting', 'Trash removal'] },
    { tier: 'Premium', desc: 'Deep restoration and clinical sanitization', features: ['Industrial degreasing', 'Inside cabinets', 'Wall spot cleaning'] },
    { tier: 'Elite', desc: 'Medical-grade protocol for high-stakes spaces', features: ['NIN-verified lead', 'HEPA filtration', 'Full asset insurance'] },
  ] as PricingTier[],
  examples: [
    { service: 'Home cleaning (per room)', range: '₦3,000 – ₦15,000' },
    { service: '1-bedroom apartment', range: '₦15,000 – ₦40,000' },
    { service: '2-bedroom apartment', range: '₦20,000 – ₦55,000' },
    { service: '3-bedroom apartment', range: '₦25,000 – ₦70,000' },
    { service: '4-bedroom+ house', range: '₦35,000 – ₦100,000+' },
    { service: 'Office (per sq. metre)', range: '₦500 – ₦1,200' },
    { service: 'Post-construction (per sq. metre)', range: '₦800 – ₦2,000' },
    { service: 'Hospital ward', range: '₦50,000 – ₦150,000' },
    { service: 'Roof cleaning', range: '₦20,000 – ₦60,000+' },
    { service: 'Sofa cleaning (per seat)', range: '₦3,000 – ₦5,000' },
    { service: 'Fumigation (per room)', range: '₦5,000 – ₦12,000' },
  ],
  discounts: [
    { frequency: 'Weekly', discount: '25% off per visit' },
    { frequency: 'Bi-weekly', discount: '20% off per visit' },
    { frequency: 'Monthly', discount: '15% off per visit' },
    { frequency: 'Quarterly contract', discount: '30% off total' },
  ],
};

/** Public, indexable routes for the sitemap (excludes auth/admin/dashboard). */
export const INDEXABLE_ROUTES = [
  '/',
  '/about',
  '/pricing',
  '/book',
  '/blog',
  '/faq',
  '/safety',
  '/careers',
  '/cleaner',
  '/contact',
  '/privacy',
  '/terms',
];
