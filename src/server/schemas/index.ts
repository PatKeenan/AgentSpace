import { ContactOnShowingRole, ShowingStatus } from "@prisma/client";
import { dateUtils } from "utils";
import { z } from "zod";

export const Schemas = {
    contact: contactSchema,
    showing: showingSchema,
};

//Start Contact Schema

function contactSchema() {
    const metaBase = z.object({
        firstName: z.string(),
        lastName: z.string().optional(),
        isPrimaryContact: z.boolean().default(false),
        primaryEmail: z.string().email().optional(),
        secondaryEmail: z.string().email().optional(),
        primaryPhone: z.string().optional(),
        secondaryPhone: z.string().optional(),
    });

    const contactBase = z.object({
        name: z.string(),
        workspaceId: z.string(),
        referredById: z.string().optional(),
        contactMeta: metaBase,
        deleted: z.boolean().optional(),
    });

    const onShowingCreate = z.object({
        contactId: z.string(),
        role: z.nativeEnum(ContactOnShowingRole),
    });

    const create = {
        contact: contactBase,
        meta: metaBase,
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
