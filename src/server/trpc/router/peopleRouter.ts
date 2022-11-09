import { PersonSchema } from "server/schemas";
import { authedProcedure, t } from "../trpc";
import { z } from "zod";

const personSchema = PersonSchema();

export const peopleRouter = t.router({
    getAll: authedProcedure
        .input(
            z.object({
                workspaceId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.person.findMany({
                where: {
                    workspaceId: input.workspaceId,
                    deleted: false,
                },
                include: {
                    personMeta: {
                        where: {
                            isPrimaryContact: true,
                            deleted: false,
                        },
                    },
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
            return await ctx.prisma.person.findFirst({
                where: {
                    id: input.id,
                    workspaceId: input.workspaceId,
                    deleted: false,
                },
                include: {
                    personMeta: {
                        where: {
                            deleted: false,
                        },
                    },
                },
            });
        }),
    createPerson: authedProcedure
        .input(personSchema.create.person)
        .mutation(async ({ ctx, input }) => {
            const { personMeta, ...personData } = input;
            return await ctx.prisma.person.create({
                data: {
                    ...personData,
                    createdById: ctx.session.user.id,
                    personMeta: {
                        create: {
                            ...personMeta,
                        },
                    },
                },
            });
        }),
    createMeta: authedProcedure
        .input(
            personSchema.create.meta.extend({
                personId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.personMeta.create({
                data: {
                    ...input,
                },
            });
        }),
    softDelete: authedProcedure
        .input(
            z.object({
                personId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const currentDate = new Date();
            const person = await ctx.prisma.person.update({
                where: {
                    id: input.personId,
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
            await ctx.prisma.personMeta.updateMany({
                where: {
                    personId: input.personId,
                },
                data: {
                    deleted: true,
                    deletedAt: currentDate,
                },
            });
            return person;
        }),
    softDeleteMany: authedProcedure
        .input(
            z.object({
                ids: z.array(z.string()),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const currentDate = new Date();
            await ctx.prisma.person.updateMany({
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
            return await ctx.prisma.personMeta.updateMany({
                where: {
                    personId: {
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
                personId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.person.delete({
                where: {
                    id: input.personId,
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
            return await ctx.prisma.person.deleteMany({
                where: {
                    id: {
                        in: input.ids,
                    },
                },
            });
        }),
});
