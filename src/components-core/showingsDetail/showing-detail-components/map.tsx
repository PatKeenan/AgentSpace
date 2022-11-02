import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import getCenter from "geolib/es/getCenter";
import "leaflet/dist/leaflet.css";
import { MapboxPlaces } from "types/map-box";

const cords = [
    { latitude: -74.9466, longitude: 39.9091 },
    { latitude: -74.9466, longitude: 39.9284 },
    { latitude: -74.38492, longitude: 40.60895 },
];

const icon = L.icon({ iconUrl: "/images/marker-icon.png" });

const Map = ({
    cords,
}: {
    cords:
        | {
              latitude: number | undefined;
              longitude: number | undefined;
          }[]
        | undefined;
}) => {
    const center = getCenter(
        cords ?? [
            {
                latitude: 39.9091,
                longitude: -74.9466,
            },
        ]
    ) as {
        latitude: number;
        longitude: number;
    };
    console.log(center);
    return (
        <MapContainer
            center={[center.latitude, center.longitude]}
            zoom={cords ? 12 : 8}
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
            {cords?.map((i, index) => {
                return (
                    <Marker
                        key={index}
                        position={[i.longitude as number, i.latitude as number]}
                        icon={icon}
                    />
                );
            })}
        </MapContainer>
    );
};

export default Map;
