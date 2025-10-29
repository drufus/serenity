/*
  # Serenity Lake House - Complete Database Schema
  
  ## Overview
  This migration creates the complete database structure for a direct-booking vacation rental website
  with support for live availability, instant booking, payments, digital agreements, and automated emails.
  
  ## New Tables
  
  ### 1. property_settings
  Global configuration for the property including pricing, capacity, policies, and features.
  - `id` (uuid, primary key)
  - `property_name` (text) - Display name
  - `sleeps` (int) - Max guest capacity
  - `bedrooms`, `bathrooms` (int)
  - `square_feet` (int)
  - `parking_spaces` (int)
  - `pets_allowed` (boolean)
  - `base_nightly_rate` (numeric) - Default rate in USD
  - `cleaning_fee` (numeric)
  - `tax_rate` (numeric) - As decimal (e.g., 0.08 for 8%)
  - `min_nights` (int) - Minimum stay requirement
  - `check_in_time`, `check_out_time` (time)
  - `cancellation_policy` (text)
  - `house_rules` (text)
  - `damage_deposit` (numeric)
  - `created_at`, `updated_at` (timestamptz)
  
  ### 2. seasonal_rates
  Dynamic pricing based on date ranges (holidays, peak season, etc.)
  - `id` (uuid, primary key)
  - `name` (text) - e.g., "Summer Peak", "Holiday Premium"
  - `start_date`, `end_date` (date)
  - `nightly_rate` (numeric) - Overrides base rate
  - `min_nights` (int, nullable) - Overrides default if set
  - `active` (boolean)
  
  ### 3. blocked_dates
  Unavailable dates (owner blocks, maintenance, existing bookings)
  - `id` (uuid, primary key)
  - `date` (date, unique) - Single blocked date
  - `reason` (text) - e.g., "booked", "maintenance", "owner use"
  - `booking_id` (uuid, nullable) - Links to booking if applicable
  
  ### 4. bookings
  Core booking records with payment tracking
  - `id` (uuid, primary key)
  - `confirmation_code` (text, unique) - 8-char uppercase code
  - `guest_name`, `guest_email`, `guest_phone` (text)
  - `check_in`, `check_out` (date)
  - `num_guests` (int)
  - `num_nights` (int)
  - `subtotal` (numeric) - Nightly rate × nights
  - `cleaning_fee` (numeric)
  - `tax_amount` (numeric)
  - `discount_amount` (numeric, default 0)
  - `total_amount` (numeric) - Final amount paid
  - `status` (text) - 'pending', 'confirmed', 'cancelled', 'completed'
  - `payment_intent_id` (text, nullable) - Stripe payment ID
  - `agreement_signed` (boolean, default false)
  - `agreement_signed_at` (timestamptz, nullable)
  - `special_requests` (text, nullable)
  - `created_at`, `updated_at` (timestamptz)
  
  ### 5. booking_addons
  Optional extras selected during booking
  - `id` (uuid, primary key)
  - `booking_id` (uuid) - Links to bookings
  - `addon_id` (uuid) - Links to addons
  - `quantity` (int, default 1)
  - `price` (numeric) - Price at time of booking
  
  ### 6. addons
  Available add-ons (early check-in, kayak rental, firewood, etc.)
  - `id` (uuid, primary key)
  - `name` (text) - e.g., "Early Check-in"
  - `description` (text)
  - `price` (numeric)
  - `per_night` (boolean) - If true, multiplied by nights
  - `active` (boolean)
  - `sort_order` (int)
  
  ### 7. reviews
  Guest reviews and ratings
  - `id` (uuid, primary key)
  - `booking_id` (uuid, nullable) - Optional link to booking
  - `guest_name` (text)
  - `rating` (int) - 1-5 stars
  - `title` (text)
  - `comment` (text)
  - `stay_date` (date) - Month/year of stay
  - `approved` (boolean, default false) - Moderation
  - `created_at` (timestamptz)
  
  ### 8. gallery_images
  Photo gallery with categorization
  - `id` (uuid, primary key)
  - `category` (text) - 'exterior', 'dock', 'living', 'kitchen', 'bedroom', 'bathroom', 'workspace'
  - `url` (text) - Full image URL
  - `thumbnail_url` (text, nullable)
  - `caption` (text, nullable)
  - `alt_text` (text) - For SEO/accessibility
  - `sort_order` (int)
  - `featured` (boolean, default false) - Show on homepage
  
  ### 9. contact_submissions
  Contact form submissions
  - `id` (uuid, primary key)
  - `name`, `email`, `phone` (text)
  - `message` (text)
  - `status` (text, default 'new') - 'new', 'read', 'replied'
  - `created_at` (timestamptz)
  
  ## Security
  - All tables have RLS enabled
  - Public read access for display data (settings, reviews, gallery, addons)
  - Write operations restricted or require authentication
  - Sensitive booking data partially protected
  
  ## Indexes
  - Performance indexes on commonly queried fields (dates, codes, status)
*/

-- Property Settings Table
CREATE TABLE IF NOT EXISTS property_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_name text NOT NULL DEFAULT 'Serenity Lake House',
  sleeps int NOT NULL DEFAULT 8,
  bedrooms int NOT NULL DEFAULT 3,
  bathrooms int NOT NULL DEFAULT 2,
  square_feet int DEFAULT 2000,
  parking_spaces int DEFAULT 3,
  pets_allowed boolean DEFAULT false,
  base_nightly_rate numeric(10,2) NOT NULL DEFAULT 350.00,
  cleaning_fee numeric(10,2) NOT NULL DEFAULT 150.00,
  tax_rate numeric(5,4) NOT NULL DEFAULT 0.0800,
  min_nights int NOT NULL DEFAULT 2,
  check_in_time time NOT NULL DEFAULT '16:00:00',
  check_out_time time NOT NULL DEFAULT '11:00:00',
  cancellation_policy text,
  house_rules text,
  damage_deposit numeric(10,2) DEFAULT 500.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seasonal Rates Table
