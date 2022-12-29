import {
    contactMetaSchema,
    contactSchema,
    idSchema,
    profileSchema,
} from "server/schemas";
import { authedProcedure, t } from "../trpc";
import { z } from "zod";

export const contactsRouter = t.router({
    getAll: authedProcedure
        .input(
            z.object({
                workspaceId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.contact.findMany({
                where: {
                    workspaceId: input.workspaceId,
                    deleted: false,
                },
                include: {
                    contactMeta: {
                        where: {
                            isPrimaryContact: true,
                            deleted: false,
                        },
                    },
                    _count: {
                        select: {
                            appointmentsMeta: true,
                        },
                    },
                },
            });
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
                            OR: [
                                {
                                    displayName: {
                                        contains: input.query,
                                        mode: "insensitive",
                                    },
                                },
                                {
                                    contactMeta: {
                                        some: {
                                            firstName: {
                                                contains: input.query,
                                                mode: "insensitive",
                                            },
                                            deleted: false,
                                        },
                                    },
                                },
                            ],
                        },
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
    getOne: authedProcedure
        .input(contactSchema().baseBooleans.partial().merge(idSchema))
        .query(async ({ ctx, input }) => {
            const { id, displayName = false, notes = false } = input;
            return await ctx.prisma.contact.findFirst({
                where: {
                    id: id,
                    deleted: false,
                },
                select: {
                    displayName,
                    notes,
                },
            });
        }),
    createContact: authedProcedure
        .input(
            contactSchema().create.extend({
                contactMeta: z.array(
                    contactMetaSchema().create.omit({ contactId: true })
                ),
                workspaceId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { contactMeta, ...contactData } = input;

            // Add 1 millisecond for the createdAt in ContactMeta create many function, used for sorting
            const newContactData = contactMeta.map((element, index) => {
                const now = new Date();
                now.setMilliseconds(now.getMilliseconds() + index);
                return {
                    ...element,
                    createdAt: now,
                };
            });
            const metaData: (typeof contactMeta[number] & {
                isPrimaryContact?: boolean;
            })[] = newContactData;

            if (
                metaData &&
                metaData.length >= 1 &&
                typeof metaData[0] !== "undefined"
            ) {
                metaData[0].isPrimaryContact = true;
            }

            return await ctx.prisma.contact.create({
                data: {
                    ...contactData,
                    workspaceId: input.workspaceId,
                    createdById: ctx.session.user.id,
                    contactMeta: {
                        createMany: {
                            data: [...metaData],
                        },
                    },
                },
            });
        }),
    createContactAndProfile: authedProcedure
        .input(
            contactSchema().create.extend({
                contactMeta: contactMetaSchema().create.omit({
                    contactId: true,
                }),
                profile: profileSchema()
                    .create.omit({ contactId: true, workspaceId: true })
                    .optional(),
                workspaceId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { contactMeta, profile, ...contactData } = input;

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
                    contactMeta: {
                        create: {
                            ...contactMeta,
                            isPrimaryContact: true,
                        },
                    },
                },
                include: {
                    profiles: true,
                },
            });
        }),
    update: authedProcedure
        .input(contactSchema().base.merge(idSchema))
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
            await ctx.prisma.contactMeta.updateMany({
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
            return await ctx.prisma.contactMeta.updateMany({
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
