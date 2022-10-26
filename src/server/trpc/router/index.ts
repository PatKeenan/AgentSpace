// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { authRouter } from "./auth";
import { addressSearchRouter } from "./addressSearch";

export const appRouter = t.router({
    auth: authRouter,
    addressSearch: addressSearchRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
