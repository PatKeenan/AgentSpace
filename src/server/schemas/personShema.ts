import { z } from "zod";

export const personMetaSchema = z.object({
    id: z.string(),
    primaryEmail: z.string().email(),
    secondaryEmail: z.string().email(),
    primaryPhone: z.string(),
    secondaryPhone: z.string(),
    personId: z.string(),
    deleted: z.boolean(),
    deletedAt: z.string(),
});

export const createPersonMetaSchema = z.object({
    firstName: z.string(),
    lastName: z.string().optional(),
    isPrimaryContact: z.boolean().default(false),
    primaryEmail: z.string().email().optional(),
    secondaryEmail: z.string().email().optional(),
    primaryPhone: z.string().optional(),
    secondaryPhone: z.string().optional(),
});

export type CreatePersonMetaSchema = z.infer<typeof createPersonMetaSchema>;

export const createPersonSchema = z.object({
    name: z.string(),
    workspaceId: z.string(),
    personMeta: z.array(createPersonMetaSchema).optional(),
});
export type CreatePersonSchema = z.infer<typeof createPersonSchema>;
