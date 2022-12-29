import { z } from "zod";
import { AppointmentStatus } from "@prisma/client";

export const contactOnAppointmentSchema = z.object({
    contactId: z.string(),
    selectedProfileId: z.string().optional(),
});
export const contactOnAppointmentSchemaExtended =
    contactOnAppointmentSchema.extend({
        profileName: z.string().optional(),
        displayName: z.string().optional(),
    });

export const appointmentSchema = z.object({
    address: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    address_2: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    status: z.nativeEnum(AppointmentStatus).default("NO_STATUS"),
    notes: z.string().optional(),
    date: z.string(),
});
export type ContactOnAppointmentSchema = z.infer<
    typeof contactOnAppointmentSchema
>;
export type ContactOnAppointmentSchemaExtended = z.infer<
    typeof contactOnAppointmentSchemaExtended
>;
export type AppointmentSchema = z.infer<typeof appointmentSchema>;
