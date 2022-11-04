import { authedProcedure, t } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { UserOnWorkspace } from "@prisma/client";


export const workspaceRouter = t.router({
    getAll: authedProcedure
        .query(async ({ ctx }) => {
            return await ctx.prisma.userOnWorkspace.findMany({
                where: {
                   userId: ctx.session.user.id
            },
            include: {
                workspace: {
                    select: {
                        id: true,
                        title: true
                    }
                }
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
            },
            include: {
                usersOnWorkspace: {
                    where: {
                        userId: ctx.session.user.id,
                    }
                }
            }
        })
       
    }),
    checkIfAllowed: authedProcedure.input(z.object({
        workspaceId: z.string()
    })).query(async ({ctx, input}) => {
        const workspaceUsers =  await ctx.prisma.userOnWorkspace.findFirst({
            where: {
                userId: ctx.session.user.id,
                workspaceId: input.workspaceId
            }
        })
        if(!workspaceUsers){
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return true
    })
});




