import { AppointmentStatus } from "@prisma/client";

export const statusOptions = Object.keys(AppointmentStatus).map(
    (option, index) => ({
        id: `${index}`,
        value: option,
        display: option.toLowerCase().replace("_", " "),
    })
);

export function isEmpty(arr: unknown[] | undefined) {
    if (!arr || typeof arr == "undefined") return true;
    if (arr.length == 0) return true;
    return false;
}

export * from "./useSelectedDate";
