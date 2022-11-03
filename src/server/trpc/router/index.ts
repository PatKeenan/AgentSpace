// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { authRouter } from "./auth";
import { addressSearchRouter } from "./addressSearch";
import { workspaceRouter } from "./workspaceRouter";

export const appRouter = t.router({
    auth: authRouter,
    addressSearch: addressSearchRouter,
    workspace: workspaceRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
