import { context } from 'types/map-box';
import {z} from 'zod'

export const addressSchema = z.object({
    address_id: z.string(),
    address: z.string(),
    place_name: z.string(),
    context: z.array(context),
    cords: z.object({ lat: z.number(), long: z.number() }),
});
export type ZodAddressSchema = z.infer<typeof addressSchema>