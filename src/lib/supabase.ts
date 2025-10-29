import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PropertySettings {
  id: string;
  property_name: string;
  sleeps: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  parking_spaces: number;
  pets_allowed: boolean;
  base_nightly_rate: number;
  cleaning_fee: number;
  tax_rate: number;
  min_nights: number;
  check_in_time: string;
  check_out_time: string;
  cancellation_policy: string;
  house_rules: string;
  damage_deposit: number;
}

export interface SeasonalRate {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  nightly_rate: number;
  min_nights: number | null;
  active: boolean;
}

export interface BlockedDate {
  id: string;
  date: string;
  reason: string;
  booking_id: string | null;
}

export interface Booking {
  id: string;
  confirmation_code: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  num_guests: number;
  num_nights: number;
  subtotal: number;
  cleaning_fee: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_intent_id: string | null;
  agreement_signed: boolean;
  agreement_signed_at: string | null;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  per_night: boolean;
  active: boolean;
  sort_order: number;
}

export interface BookingAddon {
  id: string;
  booking_id: string;
  addon_id: string;
  quantity: number;
  price: number;
}

export interface Review {
  id: string;
  guest_name: string;
  rating: number;
  title: string;
  comment: string;
  stay_date: string;
  approved: boolean;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  category: 'exterior' | 'dock' | 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'workspace';
  url: string;
  thumbnail_url: string | null;
  caption: string | null;
  alt_text: string;
  sort_order: number;
  featured: boolean;
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone: string | null;
  message: string;
}
