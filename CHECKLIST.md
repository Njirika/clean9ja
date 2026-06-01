# Clean9ja Backend Implementation Checklist

This checklist tracks the progress of the Clean9ja backend development phases, as outlined in the phased development instructions.

---

## 📋 Phase Progress Summary
- [x] **Phase 1: Frontend Requirement Analysis and Backend Planning**
- [x] **Phase 2: Backend Project Setup and Architecture**
- [x] **Phase 3: PostgreSQL, Prisma, and Database Schema**
- [x] **Phase 4: Authentication and Authorization**
- [x] **Phase 5: Core API Modules Based on Frontend Requirements**
- [x] **Phase 6: File Uploads, Local VPS Storage, and Image Optimization**
- [x] **Phase 7: Redis, Caching, Rate Limiting, and Counters**
- [x] **Phase 8: BullMQ Background Workers**
- [x] **Phase 9: Resend Email Integration and Branded Email Templates**
- [x] **Phase 10: SMS Notification Integration**
- [x] **Phase 11: Admin, Notifications, and Special Business Logic**
- [x] **Phase 12: Docker, Docker Compose, and Production Scripts**
- [x] **Phase 13: Vercel Deployment (frontend static + backend serverless)**
- [x] **Phase 14: Testing, Validation, and Final Review**

---

## 🔍 Detailed Checklist by Phase

### 📋 Phase 1: Frontend Requirement Analysis and Backend Planning
- [x] Read all frontend documentation files (`BACKEND_REQUIREMENTS.md` and related types/code).
- [x] Inspect frontend routes, pages, components, forms, mock data, auth flows, dashboard flows, and integration details.
- [x] Identify all required backend modules.
- [x] Identify all user roles.
- [x] Identify all database models/entities.
- [x] Identify all required API endpoints.
- [x] Identify all required file uploads and storage models.
- [x] Identify all required email notifications.
- [x] Identify any unclear or missing backend requirements.
- [x] Create root-level `BACKEND_IMPLEMENTATION_PLAN.md` and update `implementation_plan.md` artifact.
- [x] Stop and request user approval before moving to Phase 2.

### 📋 Phase 2: Backend Project Setup and Architecture
- [x] Create backend directory structure (`backend/src/...`).
- [x] Set up Node.js, Express.js, TypeScript, and tsconfig.
- [x] Set up environment variable handling using custom config wrapper (`env.ts`).
- [x] Create `.env.example` in backend root.
- [x] Set up centralized error handling (`ApiError` / `error.middleware.ts`).
- [x] Set up standardized API response structure (`ApiResponse`).
- [x] Set up structured logging using Winston/Morgan.
- [x] Set up base health check route `/api/health`.
- [x] Add security middlewares (Helmet, CORS, Express Rate Limit base).
- [x] Stop and request user approval before moving to Phase 3.

### 📋 Phase 3: PostgreSQL, Prisma, and Database Schema
- [x] Configure Supabase PostgreSQL connection via DATABASE_URL.
- [x] Set up Prisma schema (`schema.prisma`) in backend root.
- [x] Implement all database models (`User`, `Address`, `Service`, `Booking`, `CleanerProfile`, `CleanerApplication`, `Team`, `Review`, `PaymentLog`, `Subscription`, `PromoCode`, `BlogPost`).
- [x] Define proper indexes, unique constraints, and relationships.
- [x] Add `createdAt` and `updatedAt` for all models.
- [x] Create initial Prisma migration.
- [x] Add database seeding scripts for default services and blog content.
- [x] Add Prisma helper scripts to `package.json`.
- [x] Stop and request user approval before moving to Phase 4.

### 📋 Phase 4: Authentication and Authorization
- [x] Implement secure authentication endpoints (register, login, refresh, logout, me).
- [x] Add password hashing with Argon2 or bcrypt.
- [x] Implement JWT token generation (access and refresh tokens).
- [x] Create secure JWT cookies or session tracking.
- [x] Implement RBAC middleware (`requireAuth`, `requireRole`, `requireAnyRole`).
- [x] Connect role verification for Customer, Cleaner, and Admin roles.
- [x] Implement base logic for forgot password, reset password, and email verification.
- [x] Stop and request user approval before moving to Phase 5.

