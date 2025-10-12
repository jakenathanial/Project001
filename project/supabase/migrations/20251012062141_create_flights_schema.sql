-- Create Dubai to USA Flight Booking System
-- 
-- 1. New Tables
--    - airlines: Store airline information
--    - usa_cities: Store USA destination cities
--    - flights: Store flight information with pricing
-- 
-- 2. Security
--    - Enable RLS on all tables
--    - Add policies for public read access

-- Airlines table
CREATE TABLE IF NOT EXISTS airlines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  logo_url text,
  booking_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- USA Cities table
CREATE TABLE IF NOT EXISTS usa_cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_name text NOT NULL,
  airport_code text UNIQUE NOT NULL,
  airport_name text NOT NULL,
  timezone text,
  created_at timestamptz DEFAULT now()
);

-- Flights table
CREATE TABLE IF NOT EXISTS flights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  airline_id uuid REFERENCES airlines(id) ON DELETE CASCADE,
  destination_id uuid REFERENCES usa_cities(id) ON DELETE CASCADE,
  flight_number text NOT NULL,
  departure_time text NOT NULL,
  arrival_time text NOT NULL,
  duration text NOT NULL,
  stops text NOT NULL,
  aircraft text NOT NULL,
  economy_price integer NOT NULL,
  business_price integer NOT NULL,
  first_price integer NOT NULL,
  available_days text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE airlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE usa_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Airlines are publicly readable"
  ON airlines FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "USA cities are publicly readable"
  ON usa_cities FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Flights are publicly readable"
  ON flights FOR SELECT
  TO anon
  USING (true);

-- Insert initial data: Airlines
INSERT INTO airlines (name, code, logo_url, booking_url) VALUES
  ('Emirates', 'EK', 'https://images.kiwi.com/airlines/64/EK.png', 'https://www.emirates.com'),
  ('United Airlines', 'UA', 'https://images.kiwi.com/airlines/64/UA.png', 'https://www.united.com'),
  ('Delta Air Lines', 'DL', 'https://images.kiwi.com/airlines/64/DL.png', 'https://www.delta.com'),
  ('American Airlines', 'AA', 'https://images.kiwi.com/airlines/64/AA.png', 'https://www.aa.com'),
  ('British Airways', 'BA', 'https://images.kiwi.com/airlines/64/BA.png', 'https://www.britishairways.com'),
  ('Etihad Airways', 'EY', 'https://images.kiwi.com/airlines/64/EY.png', 'https://www.etihad.com'),
  ('Qatar Airways', 'QR', 'https://images.kiwi.com/airlines/64/QR.png', 'https://www.qatarairways.com'),
  ('Lufthansa', 'LH', 'https://images.kiwi.com/airlines/64/LH.png', 'https://www.lufthansa.com'),
  ('Air France', 'AF', 'https://images.kiwi.com/airlines/64/AF.png', 'https://www.airfrance.com'),
  ('Turkish Airlines', 'TK', 'https://images.kiwi.com/airlines/64/TK.png', 'https://www.turkishairlines.com')
ON CONFLICT (code) DO NOTHING;

-- Insert initial data: USA Cities
INSERT INTO usa_cities (city_name, airport_code, airport_name, timezone) VALUES
  ('New York', 'JFK', 'John F. Kennedy International Airport', 'America/New_York'),
  ('New York', 'EWR', 'Newark Liberty International Airport', 'America/New_York'),
  ('Los Angeles', 'LAX', 'Los Angeles International Airport', 'America/Los_Angeles'),
  ('San Francisco', 'SFO', 'San Francisco International Airport', 'America/Los_Angeles'),
  ('Chicago', 'ORD', 'O''Hare International Airport', 'America/Chicago'),
  ('Miami', 'MIA', 'Miami International Airport', 'America/New_York'),
  ('Dallas', 'DFW', 'Dallas/Fort Worth International Airport', 'America/Chicago'),
  ('Atlanta', 'ATL', 'Hartsfield-Jackson Atlanta International Airport', 'America/New_York'),
  ('Boston', 'BOS', 'Logan International Airport', 'America/New_York'),
  ('Seattle', 'SEA', 'Seattle-Tacoma International Airport', 'America/Los_Angeles'),
  ('Washington', 'IAD', 'Washington Dulles International Airport', 'America/New_York'),
  ('Las Vegas', 'LAS', 'Harry Reid International Airport', 'America/Los_Angeles'),
  ('Houston', 'IAH', 'George Bush Intercontinental Airport', 'America/Chicago'),
  ('Phoenix', 'PHX', 'Phoenix Sky Harbor International Airport', 'America/Phoenix'),
  ('Orlando', 'MCO', 'Orlando International Airport', 'America/New_York')
ON CONFLICT (airport_code) DO NOTHING;