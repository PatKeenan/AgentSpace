import { z } from "zod";

import { PROFILE_TYPES } from "@prisma/client";

export const profileSchema = () => {
    const create = z.object({
        workspaceId: z.string(),
        contactId: z.string(),
        name: z
            .string()
            .min(4, "Name must be at least 4 characters long")
            .max(100, "Name must be less than 100 characters"),
        active: z.boolean().optional().default(true),
        notes: z.string().optional(),
        type: z.nativeEnum(PROFILE_TYPES),
    });
    const update = create
        .pick({
            name: true,
            active: true,
            notes: true,
            type: true,
        })
        .partial()
        .extend({
            id: z.string().min(1),
            deleted: z.boolean().optional(),
        });
    return {
        create,
        update,
    };
};

const createSchema = profileSchema().create;
const updateSchema = profileSchema().update;

export type ProfileSchema = {
    create: z.infer<typeof createSchema>;
    update: z.infer<typeof updateSchema>;
};
