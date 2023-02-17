import { z } from "zod";

export const paginationSchema = z.object({
    take: z.number().min(0).max(100).optional(),
    page: z.number().optional(),
});
