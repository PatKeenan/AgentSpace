import {z} from 'zod'

export const personSchema = z.object({
    id: z.string(),
    name: z.string().min(2, "Must be at least two characters."),
});
export type ZodPersonSchema = z.infer<typeof personSchema>