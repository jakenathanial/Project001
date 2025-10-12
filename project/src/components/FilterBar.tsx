import { ArrowUpDown, Filter, X } from 'lucide-react';

interface FilterBarProps {
  destination: string;
  setDestination: (value: string) => void;
  travelClass: 'economy' | 'business' | 'first';
  setTravelClass: (value: 'economy' | 'business' | 'first') => void;
  sortBy: 'price_asc' | 'price_desc' | 'duration' | 'rating' | 'departure';
  setSortBy: (value: 'price_asc' | 'price_desc' | 'duration' | 'rating' | 'departure') => void;
  stopFilter: 'all' | 'direct' | 'onestop';
  setStopFilter: (value: 'all' | 'direct' | 'onestop') => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
}

export function FilterBar({
  destination,
  setDestination,
  travelClass,
  setTravelClass,
  sortBy,
  setSortBy,
  stopFilter,
  setStopFilter,
  showFilters,
  setShowFilters,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Filter className="w-6 h-6 text-blue-500" />
          Filter & Sort Flights
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
        </button>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Destination
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white text-gray-700 font-medium"
          >
            <option value="">All Destinations</option>
            <option value="JFK">New York (JFK)</option>
            <option value="EWR">New York (EWR)</option>
            <option value="LAX">Los Angeles</option>
            <option value="SFO">San Francisco</option>
            <option value="ORD">Chicago</option>
            <option value="MIA">Miami</option>
            <option value="DFW">Dallas</option>
            <option value="ATL">Atlanta</option>
            <option value="BOS">Boston</option>
            <option value="SEA">Seattle</option>
            <option value="IAD">Washington DC</option>
            <option value="LAS">Las Vegas</option>
            <option value="IAH">Houston</option>
            <option value="PHX">Phoenix</option>
            <option value="MCO">Orlando</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Travel Class
          </label>
          <select
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value as any)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white text-gray-700 font-medium"
          >
            <option value="economy">Economy</option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Stops
          </label>
          <select
            value={stopFilter}
            onChange={(e) => setStopFilter(e.target.value as any)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white text-gray-700 font-medium"
          >
            <option value="all">All Flights</option>
            <option value="direct">Direct Only</option>
            <option value="onestop">1 Stop Only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <ArrowUpDown className="w-4 h-4" />
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white text-gray-700 font-medium"
          >
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="duration">Shortest Duration</option>
            <option value="rating">Highest Rated</option>
            <option value="departure">Departure Time</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setDestination('');
              setTravelClass('economy');
              setSortBy('price_asc');
              setStopFilter('all');
            }}
            className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
