# Clean9ja Backend Implementation Plan

This plan outlines the architecture, database design, API modules, security, and devops setup for the **Clean9ja Centralized Professional Cleaning Platform** backend.

---

## 🎯 Goal Description

The objective is to replace mock frontend operations with a production-ready, highly-scalable, and secure Node.js + Express.js backend. Clean9ja is **not a cleaner marketplace** but a centralized cleaning services provider. The backend will handle company pricing calculations, automated booking creations, administrator dispatch/assignments of hired cleaners, employee before/after quality checks, subscription renewals, automated email updates via **SendGrid/Resend**, and SMS updates via **Termii** using a **BullMQ** worker queue powered by **Redis**.

---

## 👥 User Roles & Permissions

We define three roles managed via JWT role-based access control (RBAC):
1. **Customer**: Can manage addresses, calculate pricing quotes, submit bookings, pay via Paystack/Flutterwave, leave reviews, and manage recurring cleaning subscriptions.
2. **Employed Cleaner**: Vetted company workers. Can view assigned cleaning missions, navigate to addresses, upload before/after photos, manage their wallet balance, and see completed jobs.
3. **Admin**: Operations managers. Full access to manage cleaning services, review/verify/hire cleaner applicants, dispatch cleaners to bookings, view platform statistics, and publish blog content.

---

## 🗄️ Database Schema Design (Prisma ORM)

We will use **PostgreSQL** (hosted on Supabase) and **Prisma ORM**.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum UserRole {
  customer
  cleaner
  admin
}

enum Language {
  en
  pcm
  yo
  ha
  ig
}

enum AddressLabel {
  Home
  Office
  Other
}

enum ServiceCategory {
  home
  office
  construction
  medical
  roof
  specialty
}

enum PriceUnit {
  per_hour
  per_room
  per_sqm
  flat
}

enum BookingStatus {
  pending
  confirmed
  in_progress
  completed
  cancelled
}

enum PaymentStatus {
  pending
  paid
  refunded
}

enum CleanerStatus {
  active
  inactive
  suspended
}

enum ApplicationStatus {
  applied
  nin_verified
  interviewed
  hired
  rejected
}

enum PaymentMethod {
  card
  bank_transfer
  ussd
  wallet
}

enum PaymentProvider {
  paystack
  flutterwave
}

enum TransactionStatus {
  pending
  success
  failed
  refunded
}

enum Frequency {
  weekly
  biweekly
  monthly
}

enum SubStatus {
  active
  paused
  cancelled
}

enum DiscountType {
  percentage
  fixed
}

model User {
  id                 String        @id @default(uuid()) @db.Uuid
  firstName          String        @map("first_name") @db.VarChar(100)
  lastName           String        @map("last_name") @db.VarChar(100)
  email              String        @unique @db.VarChar(255)
  phone              String        @unique @db.VarChar(20)
  passwordHash       String        @map("password_hash") @db.VarChar(255)
  role               UserRole      @default(customer)
  avatarUrl          String?       @map("avatar_url")
  isVerified         Boolean       @default(false) @map("is_verified")
  preferredLanguage  Language      @default(en) @map("preferred_language")
  createdAt          DateTime      @default(now()) @map("created_at")
  updatedAt          DateTime      @updatedAt @map("updated_at")
  
  addresses          Address[]
  bookings           Booking[]     @relation("CustomerBookings")
  cleanerProfile     CleanerProfile?
  reviews            Review[]
  subscriptions      Subscription[]

  @@map("users")
}

model Address {
  id             String       @id @default(uuid()) @db.Uuid
  userId         String       @map("user_id") @db.Uuid
  label          AddressLabel @default(Home)
  streetAddress  String       @map("street_address")
  city           String       @db.VarChar(100)
  state          String       @db.VarChar(100)
  lga            String       @db.VarChar(100)
  landmark       String?      @db.VarChar(255)
  latitude       Decimal?     @db.Decimal(9, 6)
  longitude      Decimal?     @db.Decimal(9, 6)
  isDefault      Boolean      @default(false) @map("is_default")
  createdAt      DateTime     @default(now()) @map("created_at")

  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  bookings       Booking[]
  subscriptions  Subscription[]

  @@map("addresses")
}

