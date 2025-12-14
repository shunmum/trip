import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import type { Trip } from "../types";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-50m.json";

interface WorldMapProps {
    trips: Trip[];
    onPinClick: (trip: Trip) => void;
}

export function WorldMap({ trips, onPinClick }: WorldMapProps) {
    return (
        <div className="w-full h-full">
            <ComposableMap
                projectionConfig={{
                    scale: 140,
                }}
                className="w-full h-auto bg-blue-50/30 rounded-xl"
            >
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#EAEAEC"
                                stroke="#D6D6DA"
                                strokeWidth={0.5}
                                style={{
                                    default: { outline: "none" },
                                    hover: { fill: "#F5F5F5", outline: "none" },
                                    pressed: { outline: "none" },
                                }}
                            />
                        ))
                    }
                </Geographies>
                {trips.map((trip) => (
                    <Marker
                        key={trip.id}
                        coordinates={[trip.location.lng, trip.location.lat]}
                        onClick={() => onPinClick(trip)}
                        className="cursor-pointer"
                    >
                        <circle r={4} fill="#F43F5E" stroke="#fff" strokeWidth={1.5} className="animate-pulse" />
                    </Marker>
                ))}
            </ComposableMap>
        </div>
    );
}
