import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L, { Control } from "leaflet";
import * as React from "react";
import "leaflet/dist/leaflet.css";
import type { LatLngBoundsLiteral } from "leaflet";
type Coordinates =
    | {
          latitude: number;
          longitude: number;
      }
    | undefined;

type MapProps = {
    coords: Coordinates[] | undefined;
};

const icon = L.icon({
    iconUrl: "/images/marker-icon.png",
    iconAnchor: [17, 46],
});

const Map = (props: MapProps) => {
    const { coords } = props;

    const defaultCenter = { lat: 39.833851, lng: -74.871826 };
    const defaultZoom = 12;
    const mapRef = React.useRef<L.Map | null>(null);

    const getMaxMinLatLang = (lats: number[], longs: number[]) => {
        const sortedLats = lats.sort((a, b) => a - b);
        const sortedLongs = longs.sort((a, b) => a - b);
        const latObject = {
            min: sortedLats[0] || 0,
            max: sortedLats[sortedLats.length - 1] || 0,
        };
        const longObject = {
            min: sortedLongs[0] || 0,
            max: sortedLongs[sortedLongs.length - 1] || 0,
        };
        return { lats: latObject, longs: longObject };
    };

    const getCenter = React.useCallback(() => {
        if (coords && coords.length > 0) {
            const latsArr: number[] = [];
            const longsArr: number[] = [];
            let latSum = 0;
            let longSum = 0;

            coords.forEach((i) => {
                if (i?.latitude && i?.longitude) {
                    latsArr.push(i.latitude);
                    longsArr.push(i.longitude);
                    latSum += i.latitude || 0;
                    longSum += i.longitude || 0;
                }
            });
            const { lats, longs } = getMaxMinLatLang(latsArr, longsArr);

            const sw = L.latLng(lats.min, longs.min);
            const ne = L.latLng(lats.max, longs.max);

            return {
                lat: latSum / coords.length,
                lng: longSum / coords.length,
                bounds: [sw, ne],
            };
        }

        return {
            lat: 39.833851,
            lng: -74.871826,
            bounds: undefined,
        };
    }, [coords]);

    React.useEffect(() => {
        if (coords) {
            const { current: map } = mapRef;
            const center = getCenter();
            map?.setView({ lat: center.lat, lng: center.lng }, 18, {
                duration: 200,
            });
            center?.bounds &&
                map?.fitBounds(center.bounds as unknown as LatLngBoundsLiteral);
        }
    }, [coords, getCenter]);

    return (
        <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            style={{
                height: "100%",
                zIndex: 0,
            }}
            className="rounded-md"
            ref={mapRef}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {coords?.map((i, index) => {
                return (
                    i?.latitude &&
                    i?.longitude && (
                        <Marker
                            key={index}
                            position={[
                                i.latitude as number,
                                i.longitude as number,
                            ]}
                            icon={icon}
                        />
                    )
                );
            })}
        </MapContainer>
    );
};

export default Map;
