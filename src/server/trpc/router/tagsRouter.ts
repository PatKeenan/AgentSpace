import { authedProcedure, t } from "../trpc";
import { z } from "zod"
import { personSchema } from "server/schemas/personShema";

export const tagsRouter = t.router({
    getAll: authedProcedure.input(
        z.object({ 
            workspaceId: z.string()
        }))
        .query(async ({ctx, input}) => {
            return await ctx.prisma.tag.findMany({
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
            return await ctx.prisma.tag.findUnique({where: {
                id: input.id
            }})
        }),
})

