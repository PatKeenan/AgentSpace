import {
    Contact,
    ContactMeta,
    ContactOnShowingRole,
    Showing,
    ShowingStatus,
} from "@prisma/client";
import { MapboxPlaces } from "types/map-box";

interface Id {
    id: string;
}

export interface Person extends Id {
    name: string;
}

export interface Status extends Id {
    value: ShowingStatus;
    display: string;
}

export type ShowingFormState = {
    address: MapboxPlaces["features"] | undefined;
    clients?: Contact[];
    agents?: Contact[];
    status?: Status | undefined;
    startTime?: string;
    endTime?: string;
    buildingOrApt?: string;
    note?: string;
};

export type ShowingCardProps = {
    index: number;
    showing: Showing & {
        contacts: {
            role: ContactOnShowingRole;
            contact: Partial<Contact>;
        }[];
    };
};
