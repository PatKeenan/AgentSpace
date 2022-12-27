import {
    Contact,
    ContactMeta,
    Appointment,
    AppointmentStatus,
    Profile,
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
    address: MapboxPlaces["features"][number] | undefined | null;
    clients?: Contact[];
    agents?: Contact[];
    status?: {
        id: string;
        value: AppointmentStatus[number];
        display: string;
    };
    startTime?: string;
    endTime?: string;
    buildingOrApt?: string;
    note?: string;
};

export type AppointmentCardProps = {
    index: number;
    appointment: Appointment & {
        contacts: {
            role: "";
            contact: Partial<Contact>;
        }[];
    };
};

export type Selected =
    | {
          selectedRoleId?: string;
          data: Contact & {
              profiles: Profile[];
          };
      }[]
    | [];

export type AddAppointmentModalProps = {
    appointment?: AppointmentFormState;
    selectedDate: Date;
    onSuccessCallback?: () => void;
};
