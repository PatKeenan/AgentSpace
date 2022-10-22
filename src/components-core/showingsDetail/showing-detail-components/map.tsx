import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
    return (
        <MapContainer
            center={[39.9091, -74.9466]}
            zoom={16}
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
        </MapContainer>
    );
};

export default Map;
