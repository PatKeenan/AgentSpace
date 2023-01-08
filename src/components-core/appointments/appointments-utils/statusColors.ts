import { AppointmentStatus } from "@prisma/client";

export const statusColors: { [Key in AppointmentStatus]: string } = {
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELED: "bg-red-100 text-red-800",
    DENIED: "bg-red-100 text-red-800",
    NO_STATUS: "bg-gray-100 text-gray-800",
    PENDING: "bg-yellow-100 text-yellow-800",
};
