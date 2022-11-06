import { devtools, persist } from "zustand/middleware";
import create from "zustand";

type GlobalStore = {
    activeWorkspaceId: string | undefined;
    setActiveWorkspaceId: (workspaceId: string | undefined) => void;
};

export const useGlobalStore = create<GlobalStore>()(
    persist(
        devtools((set) => ({
            activeWorkspaceId: undefined,
            setActiveWorkspaceId: (workspaceId) =>
                set(() => ({ activeWorkspaceId: workspaceId })),
        })),
        {
            name: "global-store",
        }
    )
);
