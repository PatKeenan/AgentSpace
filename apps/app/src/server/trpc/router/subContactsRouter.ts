import { subContactSchema } from "server/schemas";
import { authedProcedure, t } from "../trpc";
import { z } from "zod";

export const subContactRouter = t.router({
    getAllForContact: authedProcedure
        .input(z.object({ contactId: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.subContact.findMany({
                where: {
                    contactId: input.contactId,
                    deleted: false,
                },
                orderBy: [{ createdAt: "asc" }],
            });
        }),
    create: authedProcedure
        .input(subContactSchema().create)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.subContact.create({
                data: {
                    ...input,
                },
            });
        }),
    update: authedProcedure
        .input(subContactSchema().update)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.subContact.update({
                where: {
                    id: input.id,
                },
                data: {
                    ...input,
                },
            });
        }),

    softDelete: authedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.subContact.update({
                where: {
                    id: input.id,
                },
                data: {
                    deleted: true,
                    deletedAt: new Date(),
                },
            });
        }),
});
