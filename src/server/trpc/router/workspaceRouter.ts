import { authedProcedure, t } from "../trpc";
import { z } from "zod";


export const workspaceRouter = t.router({
    getAll: authedProcedure
        .query(async ({ ctx }) => {
            return await ctx.prisma.userOnWorkspace.findMany({
                where: {
                    userId: ctx.session.user.id
            },
            include: {
                workspace: true,        
        }
    })
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




