import { AppointmentStatus } from "@prisma/client";
import { z } from "zod";

export type AppointmentSingletonType = {
    appointmentStatusOptions: typeof appointmentStatusOptions;
    appointmentFormFields: typeof formFields;
    appointmentSchemas: {
        base: z.infer<typeof baseAppointmentSchema>;
        create: z.infer<typeof createAppointmentSchema>;
        update: z.infer<typeof updateAppointmentSchema>;
        extendedContactOnAppointmentSchema: z.infer<
            typeof extendedContactOnAppointmentSchema
        >;
        sort: z.infer<typeof appointmentSortSchema>;
        search: z.infer<typeof appointmentSearchSchema>;
    };
};

const appointmentStatusOptions: {
    id: string;
    value: AppointmentStatus;
    display: string;
}[] = Object.keys(AppointmentStatus).map((key, index) => ({
    id: String(index),
    value: key as AppointmentStatus,
    display: key.toLowerCase().replace("_", " "),
}));

function errMsg(
    fieldName: keyof typeof formFields,
    option: "greater" | "less",
    value: number | string
) {
    return `${formFields[fieldName].label} must be ${option} than ${value} characters.`;
}

// Ensures consistent naming across the app
const formFields = {
    date: { name: "date", label: "Date" },
    address: { name: "address", label: "Address" },
    address_2: { name: "address_2", label: "Build/Apt" },
    contacts: { name: "contacts", label: "Contacts" },
    startTime: { name: "startTime", label: "Start Time" },
    endTime: { name: "endTime", label: "End Time" },
    status: { name: "status", label: "Status" },
    note: { name: "note", label: "Notes" },
} as const;

// Schemas

const contactOnAppointmentObj = {
    contactId: z.string(),
    selectedProfileId: z.string().optional(),
} as const;

const contactOnAppointmentObjExtended = {
    ...contactOnAppointmentObj,
    profileName: z.string(),
    name: z.string(),
    contactOnAppointmentId: z.string(),
} as const;

const extendedContactOnAppointmentSchema = z
    .object(contactOnAppointmentObjExtended)
    .partial({
        selectedProfileId: true,
        profileName: true,
        name: true,
        contactOnAppointmentId: true,
    });

const appointmentObj = {
    date: z.string(),
    address: z.string().max(200, errMsg("address", "less", 200)),
    address_2: z.string().max(50, errMsg("address_2", "less", 50)),
    latitude: z.number(),
    longitude: z.number(),
    startTime: z.string().max(5, errMsg("startTime", "less", 5)),
    endTime: z.string().max(5, errMsg("endTime", "less", 5)),
    status: z.nativeEnum(AppointmentStatus).default("NO_STATUS"),
    note: z.string().max(2000, errMsg("note", "less", 2000)),
    contacts: z.array(z.object(contactOnAppointmentObj)),
} as const;

const baseAppointmentSchema = z.object(appointmentObj);
const createAppointmentSchema = z.object(appointmentObj).partial({
    address_2: true,
    latitude: true,
    longitude: true,
    startTime: true,
    endTime: true,
    status: true,
    note: true,
    contacts: true,
});

const updateAppointmentSchema = z.object(appointmentObj).partial();

//Used for searching and sorting
const appointmentSortFields = z
    .enum(["createdAt", "updatedAt", "date"])
    .optional();
const appointmentSortOrder = z.enum(["asc", "desc"]).optional();

const appointmentSortSchema = z.object({
    field: appointmentSortFields,
    order: appointmentSortOrder,
});

const appointmentSearchSchema = z.object({
    searchBy: z.enum(["address", "contacts"]),
    searchQuery: z.string().optional(),
    statusFilters: z.object({
        NO_STATUS: z.boolean(),
        PENDING: z.boolean(),
        CONFIRMED: z.boolean(),
        CANCELED: z.boolean(),
        DENIED: z.boolean(),
    }),
    sortBy: appointmentSortFields,
    sortOrder: appointmentSortOrder,
});

// -------- Main Export --------//

export const AppointmentSingleton = {
    appointmentStatusOptions,
    appointmentFormFields: formFields,
    appointmentSchemas: {
        base: baseAppointmentSchema,
        create: createAppointmentSchema,
        update: updateAppointmentSchema,
        extendedContactOnAppointmentSchema,
        sort: appointmentSortSchema,
        search: appointmentSearchSchema,
    },
};

Object.freeze(AppointmentSingleton);
