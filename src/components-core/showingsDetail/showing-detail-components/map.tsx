import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import getCenter from "geolib/es/getCenter";
import "leaflet/dist/leaflet.css";

const cords = [
    { latitude: -74.9466, longitude: 39.9091 },
    { latitude: -74.9466, longitude: 39.9284 },
    { latitude: -74.38492, longitude: 40.60895 },
];

const icon = L.icon({ iconUrl: "/images/marker-icon.png" });

const Map = () => {
    const center = getCenter(cords) as {
        latitude: number;
        longitude: number;
    };
    return (
        <MapContainer
            center={[center.longitude, center.latitude]}
            zoom={8}
            style={{
                height: "100%",
                zIndex: 0,
            }}
            className="rounded-md"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {cords.map((i) => {
                return (
                    <Marker
                        key={i.longitude}
                        position={[i.longitude, i.latitude]}
                        icon={icon}
                    />
                );
            })}
        </MapContainer>
    );
};

export default Map;
