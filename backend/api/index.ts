/**
 * Vercel serverless entry point.
 *
 * Vercel runs files in the `/api` directory as serverless functions. We export
 * the configured Express application as the default handler — Vercel invokes it
 * with the standard (req, res) signature. The `vercel.json` rewrite routes all
 * incoming paths to this function while preserving the original request URL, so
 * the app's `/api/*` routes continue to match.
 *
 * NOTE: this path intentionally does NOT import `../src/server` or the BullMQ
 * workers. Serverless functions cannot host always-on background processes;
 * those run only in the persistent (Docker / Node) deployment via `server.ts`.
 */
import app from '../src/app';

export default app;
