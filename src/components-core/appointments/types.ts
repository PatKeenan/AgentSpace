import {
    Contact,
    ContactMeta,
    ContactOnAppointmentRole,
    Appointment,
    AppointmentStatus,
} from "@prisma/client";
import { MapboxPlaces } from "types/map-box";

interface Id {
    id: string;
}

export interface Person extends Id {
    name: string;
}

export interface Status extends Id {
    value: AppointmentStatus;
    display: string;
}

export type AppointmentFormState = {
    address: MapboxPlaces["features"] | undefined;
    clients?: Contact[];
    agents?: Contact[];
    status?: Status | undefined;
    startTime?: string;
    endTime?: string;
    buildingOrApt?: string;
    note?: string;
};

export type AppointmentCardProps = {
    index: number;
    appointment: Appointment & {
        contacts: {
            role: ContactOnAppointmentRole;
            contact: Partial<Contact>;
        }[];
    };
};
