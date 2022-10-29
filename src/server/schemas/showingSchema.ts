import { context } from 'types/map-box';
import {z} from 'zod'
import { addressSchema } from './addressShema';
import { personSchema } from './personShema';

export const statusSchema = z.object({
    id: z.string(),
    status: z.enum(["confirmed", "pending", "canceled"]),
});
export type ZodStatusSchema = z.infer<typeof statusSchema>

export const showingSchema = z.object({
    address: addressSchema,
    buildingOrApt: z.string().optional(),
    clients: z.array(personSchema).optional(),
    agent: personSchema.optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    status: statusSchema.optional(),
    notes: z
        .string()
        .max(1000, "Must be less than 1,000 characters")
        .optional(),
});

export type ZodShowingSchema = z.infer<typeof showingSchema>;