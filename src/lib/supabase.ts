import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Flight {
  id: string;
  airline: string;
  airline_code: string;
  flight_number: string;
  departure_city: string;
  departure_airport: string;
  arrival_city: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  stops: string;
  stop_cities: string[];
  aircraft: string;
  economy_price: number;
  business_price: number;
  first_price: number;
  booking_url: string;
  amenities: string[];
  baggage_allowance: string;
  meal_service: string;
  entertainment: boolean;
  wifi: boolean;
  seats_available: number;
  rating: number;
  created_at: string;
}
