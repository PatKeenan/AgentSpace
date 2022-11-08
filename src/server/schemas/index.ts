import { z } from "zod";

export const Schemas = {};

const PersonSchema = {
    create: z.object({
        firstName: z.string(),
        lastName: z.string().optional(),
        isPrimaryContact: z.boolean().default(false),
        primaryEmail: z.string().email().optional(),
        secondaryEmail: z.string().email().optional(),
        primaryPhone: z.string().optional(),
        secondaryPhone: z.string().optional(),
    }),
};
