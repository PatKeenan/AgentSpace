// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { authRouter } from "./auth";
import { addressSearchRouter } from "./addressSearch";
import { workspaceRouter } from "./workspaceRouter";
import { showingsRouter } from "./showingsRouter";
import { tagsRouter } from "./tagsRouter";
import { contactsRouter } from "./contactsRouter";
import { userRouter } from "./userRouter";

export const appRouter = t.router({
    auth: authRouter,
    addressSearch: addressSearchRouter,
    workspace: workspaceRouter,
    showing: showingsRouter,
    tags: tagsRouter,
    contacts: contactsRouter,
    user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
