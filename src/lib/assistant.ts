/**
 * CleanNaija in-site assistant — a self-contained, knowledge-based engine.
 *
 * No external API/keys: user messages are normalized, scored against a curated
 * knowledge base (built from the shared `siteContent` source of truth), and the
 * best-matching intent's answer is returned along with helpful navigation links
 * and quick-reply suggestions. Falls back gracefully when nothing matches.
 */
import { BUSINESS, FAQS, PRICING, SERVICES } from './siteContent';

export interface AssistantLink {
  label: string;
  to: string;
  /** external links (tel:, https://wa.me/...) open in a new tab */
  external?: boolean;
}

export interface AssistantResponse {
  text: string;
  links?: AssistantLink[];
  quickReplies?: string[];
}

interface Intent {
  id: string;
  /** Words/phrases that signal this intent. Multi-word phrases score higher. */
  keywords: string[];
  build: () => AssistantResponse;
}

const BOOK_LINK: AssistantLink = { label: 'Book now', to: '/book' };
const PRICING_LINK: AssistantLink = { label: 'See pricing', to: '/pricing' };
const CALL_LINK: AssistantLink = { label: `Call ${BUSINESS.phoneDisplay}`, to: BUSINESS.phoneDial, external: true };
const WHATSAPP_LINK: AssistantLink = { label: 'WhatsApp us', to: BUSINESS.whatsapp, external: true };

const DEFAULT_QUICK_REPLIES = ['Book a cleaning', 'See pricing', 'What areas do you cover?', 'Talk to support'];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s₦]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Map a pricing keyword in the message to a specific example range. */
function findPricingExample(msg: string): { service: string; range: string } | null {
  const map: Record<string, string> = {
    'per room': 'Home cleaning (per room)',
    room: 'Home cleaning (per room)',
    apartment: '2-bedroom apartment',
    flat: '2-bedroom apartment',
    house: '4-bedroom+ house',
    office: 'Office (per sq. metre)',
    workspace: 'Office (per sq. metre)',
    construction: 'Post-construction (per sq. metre)',
    hospital: 'Hospital ward',
    medical: 'Hospital ward',
    ward: 'Hospital ward',
    roof: 'Roof cleaning',
    sofa: 'Sofa cleaning (per seat)',
    upholstery: 'Sofa cleaning (per seat)',
    fumigation: 'Fumigation (per room)',
    pest: 'Fumigation (per room)',
  };
  for (const key of Object.keys(map)) {
    if (msg.includes(key)) {
      const found = PRICING.examples.find((e) => e.service === map[key]);
      if (found) return found;
    }
  }
  return null;
}

