import {z} from 'zod'

export const personMetaSchema = z.object({
    id: z.string(),
    primaryEmail: z.string().email(),
    secondaryEmail: z.string().email(), 
    primaryPhone: z.string(),
    secondaryPhone: z.string(),   
    personId: z.string(),     
    deleted: z.boolean(),   
    deletedAt: z.string()
})

export type ZodPersonMetaSchema = z.infer<typeof personMetaSchema>

export const personSchema = z.object({
    id: z.string(),
    name: z.string(),
    workspaceId: z.string(),
    personMeta: personMetaSchema,
})
export type ZodPersonSchema = z.infer<typeof personSchema>
