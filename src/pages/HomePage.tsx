import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { pastTrips } from '../data/mockData';
import { Map as MapIcon, Globe } from 'lucide-react';

// Fix for default marker icon in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

export function HomePage() {
    const [mapView, setMapView] = useState<'japan' | 'world'>('japan');

    // Centers
    const centers = {
        japan: [36.2048, 138.2529], // Center of Japan
        world: [20.0, 0.0],         // Close to center of world map view
    } as const;

    // Zooms
    const zooms = {
        japan: 5,
        world: 2,
    } as const;

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Map Controls */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10 relative">
                <div>
                    <h2 className="text-3xl font-bold text-black flex items-center gap-3 tracking-tighter">
                        <MapIcon className="w-8 h-8 text-black" strokeWidth={2.5} />
                        TRIP MAP
                    </h2>
                    <p className="text-xs text-gray-500 font-medium tracking-widest mt-1 uppercase">Your Travel History</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-md">
                    <button
                        onClick={() => setMapView('japan')}
                        className={`px-4 py-2 text-xs font-bold rounded-sm transition-all tracking-wider ${mapView === 'japan'
                            ? 'bg-black text-white shadow-sm'
                            : 'text-gray-500 hover:text-black'
                            }`}
                    >
                        JAPAN
                    </button>
                    <button
                        onClick={() => setMapView('world')}
                        className={`px-4 py-2 text-xs font-bold rounded-sm transition-all flex items-center gap-1 tracking-wider ${mapView === 'world'
                            ? 'bg-black text-white shadow-sm'
                            : 'text-gray-500 hover:text-black'
                            }`}
                    >
                        <Globe className="w-3 h-3" /> WORLD
                    </button>
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative z-0 bg-gray-50">
                <MapContainer
                    key={mapView} // Force re-render on view change
                    center={centers[mapView] as [number, number]}
                    zoom={zooms[mapView]}
                    style={{ height: '100%', width: '100%', backgroundColor: '#ffffff' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        className="map-tiles-modern"
                    />

                    {/* Add a global style for the map tiles directly in the component for simplicity */}
                    <style>{`
                        .map-tiles-modern {
                            filter: grayscale(100%) contrast(110%);
                        }
                        .leaflet-container {
                            background: #ffffff !important;
                            font-family: 'Inter', sans-serif;
                        }
                        /* Modern Minimal Compass */
                        .compass-modern {
                            position: absolute;
                            bottom: 40px;
                            left: 40px;
                            width: 60px;
                            height: 60px;
                            pointer-events: none;
                            z-index: 400;
                            opacity: 0.8;
                            color: #000;
                        }
                     `}</style>

                    {pastTrips.map((trip) => (
                        <Marker key={trip.id} position={[trip.location.lat, trip.location.lng]}>
                            <Popup className="custom-popup">
                                <div className="w-56 font-sans">
                                    <div className="h-32 w-full mb-3 overflow-hidden rounded-sm relative">
                                        <img src={trip.thumbnail} alt={trip.title} className="w-full h-full object-cover grayscale transition-all hover:grayscale-0" />
                                        <div className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-0.5 font-bold uppercase tracking-widest">
                                            {trip.date.getFullYear()}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-black text-lg leading-tight mb-1">{trip.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 border-b border-gray-100 pb-2">
                                        <span className="uppercase tracking-wider font-semibold">{trip.location.name}</span>
                                    </div>
                                    {trip.description && (
                                        <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">{trip.description}</p>
                                    )}
                                    <button className="w-full bg-black text-white text-xs py-2 rounded-sm hover:bg-gray-800 transition-colors uppercase font-bold tracking-widest">
                                        View Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Modern Minimal Compass SVG */}
                    <div className="compass-modern">
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="1" />
                            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="1" />
                            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" />
                            <text x="50" y="20" textAnchor="middle" fontSize="12" fill="currentColor" fontWeight="bold">N</text>
                        </svg>
                    </div>

                </MapContainer>
            </div>
        </div>
    );
}
