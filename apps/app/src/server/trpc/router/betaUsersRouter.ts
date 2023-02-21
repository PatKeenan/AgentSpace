import { authedProcedure, t } from "../trpc";
import { z } from "zod";

export const betaUsersRouter = t.router({
    getAll: authedProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.betaUsers.findMany({
            where: {
                addedBy_id: ctx.session.user.id,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
    }),
    create: authedProcedure
        .input(z.object({ email: z.string().email() }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.betaUsers.create({
                data: {
                    email: input.email,
                    addedBy_id: ctx.session.user.id,
                },
            });
        }),
    update: authedProcedure
        .input(z.object({ email: z.string().email(), id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.betaUsers.update({
                where: {
                    id: input.id,
                },
                data: {
                    email: input.email,
                },
            });
        }),
    delete: authedProcedure
        .input(z.string())
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.betaUsers.delete({
                where: {
                    id: input,
                },
            });
        }),
});
