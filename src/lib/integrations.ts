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

/**
 * Open the Paystack inline checkout for the "pay now" flow.
 *
 * This uses the public key only — it opens Paystack's hosted popup, which is
 * safe to run in the browser. On success Paystack returns a `reference`.
 *
 * IMPORTANT: a card charge is only trustworthy once the backend verifies the
 * reference with Paystack's secret key (and ideally a webhook). That endpoint
 * does not exist yet, so callers should treat the returned reference as
 * "payment initiated" and reconcile server-side before fulfilling.
 *
 * Resolves with the reference on success, or `null` if Paystack is not
 * configured / unavailable (so the caller can fall back gracefully).
 */
export async function payWithPaystack(opts: {
  email: string;
  /** Amount in Naira; converted to kobo for Paystack. */
  amountNaira: number;
  reference?: string;
}): Promise<string | null> {
  const key = PaymentGateways.paystack.publicKey;
  if (!key) return null;

  const loaded = await loadScript('https://js.paystack.co/v1/inline.js');
  const PaystackPop = (window as any).PaystackPop;
  if (!loaded || !PaystackPop) return null;

  return new Promise<string | null>((resolve) => {
    const handler = PaystackPop.setup({
      key,
      email: opts.email,
      amount: Math.round(opts.amountNaira * 100),
      currency: 'NGN',
      ref: opts.reference || `cn_${Date.now()}`,
      callback: (response: { reference: string }) => resolve(response.reference),
      onClose: () => resolve(null),
    });
    handler.openIframe();
  });
}

const scriptPromises: Record<string, Promise<boolean>> = {};
function loadScript(src: string): Promise<boolean> {
  if (src in scriptPromises) return scriptPromises[src];
  scriptPromises[src] = new Promise<boolean>((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
  return scriptPromises[src];
}

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
