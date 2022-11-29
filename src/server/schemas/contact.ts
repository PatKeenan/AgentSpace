import { ContactOnAppointmentRole, AppointmentStatus } from "@prisma/client";
import { dateUtils } from "utils";
import { z } from "zod";

/* ------   Shared Schemas Parts   ------ */
const idSchema = z.object({
    id: z.string(),
});

const workspaceId = z.object({
    workspaceId: z.string(),
});

/* ------   Main Schemas   ------ */

/**
 *
 * Contact Schema
 *
 */

export function ContactSchema() {
    const base = z.object({
        displayName: z
            .string()
            .trim()
            .min(2, errMsg("Display Name", "greater", 2)),
        notes: z.string().trim().optional().or(z.literal("")),
    });

    return {
        base,
        create: base,
    };
}
const baeContact = ContactSchema().base;
const createContact = ContactSchema().create;

export type ContactSchema = {
    base: z.infer<typeof baeContact>;
    create: z.infer<typeof createContact>;
};

/**
 *
 * Contact Schema
 *
 */

export function ContactMetaSchema() {
    const base = z
        .object({
            firstName: z
                .string()
                .trim()
                .min(2, errMsg("First Name", "greater", 2)),
            lastName: z.string().optional(),
            phoneNumber: z.string().trim().optional(),
            email: z.string().trim().email().optional().or(z.literal("")),
            contactId: z.string(),
        })
        .merge(idSchema);

    const create = base.omit({ id: true });

    return { base, create, update: base };
}
const baeContactMeta = ContactMetaSchema().base;
const createContactMeta = ContactMetaSchema().create;
const updateContactMeta = ContactMetaSchema().update;

export type ContactMetaSchema = {
    base: z.infer<typeof baeContactMeta>;
    create: z.infer<typeof createContactMeta>;
    update: z.infer<typeof updateContactMeta>;
};

/* ------   Utilities   ------ */

function errMsg(
    fieldName: string,
    option: "greater" | "less",
    value: number | string
) {
    return `${fieldName} must be ${option} than ${value} characters.`;
}
