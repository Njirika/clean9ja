/**
 * Clean9ja Third-Party Integrations Utility
 *
 * Client-side integration config + analytics hooks. Public keys/DSNs come from
 * Vite env vars (`VITE_*`) so they can be set per-environment in Vercel.
 *
 * NOTE: Server-side concerns (sending SMS/email, charging cards, signing
 * payments) live in the backend — never call those from the browser. Use the
 * typed API client in `./api` to talk to the backend instead.
 */

// --- 1. PAYMENT GATEWAYS (public keys only) ---

export const PaymentGateways = {
  paystack: {
    name: 'Paystack',
    primary: true,
    methods: ['Card', 'Bank Transfer', 'USSD'],
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
  },
  flutterwave: {
    name: 'Flutterwave',
    primary: false,
    methods: ['Card', 'Bank Transfer', 'Mobile Money'],
    publicKey: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || '',
  },
  mobileMoney: {
    name: 'Mobile Money',
    providers: ['OPay', 'PalmPay'],
  },
};

// --- 2. ANALYTICS & MONITORING ---

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || '';

export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  // Forward to Google Analytics / Mixpanel if present on the page.
  const w = window as any;
  if (typeof w.gtag === 'function') {
    w.gtag('event', eventName, properties || {});
  }
  if (w.mixpanel?.track) {
    w.mixpanel.track(eventName, properties);
  }
};

export const initSentry = () => {
  if (!SENTRY_DSN) return;
  // Sentry SDK init would go here once @sentry/react is added:
  // Sentry.init({ dsn: SENTRY_DSN });
};
