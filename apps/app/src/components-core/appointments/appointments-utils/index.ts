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

export const statusDisplay = (status?: AppointmentStatus) =>
    statusOptions.find((a) => a.value == status)?.display;

export const statusColorsLight: { [Key in AppointmentStatus]: string } = {
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELED: "bg-red-100 text-red-800",
    DENIED: "bg-red-100 text-red-800",
    NO_STATUS: "bg-gray-100 text-gray-800",
    PENDING: "bg-yellow-100 text-yellow-800",
};
export const statusColorsDark: { [Key in AppointmentStatus]: string } = {
    CONFIRMED: "bg-green-400 text-green-900",
    CANCELED: "bg-red-400 text-red-900",
    DENIED: "bg-red-400 text-red-900",
    NO_STATUS: "bg-gray-400 text-gray-900",
    PENDING: "bg-yellow-400 text-yellow-900",
};
