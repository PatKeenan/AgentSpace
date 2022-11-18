import { MapboxPlaces } from "types/map-box";

interface Id {
    id: string;
}

export interface Contact extends Id {
    name: string;
}

export interface Status extends Id {
    value: "confirmed" | "pending" | "canceled";
    display: string;
}

export type AppointmentFormState = {
    address: MapboxPlaces["features"] | undefined;
    clients?: Contact[];
    agent?: Contact | undefined;
    status?: Status | undefined;
    startTime?: string;
    endTime?: string;
    buildingOrApt?: string;
    note?: string;
};
