import { Plane, Users, Star, DollarSign } from 'lucide-react';

interface StatsBarProps {
  totalFlights: number;
  averagePrice: number;
  topRatedCount: number;
}

export function StatsBar({ totalFlights, averagePrice, topRatedCount }: StatsBarProps) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 mb-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mb-3">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{totalFlights}</div>
          <div className="text-sm text-blue-100">Available Flights</div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mb-3">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">${averagePrice}</div>
          <div className="text-sm text-blue-100">Average Price</div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mb-3">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{topRatedCount}</div>
          <div className="text-sm text-blue-100">Top Rated</div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mb-3">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">8+</div>
          <div className="text-sm text-blue-100">Airlines</div>
        </div>
      </div>
    </div>
  );
}
