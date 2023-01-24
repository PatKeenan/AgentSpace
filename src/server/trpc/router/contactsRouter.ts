import { idSchema, profileSchema } from "server/schemas";
import { inferRouterOutputs } from "@trpc/server";
import { authedProcedure, t } from "../trpc";
import { ContactSingleton } from "lib";
import { z } from "zod";
import { paginationSchema } from "server/schemas/pagination";
import { PROFILE_TYPES } from "@prisma/client";

const { contactSchemas, subContactSchema } = ContactSingleton;

export const contactsRouter = t.router({
    getAll: authedProcedure
        .input(
            z
                .object({
                    workspaceId: z.string(),
                })
                .merge(contactSchemas.search)
                .merge(paginationSchema)
        )
        .query(async ({ ctx, input }) => {
            const {
                workspaceId,
                searchBy,
                searchQuery,
                profileFilters,
                sortBy = "name",
                sortOrder = "asc",
                page = 0,
                take = 10,
            } = input;

            const profileFilterKeys = Object.keys(
                profileFilters
            ) as PROFILE_TYPES[];

            const activeProfileTypes = profileFilterKeys.filter(
                (key) => profileFilters[key]
            );

            return await ctx.prisma.$transaction([
                ctx.prisma.contact.findMany({
                    where: {
                        workspaceId: workspaceId,
                        deleted: false,

                        name:
                            searchBy == "name"
                                ? {
                                      contains: searchQuery,
                                  }
                                : undefined,
                        email:
                            searchBy == "email"
                                ? {
                                      contains: searchQuery,
                                  }
                                : undefined,
                        phoneNumber:
                            searchBy == "phoneNumber"
                                ? {
                                      contains: searchQuery,
                                  }
                                : undefined,
                        firstName:
                            searchBy == "firstName"
                                ? {
                                      contains: searchQuery,
                                  }
                                : undefined,
                        lastName:
                            searchBy == "lastName"
                                ? {
                                      contains: searchQuery,
                                  }
                                : undefined,
                        profiles:
                            activeProfileTypes.length > 0
                                ? {
                                      some: {
                                          type: {
                                              in: activeProfileTypes,
                                          },
                                          deleted: false,
                                      },
                                  }
                                : undefined,
                        subContacts:
                            searchBy == "subContacts"
                                ? {
                                      some: {
                                          OR: [
                                              {
                                                  firstName: {
                                                      contains: searchQuery,
                                                  },
                                                  deleted: false,
                                              },
                                              {
                                                  lastName: {
                                                      contains: searchQuery,
                                                  },
                                                  deleted: false,
                                              },
                                          ],
                                      },
                                  }
                                : undefined,
                    },
                    skip: take * (page - 1),
                    take: take,
                    include: {
                        profiles: {
                            where: {
                                deleted: false,
                            },
                            select: {
                                id: true,
                            },
                        },
                        subContacts: {
                            where: {
                                deleted: false,
                            },
                            select: {
                                firstName: true,
                            },
                        },
                        _count: {
                            select: {
                                appointmentsMeta: true,
                            },
                        },
                    },
                    orderBy:
                        sortBy == "appointmentsMeta" || sortBy == "profiles"
                            ? {
                                  [sortBy]: {
                                      _count: sortOrder,
                                  },
                              }
                            : {
                                  [sortBy]: sortOrder,
                              },
                }),
                ctx.prisma.contact.count({
                    where: {
                        workspaceId: workspaceId,
                        deleted: false,

                        name:
                            searchBy == "name"
                                ? {
                                      contains: searchQuery,
                                  }
                                : undefined,
                        email:
                            searchBy == "email"
                                ? {
                                      contains: searchQuery,
                                  }
                                : undefined,
                        phoneNumber:
                            searchBy == "phoneNumber"
                                ? {
                                      contains: searchQuery,
                                  }
                                : undefined,
                        firstName:
                            searchBy == "firstName"
                                ? {
                                      contains: searchQuery,
                                  }
                                : undefined,
                        lastName:
                            searchBy == "lastName"
                                ? {
                                      contains: searchQuery,
                                  }
                                : undefined,
                        profiles:
                            activeProfileTypes.length > 0
                                ? {
                                      some: {
                                          type: {
                                              in: activeProfileTypes,
                                          },
                                          deleted: false,
                                      },
                                  }
                                : undefined,
                        subContacts:
                            searchBy == "subContacts"
                                ? {
                                      some: {
                                          OR: [
                                              {
                                                  firstName: {
                                                      contains: searchQuery,
                                                  },
                                                  deleted: false,
                                              },
                                              {
                                                  lastName: {
                                                      contains: searchQuery,
                                                  },
                                                  deleted: false,
                                              },
                                          ],
                                      },
                                  }
                                : undefined,
                    },
                }),
            ]);
        }),
    search: authedProcedure
        .input(
            z.object({
                workspaceId: z.string(),
                query: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.contact.findMany({
                where: {
                    AND: [
                        { workspaceId: input.workspaceId },
                        {
                            name: {
                                contains: input.query,
                                mode: "insensitive",
                            },
                        },
                        { deleted: false },
                    ],
                },
                include: {
                    profiles: {
                        where: {
                            active: true,
                            deleted: false,
                        },
                    },
                },
            });
        }),
    getName: authedProcedure.input(idSchema).query(async ({ ctx, input }) => {
        const { id } = input;

        return await ctx.prisma.contact.findFirst({
            where: {
                id: id,
                deleted: false,
            },
            select: { name: true },
        });
    }),
    getOne: authedProcedure.input(idSchema).query(async ({ ctx, input }) => {
        return await ctx.prisma.contact.findFirst({
            where: {
                id: input.id,
                deleted: false,
            },

            include: {
                subContacts: {
                    where: {
                        deleted: false,
                    },
                    orderBy: [{ createdAt: "asc" }],
                },
            },
        });
    }),
    createContact: authedProcedure
        .input(
            contactSchemas.create.extend({
                subContacts: z.array(subContactSchema.create),
                workspaceId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { subContacts, ...contactData } = input;

            // Add 1 millisecond for the createdAt in ContactMeta create many function, used for sorting
            const newContactData = subContacts.map((element, index) => {
                const now = new Date();
                now.setMilliseconds(now.getMilliseconds() + index);
                return {
                    ...element,
                    createdAt: now,
                };
            });
            const metaData: typeof subContacts[number][] = newContactData;

            return await ctx.prisma.contact.create({
                data: {
                    ...contactData,
                    workspaceId: input.workspaceId,
                    createdById: ctx.session.user.id,
                    subContacts: {
                        createMany: {
                            data: [...metaData],
                        },
                    },
                },
            });
        }),
    createContactAndProfile: authedProcedure
        .input(
            contactSchemas.create.extend({
                profile: profileSchema()
                    .create.omit({ contactId: true, workspaceId: true })
                    .optional(),
                workspaceId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { profile, ...contactData } = input;

            return await ctx.prisma.contact.create({
                data: {
                    ...contactData,
                    workspaceId: input.workspaceId,
                    createdById: ctx.session.user.id,
                    profiles: {
                        create: profile
                            ? {
                                  ...profile,
                                  active: true,
                                  createdById: ctx.session.user.id,
                                  workspaceId: input.workspaceId,
                              }
                            : undefined,
                    },
                },
                include: {
                    profiles: true,
                },
            });
        }),
    update: authedProcedure
        .input(
            contactSchemas.base.partial().merge(z.object({ id: z.string() }))
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...rest } = input;
            return await ctx.prisma.contact.update({
                where: {
                    id: id,
                },
                data: {
                    ...rest,
                },
            });
        }),
    softDelete: authedProcedure
        .input(
            z.object({
                contactId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const currentDate = new Date();
            const contact = await ctx.prisma.contact.update({
                where: {
                    id: input.contactId,
                },
                data: {
                    deleted: true,
                    deletedAt: currentDate,
                },
                select: {
                    workspaceId: true,
                    id: true,
                },
            });
            await ctx.prisma.subContact.updateMany({
                where: {
                    contactId: input.contactId,
                },
                data: {
                    deleted: true,
                    deletedAt: currentDate,
                },
            });
            return contact;
        }),
    softDeleteMany: authedProcedure
        .input(
            z.object({
                ids: z.array(z.string()),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const currentDate = new Date();
            await ctx.prisma.contact.updateMany({
                where: {
                    id: {
                        in: input.ids,
                    },
                },
                data: {
                    deleted: true,
                    deletedAt: currentDate,
                },
            });
            return await ctx.prisma.subContact.updateMany({
                where: {
                    contactId: {
                        in: input.ids,
                    },
                },
                data: {
                    deleted: true,
                    deletedAt: currentDate,
                },
            });
        }),
    hardDelete: authedProcedure
        .input(
            z.object({
                contactId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.contact.delete({
                where: {
                    id: input.contactId,
                },
            });
        }),
    hardDeleteMany: authedProcedure
        .input(
            z.object({
                ids: z.array(z.string()),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.contact.deleteMany({
                where: {
                    id: {
                        in: input.ids,
                    },
                },
            });
        }),
});

export type ContactsRouterOutlet = inferRouterOutputs<typeof contactsRouter>;
