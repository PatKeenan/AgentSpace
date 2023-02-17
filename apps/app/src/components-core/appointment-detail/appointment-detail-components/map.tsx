import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import getCenter from "geolib/es/getCenter";
import "leaflet/dist/leaflet.css";

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
        // @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
