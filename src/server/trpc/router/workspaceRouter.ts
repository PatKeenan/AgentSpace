import { dateUtils } from "utils/dateUtils";
import { authedProcedure, t } from "../trpc";
import { z } from "zod";

export const workspaceRouter = t.router({
    getAll: authedProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.userOnWorkspace.findMany({
            where: {
                userId: ctx.session.user.id,
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
    getUser: authedProcedure
        .input(
            z.object({
                workspaceId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.userOnWorkspace.findUnique({
                where: {
                    userId_workspaceId: {
                        userId: ctx.session.user.id,
                        workspaceId: input.workspaceId,
                    },
                },
            });
        }),
    getUsers: authedProcedure
        .input(
            z.object({
                workspaceId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.workspace.findUnique({
                where: {
                    id: input.workspaceId,
                },
                select: {
                    usersOnWorkspace: true,
                },
            });
        }),
    getDashboard: authedProcedure
        .input(
            z.object({
                workspaceId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.workspace.findUnique({
                where: {
                    id: input.workspaceId,
                },
                select: {
                    tasks: {
                        where: {
                            deleted: false,
                            status: {
                                notIn: ["DONE", "ARCHIVED"],
                            },
                        },
                        select: {
                            id: true,
                            task: true,
                            status: true,
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: 2,
                    },
                    appointments: {
                        where: {
                            deleted: false,
                            date: {
                                gte: dateUtils.transform(new Date())
                                    .isoDateOnly,
                            },
                        },
                        select: {
                            date: true,
                            id: true,
                            address: true,
                            status: true,
                        },
                        take: 2,
                        orderBy: {
                            date: "desc",
                        },
                    },
                    title: true,

                    _count: {
                        select: {
                            appointments: true,
                            contacts: true,
                            tasks: true,
                        },
                    },
                },
            });
        }),
    create: authedProcedure
        .input(
            z.object({
                title: z.string(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            return await ctx.prisma.workspace.create({
                data: {
                    title: input.title,
                    usersOnWorkspace: {
                        create: {
                            userId: ctx.session.user.id,
                            role: "ADMIN",
                        },
                    },
                },
                include: {
                    usersOnWorkspace: {
                        where: {
                            userId: ctx.session.user.id,
                        },
                    },
                },
            });
        }),
});
