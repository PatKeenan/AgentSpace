import { z } from "zod"
import { personSchema } from "server/schemas/personShema";

export const tagSchema = z.object({
    id: z.string(),
    title: z.string(),
    people: z.array(personSchema).optional(),
    deleted: z.boolean().optional(),
    deletedAt: z.string().optional()
})