import { ContactOnShowingRole, ShowingStatus } from "@prisma/client";
import { dateUtils } from "utils";
import { z } from "zod";

export const Schemas = {
    contact: contactSchema,
    showing: showingSchema,
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

    const onShowingCreate = z.object({
        contactId: z.string(),
        role: z.nativeEnum(ContactOnShowingRole),
    });

    const create = {
        contact: contactBase,
        meta: meta,
        onShowing: onShowingCreate,
    };

    return { create, contactBase };
}
const createContactMeta = contactSchema().create.meta;
export type ContactBase = z.infer<typeof contactBase>;

const createContact = contactSchema().create.contact;
export type CreateContactMeta = z.infer<typeof createContactMeta>;

const contactBase = contactSchema().contactBase;
export type CreateContact = z.infer<typeof createContact>;

const createContactOnShowing = contactSchema().create.onShowing;
export type CreateContactOnShowing = z.infer<typeof createContactOnShowing>;

//End Contact Schema

//Start Showing Schema

function showingSchema() {
    const create = z.object({
        date: z.string().transform((i) => dateUtils.transform(i).isoDateOnly),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        address: z.string(),
        latitude: z.string().transform((i) => Number(i)),
        longitude: z.string().transform((i) => Number(i)),
        status: z.nativeEnum(ShowingStatus).default("NO_STATUS"),
        note: z
            .string()
            .max(800, "Note must be less than 800 characters.")
            .optional(),
        assignedToId: z.string().optional(),
        deleted: z.boolean().optional().default(false),
        weight: z.number().optional(),
        contacts: z
            .array(createContactOnShowing)
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

export const createShowing = showingSchema().create;
export type CreateShowing = z.infer<typeof createShowing>;
