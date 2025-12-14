import { MapPin, Calendar } from 'lucide-react';
import { pastTrips } from '../data/trips';

export function MemoryPage() {
  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">思い出</h2>
        <p className="text-sm text-gray-600 mt-1">過去の旅行を振り返る</p>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pastTrips.map((trip) => (
          <div
            key={trip.id}
            className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="h-48 overflow-hidden relative">
              <img
                src={trip.thumbnail}
                alt={trip.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-sm font-medium">詳細を見る</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center gap-2 text-primary-600 text-xs font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-3 h-3" />
                {trip.location.name}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                {trip.title}
              </h3>

              <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                <Calendar className="w-4 h-4" />
                {new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }).format(trip.date)}
              </div>

              <p className="text-gray-600 text-sm line-clamp-2">
                {trip.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {pastTrips.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-400">まだ思い出がありません</p>
        </div>
      )}
    </div>
  );
}
