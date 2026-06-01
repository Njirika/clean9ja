/**
 * Clean9ja Core Database Schema Definition
 */

export type UserRole = 'customer' | 'cleaner' | 'admin';
export type Language = 'en' | 'pcm' | 'yo' | 'ha' | 'ig';
export type AddressLabel = 'Home' | 'Office' | 'Other';
export type ServiceCategory = 'home' | 'office' | 'construction' | 'hospital' | 'roof' | 'specialty';
export type PriceUnit = 'per_hour' | 'per_room' | 'per_sqm' | 'flat';
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';
export type CleanerStatus = 'active' | 'inactive' | 'suspended';
export type PaymentMethod = 'card' | 'bank_transfer' | 'ussd' | 'wallet';
export type PaymentProvider = 'paystack' | 'flutterwave';
export type Frequency = 'weekly' | 'biweekly' | 'monthly';
export type DiscountType = 'percentage' | 'fixed';

export interface User {
  id: string; // UUID
  first_name: string;
  last_name: string;
  email: string;
  phone: string; // Unique
  password_hash: string;
  role: UserRole;
  avatar_url?: string;
  is_verified: boolean;
  preferred_language: Language;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string; // FK
  label: AddressLabel;
  street_address: string;
  city: string;
  state: string;
  lga: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  description: string;
  short_description: string;
  icon_url?: string;
  image_url: string;
  base_price: number;
  price_unit: PriceUnit;
  estimated_duration_minutes: number;
  is_active: boolean;
  sort_order: number;
}

export interface Booking {
  id: string;
  booking_reference: string; // e.g., "CLN-2025-00001"
  customer_id: string; // FK
  service_id: string; // FK
  address_id: string; // FK
  assigned_team_id?: string; // FK
  status: BookingStatus;
  scheduled_date: string;
  scheduled_time_slot: string;
  actual_start_time?: string;
  actual_end_time?: string;
  property_size_sqm?: number;
  number_of_rooms?: number;
  special_instructions?: string;
  quoted_price: number;
  final_price?: number;
  payment_status: PaymentStatus;
  payment_reference?: string;
  promo_code_id?: string; // FK
  created_at: string;
  updated_at: string;
}

export interface Cleaner {
  id: string;
  user_id: string; // FK
  nin_number: string; // Encrypted
  is_verified: boolean;
  verification_date?: string;
  rating_average: number;
  total_jobs_completed: number;
  skill_tags: string[];
  service_areas: string[]; // states/cities
  availability_schedule: any; // JSON
  bank_account_details: string; // Encrypted
  status: CleanerStatus;
}

export interface Team {
  id: string;
  name: string;
  leader_id: string; // FK
  members: string[]; // FKs
  service_area: string;
  is_available: boolean;
}

export interface Review {
  id: string;
  booking_id: string; // FK
  customer_id: string; // FK
  cleaner_id: string; // FK
  rating: number; // 1-5
  comment?: string;
  before_photos: string[];
  after_photos: string[];
  is_public: boolean;
  created_at: string;
}

export interface Payment {
  id: string;
  booking_id: string; // FK
  amount: number;
  currency: 'NGN';
  payment_method: PaymentMethod;
  payment_provider: PaymentProvider;
  provider_reference: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  paid_at?: string;
}

export interface Subscription {
  id: string;
  customer_id: string; // FK
  service_id: string; // FK
  address_id: string; // FK
  frequency: Frequency;
  preferred_day: string;
  preferred_time: string;
  price_per_visit: number;
  status: 'active' | 'paused' | 'cancelled';
  next_booking_date: string;
  total_visits_completed: number;
  created_at: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  max_uses: number;
  current_uses: number;
  valid_from: string;
  valid_until: string;
  min_order_amount: number;
  is_active: boolean;
}
