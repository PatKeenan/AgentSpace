import { TASK_STATUS } from "@prisma/client";
import { authedProcedure, t } from "../trpc";
import { z } from "zod";
import { TaskSingleton } from "lib";

const { taskSchemas } = TaskSingleton;

export const tasksRouter = t.router({
    getAll: authedProcedure
        .input(
            z.object({
                workspaceId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.task.findMany({
                where: {
                    workspaceId: input.workspaceId,
                    deleted: false,
                },
                orderBy: {
                    order: "asc",
                },
            });
        }),
    getOne: authedProcedure.input(z.string()).query(async ({ ctx, input }) => {
        return await ctx.prisma.task.findUnique({
            where: {
                id: input,
            },
        });
    }),
    create: authedProcedure
        .input(
            taskSchemas.createSchema.merge(
                z.object({
                    workspaceId: z.string(),
                    id: z.string(),
                })
            )
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...taskData } = input;
            return await ctx.prisma.task.create({
                data: {
                    ...taskData,
                    createdById: ctx.session.user.id,
                },
            });
        }),
    updateStatusOrOrder: authedProcedure
        .input(
            z.object({
                id: z.string(),
                status: z.nativeEnum(TASK_STATUS),
                order: z.number(),
            })
        )
        .mutation(({ ctx, input }) => {
            return ctx.prisma.task.update({
                where: {
                    id: input.id,
                },
                data: {
                    status: input.status,
                    order: input.order,
                },
            });
        }),
    update: authedProcedure
        .input(taskSchemas.updateSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.task.update({
                where: {
                    id: input.id,
                },
                data: {
                    ...input,
                },
            });
        }),
    updateManyTasks: authedProcedure
        .input(
            z.object({
                tasks: z.array(
                    z.object({
                        id: z.string(),
                        order: z.number(),
                        status: z.nativeEnum(TASK_STATUS),
                    })
                ),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await Promise.all(
                input.tasks.map((task) =>
                    ctx.prisma.task.update({
                        where: {
                            id: task.id,
                        },
                        data: {
                            order: task.order,
                            status: task.status,
                        },
                    })
                )
            );
        }),
    deleteHard: authedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.task.delete({
                where: {
                    id: input.id,
                },
            });
        }),
    deleteSoft: authedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.task.update({
                where: {
                    id: input.id,
                },
                data: {
                    deleted: true,
                },
            });
        }),
    deleteManyHard: authedProcedure
        .input(
            z.object({
                ids: z.array(z.string()),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.task.deleteMany({
                where: {
                    id: {
                        in: input.ids,
                    },
                },
            });
        }),
    deleteManySoft: authedProcedure
        .input(
            z.object({
                ids: z.array(z.string()),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.task.updateMany({
                where: {
                    id: {
                        in: input.ids,
                    },
                },
                data: {
                    deleted: true,
                },
            });
        }),
});
