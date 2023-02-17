import { AppointmentStatus } from "@prisma/client";

export const appointmentStatusOptions = Object.keys(AppointmentStatus).map(
    (option, index) => ({
        id: `${index}`,
        value: option,
        display: option.toLowerCase().replace("_", " "),
    })
);

export type AppointmentStatusOption = (typeof appointmentStatusOptions)[number];