const INTENTS: Intent[] = [
  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'how far', 'yo'],
    build: () => ({
      text: `Hello! 👋 Welcome to CleanNaija — ${BUSINESS.tagline} I can help with services, pricing, coverage, booking and more. What do you need?`,
      quickReplies: DEFAULT_QUICK_REPLIES,
    }),
  },
  {
    id: 'thanks',
    keywords: ['thanks', 'thank you', 'thank', 'appreciate', 'nice one', 'well done'],
    build: () => ({
      text: "You're welcome! 😊 Anything else I can help you with?",
      quickReplies: ['Book a cleaning', 'See pricing', 'Talk to support'],
    }),
  },
  {
    id: 'booking',
    keywords: ['book', 'booking', 'order', 'schedule', 'appointment', 'how do i book', 'request service', 'get started'],
    build: () => ({
      text: 'Booking takes about 60 seconds: 1) Add your location(s), 2) Pick your services, 3) Get an instant quote, 4) Choose a date/time, 5) Pay securely. A NIN-verified team is then dispatched to you.',
      links: [BOOK_LINK, PRICING_LINK],
      quickReplies: ['How much does it cost?', 'What areas do you cover?'],
    }),
  },
  {
    id: 'coverage',
    keywords: ['area', 'areas', 'cover', 'coverage', 'location', 'where', 'available', 'state', 'states', 'city', 'near me', 'lagos', 'abuja', 'port harcourt', 'kano', 'ibadan'],
    build: () => ({
      text: `We're nationwide — CleanNaija serves all 36 states and the FCT, with dedicated hubs in ${BUSINESS.hubs.join(', ')}. Tell me your city during booking and we'll match you with a local team.`,
      links: [BOOK_LINK],
      quickReplies: ['Book a cleaning', 'See pricing'],
    }),
  },
  {
    id: 'guarantee',
    keywords: ['guarantee', 'satisfaction', 'refund', 'not happy', 'not satisfied', 're-clean', 'reclean', 'money back', 'quality'],
    build: () => ({
      text: 'We back every clean with a 100% Satisfaction Guarantee — if you are not happy with the result, we will re-clean for free. Just let us know within 24 hours.',
      links: [BOOK_LINK],
      quickReplies: ['Are your cleaners verified?', 'Book a cleaning'],
    }),
  },
  {
    id: 'safety',
    keywords: ['safe', 'safety', 'trust', 'verified', 'background', 'background check', 'nin', 'insurance', 'insured', 'theft', 'secure', 'panic', 'tracking', 'gps'],
    build: () => ({
      text: 'Your safety is core to us: every cleaner is background-checked and NIN-verified, teams are fully insured against accidental damage, you get real-time GPS tracking, before/after photo proof, an in-app panic button and 24/7 support.',
      links: [{ label: 'Safety & trust', to: '/safety' }, BOOK_LINK],
      quickReplies: ['Book a cleaning', 'What areas do you cover?'],
    }),
  },
  {
    id: 'payment',
    keywords: ['pay', 'payment', 'paystack', 'flutterwave', 'card', 'transfer', 'bank', 'ussd', 'how to pay', 'wallet'],
    build: () => ({
      text: 'Payments are secure and online via Paystack (primary) or Flutterwave — card, bank transfer and USSD are all supported. No hidden processing fees.',
      links: [BOOK_LINK, PRICING_LINK],
    }),
  },
  {
    id: 'supplies',
    keywords: ['supplies', 'products', 'equipment', 'tools', 'bring', 'detergent', 'chemicals', 'eco', 'eco-friendly'],
    build: () => ({
      text: 'No need to provide anything — our teams arrive fully equipped with professional tools and eco-friendly cleaning products at no extra charge.',
      links: [BOOK_LINK],
    }),
  },
  {
    id: 'recurring',
    keywords: ['subscription', 'recurring', 'weekly', 'bi-weekly', 'biweekly', 'monthly', 'quarterly', 'discount', 'save', 'contract', 'plan', 'regular'],
    build: () => ({
      text: `Recurring plans save you money: ${PRICING.discounts.map((d) => `${d.frequency} — ${d.discount}`).join('; ')}. You can manage a plan from your dashboard.`,
      links: [PRICING_LINK, BOOK_LINK],
    }),
  },
  {
    id: 'cancel',
    keywords: ['cancel', 'reschedule', 'change booking', 'change my booking', 'postpone', 'move my booking'],
    build: () => ({
      text: 'You can reschedule or cancel any time from your Customer Dashboard, or by calling our hotline. Recurring visits can be paused too.',
      links: [{ label: 'My dashboard', to: '/dashboard' }, CALL_LINK],
    }),
  },
  {
    id: 'jobs',
    keywords: ['job', 'jobs', 'career', 'careers', 'work', 'hiring', 'apply', 'employment', 'become a cleaner', 'vacancy'],
    build: () => ({
      text: 'We\'re always recruiting great cleaners and facility leads — with training, insurance and the best tools in the industry. Check open roles and apply on our careers page.',
      links: [{ label: 'View jobs', to: '/careers' }, { label: 'Cleaner portal', to: '/cleaner' }],
    }),
  },
  {
    id: 'account',
    keywords: ['login', 'log in', 'sign up', 'signup', 'register', 'account', 'dashboard', 'my bookings', 'profile'],
    build: () => ({
      text: 'You can create an account or log in to book faster, track jobs and manage bookings from your dashboard.',
      links: [{ label: 'Login / Sign up', to: '/auth' }, { label: 'My dashboard', to: '/dashboard' }],
    }),
  },
  {
    id: 'hours',
    keywords: ['hours', 'open', 'time', 'when', 'same day', 'today', 'how soon', 'how fast', 'opening'],
    build: () => ({
      text: 'We operate every day, 8:00am–8:00pm, with same-day cleaning available in many areas. Pick your preferred date and time slot during booking.',
      links: [BOOK_LINK],
    }),
  },
  {
    id: 'contact',
    keywords: ['contact', 'phone', 'call', 'whatsapp', 'email', 'support', 'human', 'agent', 'talk to', 'reach', 'hotline', 'help'],
    build: () => ({
      text: `Our team is available 24/7. Call ${BUSINESS.phoneDisplay}, message us on WhatsApp, or email ${BUSINESS.email}.`,
      links: [CALL_LINK, WHATSAPP_LINK, { label: 'Help center', to: '/faq' }],
    }),
  },
  {
    id: 'languages',
    keywords: ['language', 'languages', 'yoruba', 'hausa', 'igbo', 'pidgin', 'english', 'speak'],
    build: () => ({
      text: `We support ${BUSINESS.languages.join(', ')} so you can engage in the language you're most comfortable with.`,
      quickReplies: DEFAULT_QUICK_REPLIES,
    }),
  },
  {
    id: 'about',
    keywords: ['about', 'who are you', 'what is cleannaija', 'what do you do', 'tell me about'],
    build: () => ({
      text: BUSINESS.description,
      links: [{ label: 'About us', to: '/about' }, BOOK_LINK],
      quickReplies: ['What services do you offer?', 'What areas do you cover?'],
    }),
  },
  {
    id: 'services',
    keywords: ['service', 'services', 'what do you offer', 'what can you clean', 'types of cleaning', 'list', 'options'],
    build: () => ({
      text: `We offer residential and commercial cleaning, including: ${SERVICES.slice(0, 8).map((s) => s.title).join(', ')} and more — ${SERVICES.length} services in total.`,
      links: [BOOK_LINK, PRICING_LINK],
      quickReplies: ['Home cleaning price', 'Office cleaning price', 'Fumigation', 'Post-construction'],
    }),
  },
];

