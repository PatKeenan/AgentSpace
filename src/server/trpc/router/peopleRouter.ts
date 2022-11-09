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
                    personMeta: true,
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
});
