import type { AppointmentRouterOutput } from "server/trpc/router/appointmentRouter";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import * as React from "react";
import type { LatLngBoundsLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";
import { AppointmentStatus } from "@prisma/client";

const iconColors: { [key in AppointmentStatus]: string } = {
    CONFIRMED: "hue-rotate-[250deg]",
    PENDING: "hue-rotate-[185deg] brightness-[120%]",
    CANCELED: "hue-rotate-[140deg]",
    NO_STATUS: "grayscale",
    DENIED: "hue-rotate-[140deg]",
};

const icon = (status: AppointmentStatus) =>
    L.icon({
        iconUrl: "/images/marker-icon.png",
        shadowUrl: "/images/marker-shadow.png",
        iconAnchor: [17, 46],
        className: iconColors[status],
    });

export const AppointmentsMap = ({
    appointments,
}: {
    appointments: AppointmentRouterOutput["getByDate"];
}) => {
    const defaultCenter = { lat: 39.833851, lng: -74.871826 };
    const defaultZoom = appointments.length == 0 ? 2 : 12;
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
        if (appointments && appointments.length > 0) {
            const latsArr: number[] = [];
            const longsArr: number[] = [];
            let latSum = 0;
            let longSum = 0;

            appointments.forEach((i) => {
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
                lat: latSum / latsArr.length,
                lng: longSum / latsArr.length,
                bounds: [sw, ne],
            };
        }

        return {
            lat: 39.833851,
            lng: -74.871826,
            bounds: undefined,
        };
    }, [appointments]);

    React.useEffect(() => {
        const { current: map } = mapRef;
        if (appointments && appointments.length > 0) {
            const { current: map } = mapRef;
            const center = getCenter();
            map?.setView({ lat: center.lat, lng: center.lng }, 17, {
                animate: false,
                duration: 0,
            });
            center?.bounds &&
                map?.fitBounds(center.bounds as unknown as LatLngBoundsLiteral);
        } else {
            map?.setView({ lat: 39.833851, lng: -74.871826 }, 6, {
                animate: false,
                duration: 0,
            });
        }
    }, [appointments, getCenter]);

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
            {appointments?.map((i, index) => {
                return (
                    i?.latitude &&
                    i?.longitude && (
                        <Marker
                            key={index}
                            position={[
                                i.latitude as number,
                                i.longitude as number,
                            ]}
                            icon={icon(i.status)}
                        >
                            <Popup>
                                <p>
                                    Appointment{" "}
                                    <span className="font-medium">
                                        {index + 1}
                                    </span>
                                </p>
                            </Popup>
                        </Marker>
                    )
                );
            })}
        </MapContainer>
    );
};

export default AppointmentsMap;
