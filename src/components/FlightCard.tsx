import { Plane, Clock, MapPin, Star, Wifi, Tv, Coffee, Briefcase } from 'lucide-react';
import { Flight } from '../lib/supabase';

interface FlightCardProps {
  flight: Flight;
  travelClass: 'economy' | 'business' | 'first';
}

export function FlightCard({ flight, travelClass }: FlightCardProps) {
  const getPrice = () => {
    switch (travelClass) {
      case 'economy':
        return flight.economy_price;
      case 'business':
        return flight.business_price;
      case 'first':
        return flight.first_price;
    }
  };

  const price = getPrice();

  const handleBooking = () => {
    window.open(flight.booking_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-300 hover:-translate-y-1 group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                {flight.airline_code}
              </div>
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                {flight.airline}
              </h3>
            </div>
            <p className="text-sm text-gray-500 font-medium">{flight.flight_number}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-yellow-500 mb-1">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold text-gray-700">{flight.rating}</span>
            </div>
            <div className="text-xs text-gray-500">{flight.seats_available} seats</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-medium">Dubai</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{flight.departure_time}</div>
            <div className="text-xs text-gray-500 mt-1">{flight.departure_airport}</div>
          </div>

          <div className="flex-1 flex flex-col items-center px-4">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <div className="h-px bg-gray-300 w-12"></div>
              <Plane className="w-5 h-5 text-blue-500 transform rotate-90" />
              <div className="h-px bg-gray-300 w-12"></div>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-3 h-3" />
              <span className="text-xs font-medium">{flight.duration}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">{flight.stops}</div>
          </div>

          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-2 text-gray-600 mb-1">
              <span className="text-xs font-medium">{flight.arrival_city}</span>
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{flight.arrival_time}</div>
            <div className="text-xs text-gray-500 mt-1">{flight.arrival_airport}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2 font-medium">Aircraft</div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700 font-medium">{flight.aircraft}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2 font-medium">Amenities</div>
          <div className="flex flex-wrap gap-2">
            {flight.wifi && (
              <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                <Wifi className="w-3 h-3" />
                <span>WiFi</span>
              </div>
            )}
            {flight.entertainment && (
              <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium">
                <Tv className="w-3 h-3" />
                <span>Entertainment</span>
              </div>
            )}
            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-medium">
              <Coffee className="w-3 h-3" />
              <span>Meals</span>
            </div>
            {flight.amenities?.slice(0, 2).map((amenity, idx) => (
              <div key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium">
                {amenity}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="text-xs text-gray-500 mb-1">
              {travelClass === 'economy' && 'Economy Class'}
              {travelClass === 'business' && 'Business Class'}
              {travelClass === 'first' && 'First Class'}
            </div>
            <div className="text-3xl font-bold text-gray-800">
              ${price.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">per person</div>
          </div>
          <button
            onClick={handleBooking}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
