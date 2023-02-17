import { z } from "zod";
import { AppointmentStatus } from "@prisma/client";

export const contactOnAppointmentSchema = z.object({
    contactId: z.string(),
    selectedProfileId: z.string().optional(),
});

export const contactOnAppointmentSchemaExtended =
    contactOnAppointmentSchema.extend({
        profileName: z.string().optional(),
        name: z.string().optional(),
        contactOnAppointmentId: z.string().optional(),
    });

export const appointmentSchema = z.object({
    address: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    address_2: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    status: z.nativeEnum(AppointmentStatus).default("NO_STATUS"),
    note: z.string().optional(),
    date: z.string(),
});
export type ContactOnAppointmentSchema = z.infer<
    typeof contactOnAppointmentSchema
>;
export type ContactOnAppointmentSchemaExtended = z.infer<
    typeof contactOnAppointmentSchemaExtended
>;

export type AppointmentSchema = z.infer<typeof appointmentSchema>;

const appointmentSortFields = z
    .enum(["createdAt", "updatedAt", "date"])
    .optional();
const appointmentSortOrder = z.enum(["asc", "desc"]).optional();

export const appointmentSortSchema = z.object({
    field: appointmentSortFields,
    order: appointmentSortOrder,
});
export type AppointmentSortSchema = z.infer<typeof appointmentSortSchema>;

export const appointmentQueryParamSchema = z.object({
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

export type AppointmentQueryParamSchema = z.infer<
    typeof appointmentQueryParamSchema
>;