model Service {
  id                       String          @id @default(uuid()) @db.Uuid
  name                     String          @db.VarChar(255)
  slug                     String          @unique @db.VarChar(255)
  category                 ServiceCategory
  description              String
  shortDescription         String          @map("short_description") @db.VarChar(500)
  iconUrl                  String?         @map("icon_url")
  imageUrl                 String          @map("image_url")
  basePrice                Decimal         @map("base_price") @db.Decimal(12, 2)
  priceUnit                PriceUnit       @map("price_unit")
  estimatedDurationMinutes Int             @map("estimated_duration_minutes")
  isActive                 Boolean         @default(true) @map("is_active")
  sortOrder                Int             @default(0) @map("sort_order")
  createdAt                DateTime        @default(now()) @map("created_at")
  
  bookings                 Booking[]
  subscriptions            Subscription[]

  @@map("services")
}

model CleanerProfile {
  id                 String        @id @default(uuid()) @db.Uuid
  userId             String        @unique @map("user_id") @db.Uuid
  ninNumber          String        @map("nin_number") // AES-256-GCM Encrypted
  isVerified         Boolean       @default(false) @map("is_verified")
  verificationDate   DateTime?     @map("verification_date")
  hiredDate          DateTime?     @map("hired_date")
  ratingAverage      Decimal       @default(5.00) @map("rating_average") @db.Decimal(3, 2)
  totalJobsCompleted Int           @default(0) @map("total_jobs_completed")
  skillTags          String[]      @default([]) @map("skill_tags")
  serviceAreas       String[]      @default([]) @map("service_areas")
  bankAccountDetails String        @map("bank_account_details") // Encrypted JSON
  walletBalance      Decimal       @default(0.00) @map("wallet_balance") @db.Decimal(12, 2)
  status             CleanerStatus @default(inactive)
  createdAt          DateTime      @default(now()) @map("created_at")

  user               User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  assignedBookings   Booking[]     @relation("CleanerBookings")
  ledTeams           Team[]        @relation("TeamLeader")
  reviews            Review[]

  @@map("cleaners")
}

model CleanerApplication {
  id          String            @id @default(uuid()) @db.Uuid
  fullName    String            @map("full_name") @db.VarChar(150)
  email       String            @db.VarChar(255)
  phone       String            @db.VarChar(20)
  state       String            @db.VarChar(100)
  city        String            @db.VarChar(100)
  lga         String            @db.VarChar(100)
  ninNumber   String            @map("nin_number") @db.VarChar(11)
  experience  String            @db.VarChar(100)
  status      ApplicationStatus @default(applied)
  createdAt   DateTime          @default(now()) @map("created_at")
  updatedAt   DateTime          @updatedAt @map("updated_at")

  @@map("cleaner_applications")
}

model Team {
  id          String   @id @default(uuid()) @db.Uuid
  name        String   @db.VarChar(100)
  leaderId    String   @map("leader_id") @db.Uuid
  members     String[] @default([]) @db.Uuid
  serviceArea String   @map("service_area") @db.VarChar(100)
  isAvailable Boolean  @default(true) @map("is_available")
  createdAt   DateTime @default(now()) @map("created_at")

  leader      CleanerProfile @relation("TeamLeader", fields: [leaderId], references: [id])
  bookings    Booking[]

  @@map("teams")
}

