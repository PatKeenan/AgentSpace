import { authedProcedure, t } from "../trpc";
import { z } from "zod";


export const workspaceRouter = t.router({
    getAll: authedProcedure
        .query(async ({ ctx }) => {
            const userOnWorkspace =  await ctx.prisma.userOnWorkspace.findMany({where: {
                userId: ctx.session.user.id
            }})
            if(userOnWorkspace){
                const workspaceIds = userOnWorkspace.map(i => i.workspaceId)
                return await ctx.prisma.workspace.findMany({
                    where: {
                        id: {
                            in: workspaceIds as string[]
                        }
                    }
                })
            }
            return {
                data: []
            } 
        }),
    create: authedProcedure.input(z.object({
        title: z.string(),
    })).mutation(async ({input ,ctx}) => {
        return await ctx.prisma.workspace.create({
            data: {
                title: input.title,
                usersOnWorkspace: {
                    create: {
                        userId: ctx.session.user.id,
                        role: 'ADMIN'
                    }
                }
            }
        })
    })
  
});




