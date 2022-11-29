import { ContactOnAppointmentRole, AppointmentStatus } from "@prisma/client";
import { dateUtils } from "utils";
import { z } from "zod";

export * from "./contact";

export const Schemas = {
    contact: contactSchema,
    appointment: appointmentSchema,
};

//Start Contact Schema

function contactSchema() {
    const meta = z.object({
        firstName: z
            .string()
            .trim()
            .min(2, "Display name must be greater than 2 characters"),
        lastName: z.string().optional(),
        phoneNumber: z.string().optional(),
        email: z.string().trim().email().optional().or(z.literal("")),
    });

    const contactBase = z.object({
        displayName: z
            .string()
            .trim()
            .min(2, "Display name must be greater than 2 characters"),
        notes: z.string().trim().optional().or(z.literal("")),
    });

    const onAppointmentCreate = z.object({
        contactId: z.string(),
        role: z.nativeEnum(ContactOnAppointmentRole),
    });

    const create = {
        contact: contactBase,
        meta: meta,
        onAppointment: onAppointmentCreate,
    };

    return { create, contactBase };
}
const createContactMeta = contactSchema().create.meta;
export type ContactBase = z.infer<typeof contactBase>;

const createContact = contactSchema().create.contact;
export type CreateContactMeta = z.infer<typeof createContactMeta>;

const contactBase = contactSchema().contactBase;
export type CreateContact = z.infer<typeof createContact>;

const createContactOnAppointment = contactSchema().create.onAppointment;
export type CreateContactOnAppointment = z.infer<
    typeof createContactOnAppointment
>;

//End Contact Schema

//Start Appointment Schema

function appointmentSchema() {
    const create = z.object({
        date: z.string().transform((i) => dateUtils.transform(i).isoDateOnly),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        address: z.string(),
        latitude: z.string().transform((i) => Number(i)),
        longitude: z.string().transform((i) => Number(i)),
        status: z.nativeEnum(AppointmentStatus).default("NO_STATUS"),
        note: z
            .string()
            .max(800, "Note must be less than 800 characters.")
            .optional(),
        assignedToId: z.string().optional(),
        deleted: z.boolean().optional().default(false),
        weight: z.number().optional(),
        contacts: z
            .array(createContactOnAppointment)
            .optional()
            .transform((i) => {
                if (!i) {
                    return [];
                }
                return i;
            }),
    });
    return {
        create,
    };
}

export const createAppointment = appointmentSchema().create;
export type CreateAppointment = z.infer<typeof createAppointment>;
