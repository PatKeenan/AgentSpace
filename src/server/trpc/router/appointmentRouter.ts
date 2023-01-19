import { AppointmentSingleton } from "lib/AppointmentSingleton";
import { idSchema } from "server/schemas";
import type { inferRouterOutputs } from "@trpc/server";
import { AppointmentStatus } from "@prisma/client";
import { authedProcedure, t } from "../trpc";
import { z } from "zod";
import { paginationSchema } from "server/schemas/pagination";

const { appointmentSchemas } = AppointmentSingleton;

export const appointmentRouter = t.router({
    getAll: authedProcedure
        .input(
            z
                .object({
                    workspaceId: z.string(),
                })
                .merge(appointmentSchemas.search)
                .merge(paginationSchema)
        )
        .query(async ({ ctx, input }) => {
            const {
                searchBy,
                searchQuery,
                statusFilters,
                sortBy = "createdAt",
                sortOrder = "desc",
                workspaceId,
                page = 0,
                take = 10,
            } = input;

            const statusFilterKeys = Object.keys(
                statusFilters
            ) as AppointmentStatus[];

            const activeStatusFilters = statusFilterKeys.filter(
                (key) => statusFilters[key]
            );

            return await ctx.prisma.$transaction([
                ctx.prisma.appointment.findMany({
                    where: {
                        workspaceId: workspaceId,
                        deleted: false,
                        address:
                            searchBy == "address" && searchQuery
                                ? { contains: searchQuery, mode: "insensitive" }
                                : undefined,
                        contacts:
                            searchBy == "contacts" && searchQuery
                                ? {
                                      some: {
                                          contact: {
                                              name: {
                                                  contains: searchQuery,
                                                  mode: "insensitive",
                                              },

                                              deleted: false,
                                          },
                                      },
                                  }
                                : undefined,
                        status:
                            activeStatusFilters.length > 0
                                ? {
                                      in: activeStatusFilters,
                                  }
                                : undefined,
                    },

                    skip: take * (page - 1),
                    take: take,
                    include: {
                        contacts: {
                            where: {
                                contact: {
                                    deleted: false,
                                },
                                deleted: false,
                            },
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

                    orderBy: { [sortBy]: sortOrder },
                }),
                ctx.prisma.appointment.count({
                    where: {
                        workspaceId: workspaceId,
                        deleted: false,
                        address:
                            searchBy == "address" && searchQuery
                                ? { contains: searchQuery, mode: "insensitive" }
                                : undefined,
                        contacts:
                            searchBy == "contacts" && searchQuery
                                ? {
                                      some: {
                                          contact: {
                                              name: {
                                                  contains: searchQuery,
                                                  mode: "insensitive",
                                              },

                                              deleted: false,
                                          },
                                      },
                                  }
                                : undefined,
                        status:
                            activeStatusFilters.length > 0
                                ? {
                                      in: activeStatusFilters,
                                  }
                                : undefined,
                    },
                }),
            ]);
        }),
    getAllForContact: authedProcedure
        .input(
            z
                .object({ contactId: z.string(), take: z.number().optional() })
                .merge(appointmentSchemas.sort)
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
            appointmentSchemas.create.extend({
                workspaceId: z.string(),
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
            appointmentSchemas.update.omit({ contacts: true }).extend({
                id: z.string(),
                newContacts: z
                    .array(
                        appointmentSchemas.extendedContactOnAppointmentSchema
                    )
                    .optional(),
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
    // Used mostly for status
    quickUpdate: authedProcedure
        .input(
            appointmentSchemas.update
                .omit({ contacts: true })
                .partial()
                .merge(idSchema)
        )
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

export type AppointmentRouterOutput = inferRouterOutputs<
    typeof appointmentRouter
>;