/** Try to match the message to a specific service in the catalogue. */
function matchService(msg: string): AssistantResponse | null {
  let best: { score: number; service: (typeof SERVICES)[number] } | null = null;
  for (const service of SERVICES) {
    const terms = [...service.title.toLowerCase().split(/\s+/), ...service.keywords];
    let score = 0;
    for (const term of terms) {
      if (term.length > 2 && msg.includes(term)) score += term.includes(' ') ? 3 : 1;
    }
    // whole-title phrase match is a strong signal
    if (msg.includes(service.title.toLowerCase())) score += 5;
    if (score > 0 && (!best || score > best.score)) best = { score, service };
  }
  if (best && best.score >= 2) {
    const s = best.service;
    return {
      text: `Yes — we offer ${s.title} (${s.category}). You can see full details, what's included and pricing on its page, then book in a minute.`,
      links: [{ label: `View ${s.title}`, to: `/services/${s.slug}` }, BOOK_LINK],
      quickReplies: ['How much does it cost?', 'What areas do you cover?'],
    };
  }
  return null;
}

function scoreIntent(msg: string, intent: Intent): number {
  let score = 0;
  for (const kw of intent.keywords) {
    if (kw.includes(' ')) {
      if (msg.includes(kw)) score += 3;
    } else {
      // word-boundary match to avoid partial-word false positives
      if (new RegExp(`\\b${kw}\\b`).test(msg)) score += 1;
    }
  }
  return score;
}

export function getWelcomeMessage(): AssistantResponse {
  return {
    text: `Hi! 👋 I'm the CleanNaija assistant. Ask me about our cleaning services, pricing, coverage, safety or how to book — I'm here 24/7.`,
    quickReplies: DEFAULT_QUICK_REPLIES,
  };
}

export function getAssistantReply(rawMessage: string): AssistantResponse {
  const msg = normalize(rawMessage);
  if (!msg) {
    return { text: 'Please type a question and I\'ll help right away. 🙂', quickReplies: DEFAULT_QUICK_REPLIES };
  }

  // 1) Pricing questions — handle first so we can return a specific range.
  const asksPrice = /\b(price|prices|pricing|cost|costs|how much|charge|charges|rate|rates|fee|fees|quote|afford|budget)\b/.test(msg);
  if (asksPrice) {
    const example = findPricingExample(msg);
    if (example) {
      return {
        text: `${example.service}: ${example.range}. Final price depends on size, condition and tier (Basic / Premium / Elite). Get an exact, instant quote when you book.`,
        links: [PRICING_LINK, BOOK_LINK],
        quickReplies: ['What areas do you cover?', 'Book a cleaning'],
      };
    }
    return {
      text: `Pricing is transparent and tier-based (Basic / Premium / Elite). Examples: home cleaning ${PRICING.examples[0].range}/room, offices from ₦500/sqm, fumigation ${PRICING.examples[10].range}. Recurring plans save up to 30%.`,
      links: [PRICING_LINK, BOOK_LINK],
      quickReplies: ['Home cleaning price', 'Office cleaning price', 'Subscription discounts'],
    };
  }

  // 2) Specific service mentions ("do you do roof cleaning?").
  const serviceMatch = matchService(msg);

  // 3) Score generic intents.
  let bestIntent: { score: number; intent: Intent } | null = null;
  for (const intent of INTENTS) {
    const score = scoreIntent(msg, intent);
    if (score > 0 && (!bestIntent || score > bestIntent.score)) bestIntent = { score, intent };
  }

  // Prefer a strong service match over a weak generic intent.
  if (serviceMatch && (!bestIntent || bestIntent.score < 3)) return serviceMatch;
  if (bestIntent) return bestIntent.intent.build();
  if (serviceMatch) return serviceMatch;

  // 4) Direct FAQ fallback — match against the FAQ questions.
  const faqHit = FAQS.find((f) => {
    const q = normalize(f.question);
    const shared = q.split(' ').filter((w) => w.length > 3 && msg.includes(w)).length;
    return shared >= 2;
  });
  if (faqHit) {
    return { text: faqHit.answer, links: [BOOK_LINK], quickReplies: DEFAULT_QUICK_REPLIES };
  }

  // 5) Nothing matched.
  return {
    text: "I'm not totally sure about that one, but I can help with services, pricing, coverage, safety, payments and booking — or connect you to our 24/7 team.",
    links: [CALL_LINK, WHATSAPP_LINK],
    quickReplies: DEFAULT_QUICK_REPLIES,
  };
}
