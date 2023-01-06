// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { authRouter } from "./auth";
import { addressSearchRouter } from "./addressSearch";
import { workspaceRouter } from "./workspaceRouter";
import { appointmentRouter } from "./appointmentRouter";
import { subContactRouter } from "./subContactsRouter";
import { tagsRouter } from "./tagsRouter";
import { contactsRouter } from "./contactsRouter";
import { userRouter } from "./userRouter";
import { profileRouter } from "./profileRouter";

export const appRouter = t.router({
    auth: authRouter,
    addressSearch: addressSearchRouter,
    workspace: workspaceRouter,
    appointment: appointmentRouter,
    tags: tagsRouter,
    contacts: contactsRouter,
    user: userRouter,
    subContact: subContactRouter,
    profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
