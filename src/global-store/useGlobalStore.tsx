import { devtools } from "zustand/middleware";
import create from "zustand";
import { UserOnWorkspace } from "@prisma/client";

type GlobalStore = {
    userOnWorkspace: UserOnWorkspace | undefined | null;
    setUserOnWorkspace: (args: UserOnWorkspace | undefined | null) => void;
};

export const useGlobalStore = create<GlobalStore>()(
    devtools((set) => ({
        userOnWorkspace: undefined,
        setUserOnWorkspace: (userOnWorkspace) =>
            set(() => ({ userOnWorkspace })),
    }))
);
