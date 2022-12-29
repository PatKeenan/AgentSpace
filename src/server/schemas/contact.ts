import { z } from "zod";

/* ------   Shared Schemas Parts   ------ */
export const idSchema = z.object({
    id: z.string(),
});

/* ------   Main Schemas   ------ */

/**
 *
 * Contact Schema
 *
 */

export const contactSchema = () => {
    const base = z.object({
        displayName: z
            .string()
            .trim()
            .min(2, errMsg("Display Name", "greater", 2)),
        notes: z.string().trim().optional().or(z.literal("")),
    });
    const baseBooleans = z.object({
        displayName: z.boolean(),
        notes: z.boolean(),
    });

    return {
        base,
        create: base,
        baseBooleans,
    };
};
const baeContact = contactSchema().base;
const createContact = contactSchema().create;
const baseContactBooleans = contactSchema().baseBooleans;

export type ContactSchema = {
    base: z.infer<typeof baeContact>;
    create: z.infer<typeof createContact>;
    baseBooleans: z.infer<typeof baseContactBooleans>;
};

/**
 *
 * Contact Schema
 *
 */

export const contactMetaSchema = () => {
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
};
const baeContactMeta = contactMetaSchema().base;
const createContactMeta = contactMetaSchema().create;
const updateContactMeta = contactMetaSchema().update;

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
