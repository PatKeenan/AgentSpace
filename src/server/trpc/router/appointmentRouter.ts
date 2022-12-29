import { authedProcedure, t } from "../trpc";
import { z } from "zod";
import { appointmentSchema, contactOnAppointmentSchema } from "server/schemas";
import { dateUtils } from "utils/dateUtils";
import { addDays } from "date-fns";

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
                            id: true,
                            contact: {
                                select: {
                                    id: true,
                                    displayName: true,
                                },
                            },
                            profile: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: [{ startTime: "asc" }, { createdAt: "asc" }],
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
                include: {
                    contacts: {
                        select: {
                            id: true,
                            contact: {
                                select: {
                                    id: true,
                                    displayName: true,
                                },
                            },
                            profile: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
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
            appointmentSchema.extend({
                workspaceId: z.string(),
                contacts: z.array(contactOnAppointmentSchema).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { contacts, ...rest } = input;
            const contactsFormatted = contacts?.map((i) => {
                const baseData = {
                    createdById: ctx.session.user.id,
                    contactId: i.contactId,
                };
                return i?.selectedProfileId
                    ? { ...baseData, profileId: i.selectedProfileId }
                    : baseData;
            });

            return await ctx.prisma.appointment.create({
                data: {
                    ...rest,
                    workspaceId: input.workspaceId,
                    createdById: ctx.session.user.id,
                    contacts: contactsFormatted
                        ? {
                              createMany: {
                                  data: contactsFormatted,
                              },
                          }
                        : undefined,
                },
            });
        }),
    update: authedProcedure
        .input(
            appointmentSchema.extend({
                id: z.string(),
                newContacts: z.array(contactOnAppointmentSchema).optional(),
                removedContactOnAppointmentIds: z
                    .array(z.object({ id: z.string() }))
                    .optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { newContacts, removedContactOnAppointmentIds, ...rest } =
                input;

            const newContactsFormatted = newContacts?.map((i) => {
                const baseData = {
                    createdById: ctx.session.user.id,
                    contactId: i.contactId,
                };
                return i?.selectedProfileId
                    ? { ...baseData, profileId: i.selectedProfileId }
                    : baseData;
            });

            return await ctx.prisma.appointment.update({
                where: {
                    id: input.id,
                },
                data: {
                    ...rest,
                    contacts: {
                        deleteMany: removedContactOnAppointmentIds
                            ? {
                                  id: {
                                      in: removedContactOnAppointmentIds.flatMap(
                                          (i) => i.id
                                      ),
                                  },
                              }
                            : undefined,
                        createMany: newContactsFormatted
                            ? {
                                  data: newContactsFormatted,
                              }
                            : undefined,
                    },
                },
            });
        }),
});
