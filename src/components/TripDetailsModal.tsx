import { X, Calendar, MapPin } from 'lucide-react';
import type { Trip } from '../types';

interface TripDetailsModalProps {
    trip: Trip | null;
    onClose: () => void;
}

export function TripDetailsModal({ trip, onClose }: TripDetailsModalProps) {
    if (!trip) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="relative">
                    {/* Simplified for now as Trip type doesn't have photos array yet, just thumbnail */}
                    {trip.thumbnail ? (
                        <img
                            src={trip.thumbnail}
                            alt={trip.title}
                            className="w-full h-48 object-cover rounded-t-2xl"
                        />
                    ) : (
                        <div className="w-full h-32 bg-gray-200 rounded-t-2xl" />
                    )}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-700" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <div className="flex items-center gap-2 text-primary-600 mb-2">
                            <span className="text-xs font-bold px-2 py-1 bg-primary-50 rounded-full flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {trip.location.name}
                            </span>
                            <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-full flex items-center gap-1 text-gray-600">
                                <Calendar className="w-3 h-3" />
                                {trip.date instanceof Date ? trip.date.toLocaleDateString() : trip.date}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{trip.title}</h2>
                    </div>

                    <p className="text-gray-600 leading-relaxed">
                        {trip.description}
                    </p>

                    {/* Photos section commented out until Trip type is updated or logic fixed
                    {trip.photos && trip.photos.length > 1 && (
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {trip.photos.slice(1).map((photo: string, i: number) => (
                                <img key={i} src={photo} alt={`${trip.title} ${i + 2}`} className="rounded-lg object-cover w-full h-24" />
                            ))}
                        </div>
                    )}
                    */}
                </div>
            </div>
        </div>
    );
}
