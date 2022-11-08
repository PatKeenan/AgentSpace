import { ShowingStatus } from "@prisma/client";
import { z } from "zod";
import { addressSchema } from "./addressShema";

import { tagSchema } from "./tagSchema";

export const statusSchema = z.object({
    id: z.string(),
    status: z.enum(["confirmed", "pending", "canceled"]),
});
export type ZodStatusSchema = z.infer<typeof statusSchema>;

export const createShowingSchema = z.object({
    workspaceId: z.string(),
    status: z.nativeEnum(ShowingStatus).default("PENDING"),
});

/* export type ZodShowingSchema = z.infer<typeof showingSchema>;

 */
