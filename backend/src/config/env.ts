import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const nodeEnv = process.env.NODE_ENV || 'development';

/**
 * Resolve the JWT signing secret. In production a strong secret is mandatory —
 * we refuse to boot with a missing/weak one rather than silently falling back
 * to an insecure default (which would let anyone forge tokens). In development
 * we allow an explicit, clearly-labelled dev-only secret for convenience.
 */
function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (nodeEnv === 'production') {
    if (!secret || secret.length < 32) {
      throw new Error(
        'JWT_SECRET must be set to a strong value (>= 32 chars) in production.'
      );
    }
    return secret;
  }
  return secret || 'dev-only-insecure-secret-change-me';
}

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv,
  // True when running on Vercel's serverless platform.
  isServerless: !!process.env.VERCEL,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwtSecret: resolveJwtSecret(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  // Optional. When unset, caching is skipped and rate limiting uses memory.
  // For Vercel use an external provider (Upstash) with a rediss:// URL.
  redisUrl: process.env.REDIS_URL || '',
  // Vercel Blob token for durable image storage (see upload.service.ts).
  blobToken: process.env.BLOB_READ_WRITE_TOKEN || '',
  resendApiKey: process.env.RESEND_API_KEY || '',
  resendFrom: process.env.RESEND_FROM || 'Clean9ja <onboarding@resend.dev>',
  resendReplyTo: process.env.RESEND_REPLY_TO || 'hello@clean9ja.com',
  termii: {
    apiKey: process.env.TERMII_API_KEY || '',
    senderId: process.env.TERMII_SENDER_ID || 'Clean9ja',
  },
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  }
};
