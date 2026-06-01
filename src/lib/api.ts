/**
 * CleanNaija API client.
 *
 * A small typed wrapper around the backend REST API. The base URL comes from
 * the `VITE_API_URL` env var (set per-environment in Vercel / `.env`); it
 * defaults to the local backend during development.
 *
 * Auth: the backend accepts a JWT either as an httpOnly cookie or as a
 * `Bearer` token. For a cross-origin SPA we persist the token returned by
 * login/register in localStorage and send it on every request. `credentials:
 * 'include'` is also set so the cookie path works when same-site.
 */

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const TOKEN_KEY = 'cn_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  opts: { auth?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = {};
  let payload: BodyInit | undefined;

  if (body !== undefined) {
    if (body instanceof FormData) {
      payload = body;
    } else {
      headers['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    }
  }

  const token = tokenStore.get();
  if (opts.auth !== false && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      method,
      headers,
      body: payload,
      credentials: 'include',
    });
  } catch {
    throw new ApiError(0, 'Network error — could not reach the server.');
  }

  let json: ApiEnvelope<T> | null = null;
  try {
    json = (await res.json()) as ApiEnvelope<T>;
  } catch {
    // Non-JSON response.
  }

  if (!res.ok || (json && json.success === false)) {
    throw new ApiError(res.status, json?.message || `Request failed (${res.status}).`);
  }

  return (json?.data as T) ?? (undefined as T);
}

// ---- Domain types (mirror the backend's camelCase Prisma models) ----

export interface ApiUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'customer' | 'cleaner' | 'admin';
  avatarUrl?: string;
  isVerified: boolean;
  preferredLanguage: string;
  createdAt: string;
}

export interface AuthResult {
  user: ApiUser;
  token: string;
}

export interface ApiService {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  shortDescription?: string;
  imageUrl: string;
  basePrice: number;
  priceUnit: string;
  estimatedDurationMinutes: number;
  isActive: boolean;
}

export interface ApiBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  category?: string;
  author?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface QuoteResult {
  serviceId: string;
  serviceName: string;
  basePrice: number;
  quotedPrice: number;
  estimatedDurationMinutes: number;
}

export interface ApiAddress {
  id: string;
  label: string;
  streetAddress: string;
  city: string;
  state: string;
  lga?: string;
  landmark?: string;
  isDefault: boolean;
}

export interface ApiBooking {
  id: string;
  bookingReference: string;
  status: string;
  scheduledDate: string;
  scheduledTimeSlot?: string;
  quotedPrice: number;
  finalPrice?: number;
  paymentStatus?: string;
  service?: { name: string; imageUrl?: string };
  address?: ApiAddress;
  cleaner?: { user?: { firstName: string; lastName: string } } | null;
  createdAt: string;
}

export interface ApiSubscription {
  id: string;
  frequency: string;
  status: string;
  pricePerVisit: number;
  nextBookingDate?: string;
  service?: { name: string };
  address?: ApiAddress;
}

export interface ApiReview {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customer?: { firstName: string; lastName?: string; avatarUrl?: string };
  booking?: { service?: { name: string } };
}

export interface AdminStats {
  totalUsers: number;
  totalStaff: number;
  totalBookings: number;
  totalEarnings: number;
  recentBookings: ApiBooking[];
}

// ---- Endpoints ----

export const api = {
  auth: {
    register: (data: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      password: string;
    }) => request<AuthResult>('POST', '/auth/register', data, { auth: false }),
    login: (data: { email: string; password: string }) =>
      request<AuthResult>('POST', '/auth/login', data, { auth: false }),
    logout: () => request<null>('GET', '/auth/logout', undefined, { auth: false }),
    me: () => request<{ user: ApiUser }>('GET', '/auth/me'),
    updateProfile: (data: { firstName?: string; lastName?: string; phone?: string }) =>
      request<{ user: ApiUser }>('PATCH', '/auth/me', data),
  },
  services: {
    list: () => request<ApiService[]>('GET', '/services', undefined, { auth: false }),
    bySlug: (slug: string) =>
      request<ApiService>('GET', `/services/${slug}`, undefined, { auth: false }),
  },
  bookings: {
    quote: (data: { serviceId: string; numberOfRooms?: number; propertySizeSqm?: number }) =>
      request<QuoteResult>('POST', '/bookings/quote', data, { auth: false }),
    create: (data: Record<string, unknown>) => request<ApiBooking>('POST', '/bookings', data),
    mine: () => request<ApiBooking[]>('GET', '/bookings'),
    byId: (id: string) => request<ApiBooking>('GET', `/bookings/${id}`),
  },
  addresses: {
    list: () => request<ApiAddress[]>('GET', '/addresses'),
    create: (data: Partial<ApiAddress>) => request<ApiAddress>('POST', '/addresses', data),
    update: (id: string, data: Partial<ApiAddress>) => request<ApiAddress>('PUT', `/addresses/${id}`, data),
    remove: (id: string) => request<null>('DELETE', `/addresses/${id}`),
  },
  subscriptions: {
    list: () => request<ApiSubscription[]>('GET', '/subscriptions'),
    create: (data: Record<string, unknown>) => request<ApiSubscription>('POST', '/subscriptions', data),
    setStatus: (id: string, status: string) =>
      request<ApiSubscription>('PATCH', `/subscriptions/${id}/status`, { status }),
  },
  reviews: {
    publicList: (limit?: number) =>
      request<ApiReview[]>('GET', `/reviews${limit ? `?limit=${limit}` : ''}`, undefined, { auth: false }),
    create: (data: Record<string, unknown>) => request('POST', '/reviews', data),
  },
  blog: {
    list: () => request<ApiBlogPost[]>('GET', '/blogs', undefined, { auth: false }),
    bySlug: (slug: string) =>
      request<ApiBlogPost>('GET', `/blogs/${slug}`, undefined, { auth: false }),
  },
  promo: {
    validate: (code: string, orderAmount: number) =>
      request('POST', '/promo-codes/validate', { code, orderAmount }),
  },
  admin: {
    stats: () => request<AdminStats>('GET', '/admin/stats'),
  },
};

export { API_URL };