model Booking {
  id                   String        @id @default(uuid()) @db.Uuid
  bookingReference     String        @unique @map("booking_reference") @db.VarChar(50) // Format: CLN-YYYY-XXXXX
  customerId           String        @map("customer_id") @db.Uuid
  serviceId            String        @map("service_id") @db.Uuid
  addressId            String        @map("address_id") @db.Uuid
  assignedCleanerId    String?       @map("assigned_cleaner_id") @db.Uuid
  assignedTeamId       String?       @map("assigned_team_id") @db.Uuid
  status               BookingStatus @default(pending)
  scheduledDate        DateTime      @map("scheduled_date") @db.Date
  scheduledTimeSlot    String        @map("scheduled_time_slot") @db.VarChar(100) // Morning, Afternoon, Evening
  actualStartTime      DateTime?     @map("actual_start_time")
  actualEndTime        DateTime?     @map("actual_end_time")
  propertySizeSqm      Decimal?      @map("property_size_sqm") @db.Decimal(10, 2)
  numberOfRooms        Int?          @default(1) @map("number_of_rooms")
  specialInstructions  String?       @map("special_instructions")
  quotedPrice          Decimal       @map("quoted_price") @db.Decimal(12, 2)
  finalPrice           Decimal?      @map("final_price") @db.Decimal(12, 2)
  paymentStatus        PaymentStatus @default(pending) @map("payment_status")
  paymentReference     String?       @map("payment_reference") @db.VarChar(255)
  promoCodeId          String?       @map("promo_code_id") @db.Uuid
  createdAt            DateTime      @default(now()) @map("created_at")
  updatedAt            DateTime      @updatedAt @map("updated_at")

  customer             User          @relation("CustomerBookings", fields: [customerId], references: [id], onDelete: Restrict)
  service              Service       @relation(fields: [serviceId], references: [id], onDelete: Restrict)
  address              Address       @relation(fields: [addressId], references: [id], onDelete: Restrict)
  cleaner              CleanerProfile? @relation("CleanerBookings", fields: [assignedCleanerId], references: [id], onDelete: SetNull)
  team                 Team?         @relation(fields: [assignedTeamId], references: [id], onDelete: SetNull)
  promoCode            PromoCode?    @relation(fields: [promoCodeId], references: [id], onDelete: SetNull)
  payments             PaymentLog[]
  review               Review?

  @@map("bookings")
}

model Review {
  id           String   @id @default(uuid()) @db.Uuid
  bookingId    String   @unique @map("booking_id") @db.Uuid
  customerId   String   @map("customer_id") @db.Uuid
  cleanerId    String   @map("cleaner_id") @db.Uuid
  rating       Int      @db.Integer // Check: 1 to 5
  comment      String?
  beforePhotos String[] @default([]) @map("before_photos")
  afterPhotos  String[] @default([]) @map("after_photos")
  isPublic     Boolean  @default(true) @map("is_public")
  createdAt    DateTime @default(now()) @map("created_at")

  booking      Booking  @relation(fields: [bookingId], references: [id], onDelete: Restrict)
  customer     User     @relation(fields: [customerId], references: [id], onDelete: Cascade)
  cleaner      CleanerProfile @relation(fields: [cleanerId], references: [id], onDelete: Cascade)

  @@map("reviews")
}

model PaymentLog {
  id                String            @id @default(uuid()) @db.Uuid
  bookingId         String            @map("booking_id") @db.Uuid
  amount            Decimal           @db.Decimal(12, 2)
  currency          String            @default("NGN") @db.VarChar(3)
  paymentMethod     PaymentMethod     @map("payment_method")
  paymentProvider   PaymentProvider   @default(paystack) @map("payment_provider")
  providerReference String            @unique @map("provider_reference") @db.VarChar(255)
  status            TransactionStatus @default(pending)
  paidAt            DateTime?         @map("paid_at")
  createdAt         DateTime          @default(now()) @map("created_at")

  booking           Booking           @relation(fields: [bookingId], references: [id], onDelete: Cascade)

  @@map("payments")
}

model Subscription {
  id                  String     @id @default(uuid()) @db.Uuid
  customerId          String     @map("customer_id") @db.Uuid
  serviceId           String     @map("service_id") @db.Uuid
  addressId           String     @map("address_id") @db.Uuid
  frequency           Frequency
  preferredDay        String     @map("preferred_day") @db.VarChar(20)
  preferredTime       String     @map("preferred_time") @db.VarChar(20)
  pricePerVisit       Decimal    @map("price_per_visit") @db.Decimal(12, 2)
  status              SubStatus  @default(active)
  nextBookingDate     DateTime   @map("next_booking_date") @db.Date
  totalVisitsCompleted Int       @default(0) @map("total_visits_completed")
  createdAt           DateTime   @default(now()) @map("created_at")

  customer            User       @relation(fields: [customerId], references: [id], onDelete: Cascade)
  service             Service    @relation(fields: [serviceId], references: [id], onDelete: Restrict)
  address             Address    @relation(fields: [addressId], references: [id], onDelete: Restrict)

  @@map("subscriptions")
}

