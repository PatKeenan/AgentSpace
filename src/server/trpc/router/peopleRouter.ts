import { authedProcedure, t } from "../trpc";
import { z } from "zod";

export const peopleRouter = t.router({
    getAll: authedProcedure
        .input(
            z.object({
                workspaceId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.person.findMany({
                where: {
                    workspaceId: input.workspaceId,
                },
            });
        }),
    getOne: authedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.person.findUnique({
                where: {
                    id: input.id,
                },
            });
        }),
});
