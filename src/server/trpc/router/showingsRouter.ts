import { authedProcedure, t } from "../trpc";
import { z } from "zod";
import { Schemas } from "server/schemas";

const showingSchema = Schemas.showing();

export const showingsRouter = t.router({
    getByDate: authedProcedure
        .input(
            z.object({
                workspaceId: z.string(),
                date: z.date().refine((i) => i.toISOString()),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.showing.findMany({
                where: {
                    workspaceId: input.workspaceId,
                    deleted: false,
                    date: {
                        equals: input.date,
                    },
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
    create: authedProcedure
        .input(
            showingSchema.create.extend({
                workspaceId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { contacts, ...rest } = input;
            return await ctx.prisma.showing.create({
                data: {
                    ...rest,
                    createdById: ctx.session.user.id,
                    contact: {
                        createMany: {
                            data: contacts,
                        },
                    },
                },
            });
        }),
});
