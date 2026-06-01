# Clean9ja — Project Guide

Nigeria-focused professional cleaning services platform. **Frontend**: React 19 +
Vite + Tailwind 4 SPA (repo root). **Backend**: Express + TypeScript + Prisma +
BullMQ in `backend/`. Deployed to **Vercel** (static frontend + serverless API).

## ⚠️ Working agreement (read first)

- **Always commit and push changes to GitHub** (`https://github.com/Njirika/clean9ja`,
  branch `main`) after completing any meaningful change. See [CONTRIBUTING.md](CONTRIBUTING.md).
- **Never commit secrets.** `.env` files are git-ignored; only `*.env.example`
  (placeholders) are tracked. If a key is exposed, rotate it.

## Key locations

- `src/lib/siteContent.ts` — single source of truth for services, pricing, FAQs,
  coverage. Shared by SEO and the chat assistant.
- `src/lib/assistant.ts` + `src/components/ui/LiveChat.tsx` — local, rule-based
  chat assistant (no LLM/API key by design).
- `src/components/seo/Seo.tsx` — per-route meta/JSON-LD; `scripts/prerender.mjs`
  bakes per-route SEO into static HTML on build (`postbuild`).
- `backend/src/config/{prisma,redis,env}.ts` — shared singletons; Redis optional.
- `backend/api/index.ts` + `backend/vercel.json` — serverless entry.

## Commands

- Frontend: `npm run dev`, `npm run build` (runs SEO prerender after).
- Backend: `cd backend && npm run dev`, `npm test` (Vitest).
- Type-check: `npx tsc --noEmit` (root and `backend/`).
