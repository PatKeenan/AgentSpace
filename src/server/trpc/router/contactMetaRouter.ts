import { ContactMetaSchema } from "server/schemas";
import { authedProcedure, t } from "../trpc";
import { z } from "zod";

export const contactMetaRouter = t.router({
    getAllForContact: authedProcedure
        .input(z.object({ contactId: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.contactMeta.findMany({
                where: {
                    contactId: input.contactId,
                    deleted: false,
                },
                orderBy: [{ isPrimaryContact: "desc" }, { createdAt: "asc" }],
            });
        }),
    create: authedProcedure
        .input(ContactMetaSchema().create)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.contactMeta.create({
                data: {
                    ...input,
                },
            });
        }),
    update: authedProcedure
        .input(ContactMetaSchema().update)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.contactMeta.update({
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
            return ctx.prisma.contactMeta.update({
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
