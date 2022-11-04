import { authedProcedure, t } from "../trpc";
import { z } from "zod"
import { personSchema } from "server/schemas/personShema";

export const peopleRouter = t.router({
    getAll: authedProcedure.input(
        z.object({ 
            workspaceId: z.string()
        }))
        .query(async ({ctx, input}) => {
            return await ctx.prisma.person.findMany({
                where: {
                    workspaceId: input.workspaceId,   
                }
            })
        }),
    getOne: authedProcedure.input(
        z.object({
            id: z.string()
        }))
        .query(async ({ctx, input}) => {
            return await ctx.prisma.person.findUnique({where: {
                id: input.id
            }})
        }),
    create: authedProcedure.input(personSchema.omit({id: true}).partial({'personMeta': true}))
        .mutation(async ({ctx, input}) => {
            const {personMeta, ...person} = input
            return await ctx.prisma.person.create({
                data: {
                    ...person,
                    createdById: ctx.session.user.id,
                    personMeta: {
                        create: {
                            ...personMeta
                        }
                    }
                }
            })
        }),
})