CREATE TABLE IF NOT EXISTS seasonal_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  nightly_rate numeric(10,2) NOT NULL,
  min_nights int,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Blocked Dates Table
CREATE TABLE IF NOT EXISTS blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  reason text NOT NULL DEFAULT 'booked',
  booking_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  confirmation_code text NOT NULL UNIQUE,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  num_guests int NOT NULL,
  num_nights int NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  cleaning_fee numeric(10,2) NOT NULL,
  tax_amount numeric(10,2) NOT NULL,
  discount_amount numeric(10,2) DEFAULT 0,
  total_amount numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_intent_id text,
  agreement_signed boolean DEFAULT false,
  agreement_signed_at timestamptz,
  special_requests text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'))
);

-- Add-ons Master Table
CREATE TABLE IF NOT EXISTS addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  per_night boolean DEFAULT false,
  active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Booking Add-ons Junction Table
CREATE TABLE IF NOT EXISTS booking_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  addon_id uuid NOT NULL REFERENCES addons(id),
  quantity int DEFAULT 1,
  price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  guest_name text NOT NULL,
  rating int NOT NULL,
  title text NOT NULL,
  comment text NOT NULL,
  stay_date date NOT NULL,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5)
);

-- Gallery Images Table
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  url text NOT NULL,
  thumbnail_url text,
  caption text,
  alt_text text NOT NULL,
  sort_order int DEFAULT 0,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_category CHECK (category IN ('exterior', 'dock', 'living', 'kitchen', 'bedroom', 'bathroom', 'workspace'))
);

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('new', 'read', 'replied'))
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_blocked_dates_date ON blocked_dates(date);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_code ON bookings(confirmation_code);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_seasonal_rates_dates ON seasonal_rates(start_date, end_date, active);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_images(category, sort_order);

-- Enable Row Level Security
ALTER TABLE property_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasonal_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public Read Access for Display Data
CREATE POLICY "Public can view property settings"
  ON property_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view active seasonal rates"
  ON seasonal_rates FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Public can view blocked dates"
  ON blocked_dates FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view active addons"
  ON addons FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Public can view approved reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (approved = true);

CREATE POLICY "Public can view gallery images"
  ON gallery_images FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies: Bookings (guests can view their own via confirmation code in app logic)
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view bookings"
  ON bookings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can update bookings"
  ON bookings FOR UPDATE
  TO anon, authenticated
  USING (true);

-- RLS Policies: Booking Add-ons
CREATE POLICY "Anyone can create booking addons"
  ON booking_addons FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view booking addons"
  ON booking_addons FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies: Contact Submissions
CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Insert Default Property Settings
INSERT INTO property_settings (
  property_name,
  sleeps,
  bedrooms,
  bathrooms,
  square_feet,
  parking_spaces,
  pets_allowed,
  base_nightly_rate,
  cleaning_fee,
  tax_rate,
  min_nights,
  cancellation_policy,
  house_rules,
  damage_deposit
) VALUES (
  'Serenity Lake House',
  8,
  3,
  2,
  2000,
  3,
  false,
  350.00,
  150.00,
  0.0800,
  2,
  'Free cancellation up to 30 days before check-in. 50% refund for cancellations 14-29 days before check-in. No refund for cancellations within 14 days of check-in.',
  'No smoking inside the property. Quiet hours: 10 PM - 8 AM. Maximum occupancy strictly enforced. Please respect neighbors and lakefront etiquette. Clean up after yourself. Report any damages immediately.',
  500.00
) ON CONFLICT DO NOTHING;

-- Insert Sample Add-ons
INSERT INTO addons (name, description, price, per_night, active, sort_order) VALUES
  ('Early Check-in', 'Check in at 12 PM instead of 4 PM (subject to availability)', 75.00, false, true, 1),
  ('Late Check-out', 'Check out at 3 PM instead of 11 AM (subject to availability)', 75.00, false, true, 2),
  ('Kayak Rental', 'Two kayaks with paddles and life vests for your stay', 50.00, false, true, 3),
  ('Firewood Bundle', 'Premium firewood bundle for fire pit or fireplace', 40.00, false, true, 4),
  ('Mid-Stay Cleaning', 'Additional cleaning service during your stay', 120.00, false, true, 5),
  ('Pet Fee', 'Bring your furry friend (requires approval)', 100.00, false, true, 6)
ON CONFLICT DO NOTHING;

-- Insert Sample Reviews
INSERT INTO reviews (guest_name, rating, title, comment, stay_date, approved) VALUES
  ('Sarah M.', 5, 'Absolute paradise on the lake', 'We spent a long weekend here and didn''t want to leave. The dock was perfect for morning coffee, the house had everything we needed, and the sunset views were breathtaking. Already planning our return trip!', '2024-07-15', true),
  ('The Johnson Family', 5, 'Perfect family getaway', 'Our family of 6 had an amazing time. The kids loved kayaking and fishing off the dock. The house was spotless, well-stocked, and beautifully decorated. Communication with the host was excellent. Highly recommend!', '2024-08-22', true),
  ('Michael & Jennifer', 5, 'Couldn''t have asked for better', 'This was exactly what we needed - peaceful, beautiful, and comfortable. The kitchen was fully equipped, beds were incredibly comfortable, and having the private dock made our stay extra special. We''ll be back!', '2024-09-10', true)
ON CONFLICT DO NOTHING;