import { authedProcedure, t } from "../trpc";
import { z } from "zod";

export const showingsRouter = t.router({
    getShowings: authedProcedure
        .input(
            z.object({
                workspaceId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.showing.findMany({
                where: {
                    workspaceId: input.workspaceId,
                    deleted: false,
                },
            });
        }),
    getShowing: authedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.showing.findUnique({
                where: {
                    id: input.id,
                },
            });
        }),
});
