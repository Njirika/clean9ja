# CleanNaija Deployment Guide (Vercel)

CleanNaija deploys as **two Vercel projects** from this one repository:

| Project  | Root directory | What it serves                          |
| -------- | -------------- | --------------------------------------- |
| Frontend | `/` (repo root)| The React/Vite single-page app (static) |
| Backend  | `/backend`     | The Express API as serverless functions |

> **Why two projects?** Vercel builds one framework per project. The frontend is
> a static Vite build; the backend is a Node/serverless API. Keeping them
> separate lets each use the right build settings and scale independently.

---

## Prerequisites

1. A **Vercel** account (and the `vercel` CLI, optional: `npm i -g vercel`).
2. A **Supabase** project (PostgreSQL connection strings + API keys).
3. Optional integrations: **Resend** (email), **Termii** (SMS),
   **Upstash Redis** (caching / shared rate limiting), and a **Vercel Blob**
   store (durable image uploads).

---

## 1. Deploy the Frontend

1. In Vercel, **Add New Project** → import this repo.
2. Set **Root Directory** to the repo root (leave as `/`).
3. Vercel auto-detects Vite. The included [`vercel.json`](./vercel.json) pins:
   - Build command: `npm run build`
   - Output directory: `dist`
   - An SPA rewrite so client-side routes (e.g. `/book`, `/about`) resolve to
     `index.html` instead of 404ing.
4. (Optional) Add a `VITE_API_URL` env var pointing at your backend domain once
   the frontend is wired to call the API. *(Today the frontend uses local mock
   data and does not call the backend — see “What’s missing” in the project
   notes.)*
5. **Deploy.**

---

## 2. Deploy the Backend (Serverless API)

1. In Vercel, **Add New Project** → import the **same repo** again.
2. Set **Root Directory** to `backend`.
3. Vercel detects the [`backend/vercel.json`](./backend/vercel.json), which:
   - Runs `prisma generate` at build time.
   - Routes every request to the Express app exported from
     [`backend/api/index.ts`](./backend/api/index.ts).
   - Sets a 30s function `maxDuration`.
4. Add the environment variables below.
5. **Deploy.**

### Backend environment variables

```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app

# Supabase Postgres — use the POOLED string for DATABASE_URL (serverless-safe)
DATABASE_URL=postgresql://postgres:...@...pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:...@...supabase.com:5432/postgres

SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

JWT_SECRET=<a long random secret>
JWT_EXPIRES_IN=7d

# Optional — Upstash Redis (caching + shared rate limiting). Leave unset to
# disable caching and fall back to per-instance in-memory rate limiting.
REDIS_URL=rediss://default:...@...upstash.io:6379

# Optional — email & SMS
RESEND_API_KEY=...
TERMII_API_KEY=...
TERMII_SENDER_ID=CleanNaija

# Set automatically when you create a Vercel Blob store (needed for image uploads)
BLOB_READ_WRITE_TOKEN=...
```

> **Database connection on serverless:** always point `DATABASE_URL` at Supabase’s
> **pooled** connection (port `6543`, `?pgbouncer=true`). Each serverless instance
> opens its own connection; the app uses a single cached Prisma client per
> instance ([`backend/src/config/prisma.ts`](./backend/src/config/prisma.ts)) to
> keep that bounded. `DIRECT_URL` (port `5432`) is used only by
> `prisma db push` / migrations.

### Initialize the database

Run once from your machine with the backend env vars set (or via Vercel CLI):

```bash
cd backend
npm install
npx prisma db push     # sync schema to Supabase
npm run db:seed        # seed default services + blog content
```

### 🔒 Supabase 2026 Data API Security Notice

Supabase rolled out a major security update (**May 30, 2026** for new projects; **October 30, 2026** for existing projects) that restricts the default exposure of tables in the `public` schema to client-side APIs (PostgREST, GraphQL, or `supabase-js` direct client calls).

* **How this affects CleanNaija**: **Prisma ORM is 100% unaffected**! Because the Express backend communicates directly via direct PostgreSQL TCP connections (`DATABASE_URL` via port `5432`/`6543`) as the superuser/database administrator, your server-side APIs do not use the Supabase Data API and will function continuously without issues.
* **Preparedness for Future integrations**: If you or your developers ever decide to query these tables directly from the frontend using `@supabase/supabase-js`, they will return empty responses unless explicit permissions are granted. 

To ensure complete compatibility and make your database future-proof, execute this quick SQL snippet in your **Supabase SQL Editor**:

```sql
-- 1. Grant direct Data API access for existing tables to Supabase API roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- 2. Automatically grant direct API access on any future tables created
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
```

---

## What changed for serverless (vs. the old VPS/Coolify setup)

Vercel functions are stateless and short-lived, so three pieces were adapted:

| Concern            | VPS / Docker (old)             | Vercel serverless (now)                                            |
| ------------------ | ------------------------------ | ------------------------------------------------------------------ |
| **Background jobs**| BullMQ workers (always-on)     | Not started in the serverless path. The worker code remains for the persistent deploy; queues were never wired into request flows. |
| **File uploads**   | Local disk under `/uploads`    | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) when `BLOB_READ_WRITE_TOKEN` is set; local disk only as a dev fallback. |
| **Redis**          | Self-hosted container          | Optional Upstash via `REDIS_URL`; gracefully disabled when unset.  |

> **Background jobs:** if you later need real async processing (delayed SMS
> reminders, etc.) on Vercel, trigger them with **Vercel Cron** hitting a route,
> or **Upstash QStash**. The existing BullMQ workers in `backend/src/workers`
> require an always-on host and are only used by the non-serverless `server.ts`
> entry point.

---

## Optional: run the backend as a long-lived server instead

The original Node server and Docker setup still work for hosts that support
persistent processes (Railway, Render, Fly.io, a VPS). Use:

- `backend/src/server.ts` (starts Express **and** the BullMQ workers), or
- `docker-compose.yml` (backend + Redis).

These are not used by the Vercel deployment.
