import { authedProcedure, t } from "../trpc";
import { z } from "zod";
import { Schemas } from "server/schemas";
import { dateUtils } from "utils/dateUtils";
import { addDays } from "date-fns";

const showingSchema = Schemas.showing();

export const showingsRouter = t.router({
    getAll: authedProcedure
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
    getByMonth: authedProcedure
        .input(
            z.object({
                workspaceId: z.string(),
                date: z
                    .string()
                    .transform((i) => dateUtils.transform(i).isoDateOnly),
            })
        )
        .query(async ({ ctx, input }) => {
            const month = dateUtils.getMonth(new Date(input.date));
            return await ctx.prisma.showing.findMany({
                where: {
                    workspaceId: input.workspaceId,
                    deleted: false,
                    date: {
                        gte: dateUtils.transform(addDays(month.firstDay, -1))
                            .isoDateOnly,
                        lte: dateUtils.transform(month.lastDay).isoDateOnly,
                    },
                },
                include: {
                    contacts: {
                        select: {
                            role: true,
                            contact: {
                                select: {
                                    id: true,
                                    displayName: true,
                                },
                            },
                        },
                    },
                },
            });
        }),
    getByDate: authedProcedure
        .input(
            z.object({
                workspaceId: z.string(),
                date: z
                    .string()
                    .transform((i) => dateUtils.transform(i).isoDateOnly),
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
            const { contacts, date, ...rest } = input;
            return await ctx.prisma.showing.create({
                data: {
                    ...rest,
                    createdById: ctx.session.user.id,
                    date: date,
                    contacts: {
                        createMany: {
                            data: contacts,
                        },
                    },
                },
            });
        }),
});
