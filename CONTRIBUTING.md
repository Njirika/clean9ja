# Contributing to Clean9ja

## 🔁 Commit policy (IMPORTANT)

**Going forward, every change made to this project must be committed and pushed to GitHub.**
Do not let work pile up locally. After any meaningful change:

```bash
git add -A
git commit -m "Describe what changed"
git push origin main
```

- Repository: `https://github.com/Njirika/clean9ja`
- Default branch: `main`
- Commit in small, descriptive units; push as soon as a change is working.

## 🔐 Security rules (never break these)

1. **Never commit secrets.** API keys, passwords, tokens and connection strings
   must live only in environment variables — locally in `.env` files (which are
   git-ignored) and in the Vercel project's Environment Variables for production.
2. The committed `*.env.example` files must contain **placeholders only**, never
   real values.
3. If a secret is ever exposed (e.g. pasted into a chat, log, or commit),
   **rotate/revoke it immediately** at the provider.
4. Before committing, sanity-check that no `.env` file or key is staged:
   ```bash
   git ls-files | grep -E '\.env($|\.)'   # should only show *.env.example
   ```

## 🚀 Local development

```bash
# Frontend (repo root)
npm install
npm run dev            # http://localhost:5173
npm run build          # builds + prerenders SEO HTML (postbuild)

# Backend
cd backend
npm install
npm run dev            # http://localhost:5000
npm test               # unit tests (Vitest)
```

Deployment is on **Vercel** (frontend = static SPA at repo root; backend =
serverless functions in `backend/`). See [DEPLOYMENT.md](DEPLOYMENT.md).