### 📋 Phase 5: Core API Modules Based on Frontend Requirements
- [x] Implement **Services API** (CRUD, slug lookup, active status toggle).
- [x] Implement **Addresses API** (CRUD for customer addresses, default address handling).
- [x] Implement **Bookings API** (Booking creation, quoting engine, fetching user history, and admin assignment).
- [x] Implement **Subscriptions API** (CRUD for recurring bookings).
- [x] Implement **Reviews API** (Submission with photo array, admin moderation).
- [x] Implement **PromoCodes API** (Validation, discount calculation).
- [x] Implement **Blog / CMS API** for reading/writing articles.
- [x] Stop and request user approval before moving to Phase 6.

### 📋 Phase 6: File Uploads, Local VPS Storage, and Image Optimization
- [x] Create secure static uploads folder (`/app/uploads` persistent, `backend/uploads` local).
- [x] Implement `multer` for multipart form parsing (Cleaner avatar, certifications).
- [x] Integrate `sharp` for image resizing and WebP conversion before saving.
- [x] Set up local file serving route (`/uploads/*`).
- [x] Create `upload.service.ts` to manage file writes and validation.
- [x] Stop and request user approval before moving to Phase 7.

### 📋 Phase 7: Redis, Caching, Rate Limiting, and Counters
- [x] Configure Redis connection via `redis.ts` config.
- [x] Implement API Rate Limiting (e.g., Express-Rate-Limit with Redis store).
- [x] Set up caching mechanisms for public routes (e.g., Services list, Blog posts).
- [x] Stop and request user approval before moving to Phase 8.

### 📋 Phase 8: BullMQ Background Workers
- [x] Initialize BullMQ with Redis connection.
- [x] Define queues (`emailQueue`, `smsQueue`, `bookingQueue`).
- [x] Build base worker logic for each queue.
- [x] Integrate queue triggers in controllers (e.g., dispatch to `bookingQueue` when a booking is created).
- [x] Stop and request user approval before moving to Phase 9.

### 📋 Phase 9: Resend Email Integration and Branded Email Templates
- [x] Set up Resend API client integration (`email.service.ts`).
- [x] Create an HTML layout wrapper with the Clean9ja logo.
- [x] Write standard templates (Welcome, Booking Confirmation, Password Reset).
- [x] Hook up these templates in `email.worker.ts`.
- [x] Stop and request user approval before moving to Phase 10.

### 📋 Phase 10: SMS Notification Integration
- [x] Create SMS service abstraction (`sms.service.ts`).
- [x] Hook SMS dispatch to Termii REST API.
- [x] Setup worker job processors to dispatch text reminders.
- [x] Stop and request user approval before moving to Phase 11.

### 📋 Phase 11: Admin, Notifications, and Special Business Logic
- [x] Implement Admin Dashboard APIs (earnings reports, dispatch metrics, staff lists).
- [x] Create in-app Notifications module + Database Schema.
- [x] Implement special logic like dispatch tracking, promotional logic checks.
- [x] Stop and request user approval before moving to Phase 12.

### 📋 Phase 12: Docker, Docker Compose, and Production Scripts
- [x] Write optimized production `Dockerfile` for backend API.
- [x] Configure `docker-compose.yml` for unified Redis and App execution.
- [x] Provide PM2 ecosystem configs for non-containerized deployment option.
- [x] Stop and request user approval before moving to Phase 13.

### 📋 Phase 13: Vercel Deployment (frontend static + backend serverless)
- [x] Add root `vercel.json` (Vite build + SPA rewrite) and `.vercelignore`.
- [x] Add serverless entry `backend/api/index.ts` + `backend/vercel.json`.
- [x] Consolidate Prisma into a single cached client for serverless connection safety.
- [x] Make Redis optional (Upstash) with graceful cache/rate-limit fallback.
- [x] Switch image uploads to Vercel Blob (local disk fallback for dev).
- [x] Add Prisma `rhel-openssl-3.0.x` binary target + `postinstall`/`vercel-build` generate.
- [x] Rewrite `DEPLOYMENT.md` for two-project Vercel deployment + env vars.
- [x] Add typed frontend API client (`src/lib/api.ts`) + `VITE_API_URL` config.
- [x] Wire auth (login/register/logout/session) and Blog to the live backend.
- [ ] Wire remaining pages (multi-site Booking wizard, dashboards) to the API.

### 📋 Phase 14: Testing, Validation, and Final Review
- [x] Add a unit test runner (Vitest) with `npm test`.
- [x] Unit tests for pure logic: quote pricing, promo discount, ApiResponse, JWT round-trip.
- [ ] Integration tests across Express endpoints (needs a test database; not yet written).
- [x] Final review of security headers (Helmet, CORS, Rate Limiting).
- [x] Require a strong `JWT_SECRET` in production (no insecure fallback).
- [ ] Present final walkthrough to the user for project sign-off.
