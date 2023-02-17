import { t } from "../trpc";

export const authRouter = t.router({
    getSession: t.procedure.query(({ ctx }) => {
        return ctx.session;
    }),
});

export type AuthRouter = typeof authRouter;
