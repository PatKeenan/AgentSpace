import { authedProcedure, t } from "../trpc";
import { z } from "zod";
import { Schemas } from "server/schemas";
import { dateUtils } from "utils/dateUtils";
import { addDays } from "date-fns";

const appointmentSchema = Schemas.appointment();

export const appointmentRouter = t.router({
    getAll: authedProcedure
        .input(
            z.object({
                workspaceId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.appointment.findMany({
                where: {
                    workspaceId: input.workspaceId,
                    deleted: false,
                },
            });
        }),
    getAllForContact: authedProcedure
        .input(z.object({ contactId: z.string(), take: z.number().optional() }))
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.contactOnAppointment.findMany({
                where: {
                    contactId: input.contactId,
                    deleted: false,
                },
                include: {
                    appointment: true,
                },
                orderBy: {
                    appointment: {
                        date: "desc",
                    },
                },
                take: input.take,
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
            return await ctx.prisma.appointment.findMany({
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
            return await ctx.prisma.appointment.findMany({
                where: {
                    workspaceId: input.workspaceId,
                    deleted: false,
                    date: {
                        equals: input.date,
                    },
                },
            });
        }),
    getAppointment: authedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.appointment.findUnique({
                where: {
                    id: input.id,
                },
            });
        }),
    create: authedProcedure
        .input(
            appointmentSchema.create.extend({
                workspaceId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { contacts, date, ...rest } = input;
            return await ctx.prisma.appointment.create({
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
