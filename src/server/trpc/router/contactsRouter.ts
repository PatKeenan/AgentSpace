import { Schemas } from "server/schemas";
import { authedProcedure, t } from "../trpc";
import { boolean, z } from "zod";
import { exists } from "utils/helpers";
import { ContactMeta } from "@prisma/client";

const contactSchema = Schemas.contact();

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
                                        startsWith: input.query,
                                        mode: "insensitive",
                                    },
                                },
                                {
                                    contactMeta: {
                                        some: {
                                            firstName: {
                                                startsWith: input.query,
                                                mode: "insensitive",
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            });
        }),
    getOne: authedProcedure
        .input(
            z.object({
                id: z.string(),
                workspaceId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.contact.findFirst({
                where: {
                    id: input.id,
                    workspaceId: input.workspaceId,
                    deleted: false,
                },
                include: {
                    contactMeta: {
                        where: {
                            deleted: false,
                        },
                    },
                },
            });
        }),
    createContact: authedProcedure
        .input(
            contactSchema.create.contact.extend({
                contactMeta: z.array(contactSchema.create.meta),
                workspaceId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { contactMeta, ...contactData } = input;

            const metaData: (typeof contactMeta[number] & {
                isPrimaryContact?: boolean;
            })[] = contactMeta;
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
    createMeta: authedProcedure
        .input(
            contactSchema.create.meta.extend({
                contactId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.contactMeta.create({
                data: {
                    ...input,
                },
            });
        }),
    updateMeta: authedProcedure
        .input(
            contactSchema.create.meta.extend({
                contactId: z.string(),
                id: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.contactMeta.update({
                where: {
                    id: input.contactId,
                },
                data: {
                    ...input,
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
