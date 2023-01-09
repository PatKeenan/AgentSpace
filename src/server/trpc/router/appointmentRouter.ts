import { authedProcedure, t } from "../trpc";
import type { inferRouterOutputs } from "@trpc/server";
import { z } from "zod";
import {
    appointmentSchema,
    contactOnAppointmentSchema,
    idSchema,
} from "server/schemas";
import { appointmentSortSchema } from "components-core/contactDetail";

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
                include: {
                    contacts: {
                        select: {
                            id: true,
                            contact: {
                                select: {
                                    id: true,
                                    name: true,
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

                orderBy: { createdAt: "desc" },
            });
        }),
    getAllForContact: authedProcedure
        .input(
            z
                .object({ contactId: z.string(), take: z.number().optional() })
                .merge(appointmentSortSchema)
        )
        .query(async ({ ctx, input }) => {
            const { order = "desc", field = "createdAt" } = input;
            return await ctx.prisma.contactOnAppointment.findMany({
                where: {
                    contactId: input.contactId,
                    deleted: false,
                },
                include: {
                    appointment: {
                        include: {
                            contacts: {
                                select: {
                                    id: true,
                                    contact: {
                                        select: {
                                            id: true,
                                            name: true,
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
                    },
                },
                orderBy: {
                    appointment: {
                        [field]: order,
                    },
                },
                take: input.take,
            });
        }),
    getIndicators: authedProcedure
        .input(
            z.object({
                workspaceId: z.string(),
                date: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.appointment.findMany({
                where: {
                    workspaceId: input.workspaceId,
                    deleted: false,
                    date: {
                        startsWith: input.date,
                    },
                },
                select: {
                    date: true,
                },
            });
        }),
    getByDate: authedProcedure
        .input(
            z.object({
                workspaceId: z.string(),
                date: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.appointment.findMany({
                where: {
                    workspaceId: input.workspaceId,
                    deleted: false,
                    date: {
                        startsWith: input.date.slice(0, 10), // <- year and month YYYY-MM-DD
                    },
                },
                include: {
                    contacts: {
                        select: {
                            id: true,
                            contact: {
                                select: {
                                    id: true,
                                    name: true,
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

                orderBy: [{ startTime: "asc" }, { createdAt: "desc" }],
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
    quickUpdate: authedProcedure
        .input(appointmentSchema.partial().merge(idSchema))
        .mutation(async ({ ctx, input }) => {
            const { id, ...rest } = input;
            return await ctx.prisma.appointment.update({
                where: {
                    id: id,
                },
                data: { ...rest },
            });
        }),
    deleteSoft: authedProcedure
        .input(z.object({ appointmentId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.appointment.update({
                where: {
                    id: input.appointmentId,
                },
                data: {
                    deleted: true,
                    deletedAt: new Date(),
                },
            });
        }),
    deleteHard: authedProcedure
        .input(z.object({ appointmentId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.appointment.delete({
                where: {
                    id: input.appointmentId,
                },
            });
        }),
});

type AppointmentRouter = typeof appointmentRouter;
export type AppointmentRouterOutput = inferRouterOutputs<AppointmentRouter>;
