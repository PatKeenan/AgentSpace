import { idSchema, profileSchema } from "server/schemas";
import { authedProcedure, t } from "../trpc";
import * as z from "zod";

export const profileRouter = t.router({
    getOne: authedProcedure.input(idSchema).query(async ({ ctx, input }) => {
        return await ctx.prisma.profile.findUnique({
            where: {
                id: input.id,
            },
        });
    }),
    getManyForContact: authedProcedure
        .input(
            z.object({
                contactId: z.string(),
                take: z.number().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { take = 5, contactId } = input;
            return await ctx.prisma.profile.findMany({
                where: {
                    contactId: contactId,
                    deleted: false,
                },
                include: {
                    appointments: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: 5,
                    },
                    _count: {
                        select: {
                            appointments: true,
                        },
                    },
                },
                orderBy: [{ active: "desc" }, { createdAt: "desc" }],
                take: take,
            });
        }),
    create: authedProcedure
        .input(profileSchema().create)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.profile.create({
                data: {
                    ...input,
                    createdById: ctx.session.user.id,
                },
            });
        }),
    update: authedProcedure
        .input(profileSchema().update)
        .mutation(async ({ ctx, input }) => {
            const { id, ...rest } = input;
            return await ctx.prisma.profile.update({
                where: {
                    id: input.id,
                },
                data: {
                    ...rest,
                },
            });
        }),
});
