import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { authedProcedure, t } from "../trpc";

export const userRouter = t.router({
    getWorkspaceMeta: authedProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.user.findUnique({
            where: {
                id: ctx.session.user.id,
            },
            select: {
                workspaceMeta: {
                    include: {
                        workspace: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
                },
                defaultWorkspace: true,
            },
        });
    }),
    setDefaultWorkspace: authedProcedure
        .input(
            z.object({
                workspaceId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const workspace = await ctx.prisma.userOnWorkspace.findFirst({
                where: {
                    userId: ctx.session.user.id,
                    workspaceId: input.workspaceId,
                },
            });

            if (!workspace) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            return await ctx.prisma.user.update({
                where: {
                    id: ctx.session.user.id,
                },
                data: {
                    defaultWorkspace: input.workspaceId,
                },
                include: {
                    workspaceMeta: {
                        where: {
                            workspaceId: input.workspaceId,
                            userId: ctx.session.user.id,
                        },
                    },
                },
            });
        }),
});
