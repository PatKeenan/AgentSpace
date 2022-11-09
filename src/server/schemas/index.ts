import { z } from "zod";

export function PersonSchema() {
    const metaBase = z.object({
        firstName: z.string(),
        lastName: z.string().optional(),
        isPrimaryContact: z.boolean().default(false),
        primaryEmail: z.string().email().optional(),
        secondaryEmail: z.string().email().optional(),
        primaryPhone: z.string().optional(),
        secondaryPhone: z.string().optional(),
    });

    const personBase = z.object({
        name: z.string(),
        workspaceId: z.string(),
        referredById: z.string().optional(),
        personMeta: metaBase.optional(),
        deleted: z.boolean().optional(),
    });

    const create = {
        person: personBase,
        meta: metaBase,
    };

    return { create };
}

const createPersonMeta = PersonSchema().create.meta;
export type CreatePersonMeta = z.infer<typeof createPersonMeta>;

export const Schemas = {
    person: PersonSchema,
};
