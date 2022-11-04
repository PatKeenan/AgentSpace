import { t, authedProcedure } from "../trpc";
import * as z from 'zod'
import { TRPCError } from "@trpc/server";

export const authRouter = t.router({
    getSession: t.procedure.query(({ ctx }) => {
        return ctx.session;
    }),
    getDefaultWorkspace: authedProcedure.query(({ctx}) => {
        return ctx.prisma.user.findUnique({
            where: {
                id: ctx.session.user.id
            },
            select: {
                id: true,
                defaultWorkspace: true,
                workspaceMeta: {
                    where: {
                        userId: ctx.session.user.id
                    }
                }
            }
        })
    }),
    setDefaultWorkspace: authedProcedure.input(z.object({
        workspaceId: z.string()
    })).mutation(async ({ctx, input}) => {
        const workspace = await ctx.prisma.userOnWorkspace.findFirst({
            where: {
                userId: ctx.session.user.id,
                workspaceId: input.workspaceId
            },
        })

        if(!workspace){
            throw new TRPCError({ code: "UNAUTHORIZED" })
        }

        return await ctx.prisma.user.update({
            where: {
                id: ctx.session.user.id
            },
            data: {
                defaultWorkspace: input.workspaceId
            },
            include: {
                workspaceMeta: {
                    where: {
                        workspaceId: input.workspaceId,
                        userId: ctx.session.user.id
                    }
                }
            }
        })
    })
});
