import { authedProcedure, t } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const showingsRouter = t.router({
    getAllGroups: authedProcedure
        .input(
            z.object({
                workspaceId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const workspaceUsers = await ctx.prisma.workspace.findUnique({
                where: {
                    id: input.workspaceId,
                },
                select: {
                    usersOnWorkspace: {
                        where: {
                            userId: ctx.session.user.id,
                        },
                    },
                },
            });
            if (workspaceUsers && workspaceUsers.usersOnWorkspace.length) {
                return await ctx.prisma.showingGroup.findMany({
                    where: {
                        workspaceId: input.workspaceId,
                        deleted: false,
                    },
                    include: {
                        showings: {
                            select: {
                                id: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });
            }
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }),
    getAllByWorkspace: authedProcedure
        .input(
            z.object({
                workspaceId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.showing.findMany({
                where: {
                    workspaceId: input.workspaceId,
                    deleted: false,
                },
            });
        }),
    getAllByGroup: authedProcedure
        .input(
            z.object({
                showingGroupId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.showingGroup.findUnique({
                where: {
                    id: input.showingGroupId,
                },
                include: {
                    showings: {
                        where: {
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
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.showing.findUnique({
                where: {
                    id: input.id,
                },
            });
        }),
    createGroup: authedProcedure
        .input(
            z.object({
                title: z.string(),
                workspaceId: z.string(),
                date: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { date, workspaceId, ...rest } = input;
            const dateFormatted = new Date(date);
            return await ctx.prisma.showingGroup.create({
                data: {
                    ...rest,
                    date: dateFormatted,
                    workspace: {
                        connect: {
                            id: workspaceId,
                        },
                    },
                    createdBy: {
                        connect: {
                            id: ctx.session.user.id,
                        },
                    },
                },
            });
        }),
});