model PromoCode {
  id             String       @id @default(uuid()) @db.Uuid
  code           String       @unique @db.VarChar(50)
  discountType   DiscountType @map("discount_type")
  discountValue  Decimal      @map("discount_value") @db.Decimal(12, 2)
  maxUses        Int          @default(100) @map("max_uses")
  currentUses    Int          @default(0) @map("current_uses")
  validFrom      DateTime     @map("valid_from")
  validUntil     DateTime     @map("valid_until")
  minOrderAmount Decimal      @default(0.00) @map("min_order_amount") @db.Decimal(12, 2)
  isActive       Boolean      @default(true) @map("is_active")
  
  bookings       Booking[]

  @@map("promo_codes")
}

model BlogPost {
  id            String   @id @default(uuid()) @db.Uuid
  title         String   @db.VarChar(255)
  slug          String   @unique @db.VarChar(255)
  excerpt       String   @db.VarChar(500)
  content       String
  author        String   @default("Clean9ja Experts") @db.VarChar(100)
  imageUrl      String   @map("imageUrl")
  category      String   @db.VarChar(100)
  isPublished   Boolean  @default(true) @map("is_published")
  publishedDate DateTime @default(now()) @map("published_date")

  @@map("blog_posts")
}
```

---

## 🔗 API Specifications & Endpoints List

### 🔑 Authentication Module
- `POST /api/auth/register` (Customer registration)
- `POST /api/auth/login` (User login, returns JWT & Refresh tokens, secure cookies)
- `POST /api/auth/refresh` (Refresh JWT token)
- `POST /api/auth/logout` (Clears cookies and invalidates refresh token in Redis)
- `GET /api/auth/me` (Fetch active user profile)
- `POST /api/auth/forgot-password` (Queues password reset link via Resend)
- `POST /api/auth/reset-password` (Verifies reset token and updates password)

### 🧹 Services Module
- `GET /api/services` (List all active services, supports sorting and filtering by category)
- `GET /api/services/:slug` (Get service details by slug)
- `POST /api/services` (Admin only: Create service)
- `PUT /api/services/:id` (Admin only: Update service)
- `DELETE /api/services/:id` (Admin only: Deactivate service)

### 📍 Addresses Module (Customer Protected)
- `GET /api/addresses` (List customer saved addresses)
- `POST /api/addresses` (Add a new address)
- `PUT /api/addresses/:id` (Update address)
- `DELETE /api/addresses/:id` (Remove address)
- `PUT /api/addresses/:id/default` (Mark address as default)

### 📅 Bookings & Quote Engine Module
- `POST /api/bookings/quote` (Public/Customer: Calculate total service investment)
- `GET /api/bookings` (Customer: Get booking history, Admin: Get all dispatchable bookings with `?assigned=true|false` filters)
- `GET /api/bookings/:id` (Get booking by ID or Reference)
- `POST /api/bookings` (Customer: Request booking, sets status to `pending`)
- `PUT /api/bookings/:id/assign` (Admin: Dispatch specific cleaner or team, updates status to `confirmed`)
- `PUT /api/bookings/:id/status` (Cleaner: Update mission status to `in_progress` or `completed`)
- `POST /api/bookings/:id/payments` (Verify payment with Paystack, marks booking as `paid`)

### 💼 Cleaner Recruitment Module
- `POST /api/cleaners/apply` (Public: Application form, NIN submitted)
- `GET /api/admin/applicants` (Admin: List job applicants)
- `PUT /api/admin/applicants/:id/verify-hire` (Admin: Automatically audit NIN, create user account role `cleaner`, active profile, send credentials via Termii SMS)

### 🛡️ Cleaner Operations Module (Cleaner Protected)
- `GET /api/cleaners/assigned-missions` (Cleaner: View assigned active and past missions)
- `POST /api/cleaners/missions/:id/evidence` (Cleaner: Upload before/after photos and complete mission)
- `GET /api/cleaners/earnings` (Cleaner: View wallet balance, bank account, and job payouts history)
- `PUT /api/cleaners/bank-details` (Cleaner: Update secure bank payout details)

### 📝 CMS & Blog Module
- `GET /api/blog` (List published blog posts)
- `GET /api/blog/:slug` (Get blog post by slug)
- `POST /api/admin/blog` (Admin: Publish blog post)
- `PUT /api/admin/blog/:id` (Admin: Edit blog post)

---

## 💾 File Upload & Optimization Strategy

1. **Storage Service Abstraction (`storage.service.ts`)**:
   - Built to handle local VPS file storage during development/initial deploy under `/app/uploads` (or persistent container volume).
   - Structured so that switching to Amazon S3 or DigitalOcean Spaces requires **zero controller rewrites** (defined via `STORAGE_DRIVER` env variable).
2. **Sharp Image Optimization**:
   - All uploaded cleaner job evidence (before/after photos) or profile avatars will pass through a Sharp workflow.
   - Images will be resized, quality-compressed, converted to standard WebP format, and saved with clean, unique, slugified filenames.
   - Only persistent URLs/paths and metadata will be saved in PostgreSQL.

---

## 📬 Transactional Communications

### 📧 Email: Resend & SendGrid Integration
All emails will be queued via **BullMQ** running on **Redis** to ensure quick API response times.
We will create beautiful responsive branded templates for:
- **Forgot Password**: Password reset button with 15-minute token expiry.
- **Email Verification**: Account activation link.
- **Welcome Email**: Explains onboarding and services.
- **Booking Confirmation**: Confirms booking reference and scheduled date.
- **Payment Success**: Receipt layout showing amount paid in NGN.
- **Cleaner Dispatch Alert**: *"Specialist Emeka has been assigned to your booking!"*
- **Account Approval / Rejection**: Alerts for hired cleaner applicants.

### 📱 SMS: Termii Gateway Integration
- **OTP Alerts & Verification**: Fast secure OTP dispatches.
- **Cleaner Credentials SMS**: Dispatches temporary login details to newly hired cleaners.
- **Dispatch Notifications**: Informs customers immediately when a cleaner is on their way.

---

## 🛡️ Security & Encryption Architecture

1. **NIN Vetting Encryption**:
   - The cleaner `nin_number` is highly sensitive. We will encrypt it in PostgreSQL using `AES-256-GCM` using a standard crypto utility.
   - NIN decryption happens in-memory only when required for verification, leaving no logs.
2. **Bank Account Details**:
   - Bank details saved in cleaner profiles are encrypted as JSON strings.
3. **API Integrity & Protection**:
   - Strict CORS configuration (allowing only authorized frontend hostnames).
   - Helmet for secure HTTP response headers.
   - Express Rate Limit applied heavily on auth, otp, password reset, search, and upload endpoints.

---

## ❓ Open Questions for the User

> [!IMPORTANT]
> **Please review these design assumptions before we start coding:**
> 1. **Backend Subfolder**: We will place the entire backend inside a subdirectory named `backend` (parallel to the existing `src` and frontend files) to keep the repository clean.
> 2. **TypeScript for Backend**: We plan to build the backend using TypeScript (compiling to `dist/`) to ensure full type-safety and alignment with your frontend types. Do you agree?
> 3. **SMS Mocking for Testing**: Since SMS requires Termii API tokens, we will structure the Termii service class cleanly, but fallback to console log logging in development if API credentials are not provided.
> 4. **Paystack Payments Flow**: Do you want booking payments verified synchronously by checking a Paystack transaction reference on booking completion (`POST /api/bookings/:id/payments`), or should we also set up a Paystack webhook listener endpoint (`POST /api/payments/webhook`) for async updates?

---

## 🧪 Verification Plan

### Automated Testing
- Standardized unit and integration test suites using Jest and Supertest.
- Verify JWT validation, RBAC restrictions, and database transactions.
- Run type checker checks:
  ```bash
  npx tsc --noEmit
  ```

### Manual Verification
- Test all core API endpoints using Postman or Bruno.
- Verify file uploads are optimized by checking local storage size and WebP formats.
- Audit BullMQ queue activity via Bull Board or Redis CLI to ensure background workers are processing tasks smoothly.
