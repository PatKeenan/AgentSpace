import { MapboxPlaces } from "types/map-box";

interface Id {
    id: string;
}

export interface Person extends Id {
    name: string;
}

export interface Status extends Id {
    value: "confirmed" | "pending" | "canceled";
    display: string;
}

export type ShowingFormState = {
    address: MapboxPlaces["features"] | undefined;
    clients?: Person[];
    agents?: Person[];
    status?: Status | undefined;
    startTime?: string;
    endTime?: string;
    buildingOrApt?: string;
    note?: string;
};
