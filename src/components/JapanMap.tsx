import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import type { Trip } from "../types";

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/japan/japan-prefectures.json";

interface JapanMapProps {
    trips: Trip[];
    onPinClick: (trip: Trip) => void;
}

export function JapanMap({ trips, onPinClick }: JapanMapProps) {
    return (
        <div className="w-full h-full">
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 1500,
                    center: [137, 38]
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
                        className="cursor-pointer group"
                    >
                        <circle r={6} fill="#F43F5E" stroke="#fff" strokeWidth={2} className="animate-pulse" />
                        <text
                            textAnchor="middle"
                            y={-10}
                            style={{ fontFamily: "system-ui", fill: "#5D5A6D", fontSize: "10px", fontWeight: "bold" }}
                        >
                            {trip.location.name}
                        </text>
                    </Marker>
                ))}
            </ComposableMap>
        </div>
    );
}
