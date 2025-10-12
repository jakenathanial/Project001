import { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { supabase, Flight } from './lib/supabase';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { FlightCard } from './components/FlightCard';
import { StatsBar } from './components/StatsBar';

function App() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [destination, setDestination] = useState('');
  const [travelClass, setTravelClass] = useState<'economy' | 'business' | 'first'>('economy');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'duration' | 'rating' | 'departure'>('price_asc');
  const [stopFilter, setStopFilter] = useState<'all' | 'direct' | 'onestop'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchFlights();
  }, []);

  useEffect(() => {
    filterAndSortFlights();
  }, [flights, destination, travelClass, sortBy, stopFilter]);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('flights')
        .select('*')
        .order('economy_price', { ascending: true });

      if (fetchError) throw fetchError;

      setFlights(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch flights');
      console.error('Error fetching flights:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortFlights = () => {
    let filtered = [...flights];

    if (destination) {
      filtered = filtered.filter(f => f.arrival_airport === destination);
    }

    if (stopFilter === 'direct') {
      filtered = filtered.filter(f => f.stops.toLowerCase() === 'direct');
    } else if (stopFilter === 'onestop') {
      filtered = filtered.filter(f => f.stops.toLowerCase().includes('1 stop'));
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return (a[`${travelClass}_price`] as number) - (b[`${travelClass}_price`] as number);
        case 'price_desc':
          return (b[`${travelClass}_price`] as number) - (a[`${travelClass}_price`] as number);
        case 'duration': {
          const getDurationMinutes = (duration: string) => {
            const match = duration.match(/(\d+)h\s*(\d+)m/);
            if (!match) return 0;
            return parseInt(match[1]) * 60 + parseInt(match[2]);
          };
          return getDurationMinutes(a.duration) - getDurationMinutes(b.duration);
        }
        case 'rating':
          return b.rating - a.rating;
        case 'departure': {
          const getTimeMinutes = (time: string) => {
            const match = time.match(/(\d+):(\d+)/);
            if (!match) return 0;
            return parseInt(match[1]) * 60 + parseInt(match[2]);
          };
          return getTimeMinutes(a.departure_time) - getTimeMinutes(b.departure_time);
        }
        default:
          return 0;
      }
    });

    setFilteredFlights(filtered);
  };

  const getStats = () => {
    const total = filteredFlights.length;
    const avgPrice = filteredFlights.length > 0
      ? Math.round(filteredFlights.reduce((sum, f) => sum + f[`${travelClass}_price`], 0) / filteredFlights.length)
      : 0;
    const topRated = filteredFlights.filter(f => f.rating >= 4.5).length;

    return { total, avgPrice, topRated };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600 font-medium">Loading flights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Error Loading Flights</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={fetchFlights}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Hero />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <StatsBar
          totalFlights={stats.total}
          averagePrice={stats.avgPrice}
          topRatedCount={stats.topRated}
        />

        <FilterBar
          destination={destination}
          setDestination={setDestination}
          travelClass={travelClass}
          setTravelClass={setTravelClass}
          sortBy={sortBy}
          setSortBy={setSortBy}
          stopFilter={stopFilter}
          setStopFilter={setStopFilter}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-500" />
            {filteredFlights.length} Flights Found
          </h2>
          <div className="text-sm text-gray-600">
            Showing{' '}
            <span className="font-semibold text-blue-600">
              {travelClass === 'economy' && 'Economy'}
              {travelClass === 'business' && 'Business'}
              {travelClass === 'first' && 'First Class'}
            </span>
            {' '}prices
          </div>
        </div>

        {filteredFlights.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Flights Found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters to see more results
            </p>
            <button
              onClick={() => {
                setDestination('');
                setStopFilter('all');
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFlights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                travelClass={travelClass}
              />
            ))}
          </div>
        )}
      </div>

      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Book Your Flight?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Compare prices from all major airlines and book your Dubai to USA flight today.
            Get the best deals on direct and connecting flights.
          </p>
          <div className="border-t border-gray-700 pt-6 mt-6">
            <p className="text-gray-400 text-sm">
              © 2025 Dubai USA Flights. All flight prices are subject to availability and may change.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
