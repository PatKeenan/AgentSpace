import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { authedProcedure, t } from "../trpc";

export const userRouter = t.router({
    getUserInfo: authedProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.user.findUnique({
            where: {
                id: ctx.session.user.id,
            },
            select: {
                name: true,
            },
        });
    }),
    getWorkspaces: authedProcedure.query(async ({ ctx }) => {
        return ctx.prisma.userOnWorkspace.findMany({
            where: {
                userId: ctx.session.user.id,
                locked: false,
            },
            include: {
                workspace: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
    }),
    getWorkspaceMeta: authedProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.user.findUnique({
            where: {
                id: ctx.session.user.id,
            },
            select: {
                name: true,
                email: true,
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
    updateName: authedProcedure
        .input(z.object({ name: z.string().min(2) }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.user.update({
                where: {
                    id: ctx.session.user.id,
                },
                data: {
                    name: input.name,
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
