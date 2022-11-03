import { devtools } from "zustand/middleware";
import create from "zustand";

type GlobalStore = {
    activeWorkspaceId: string;
    setActiveWorkspaceId: (workspaceId: string) => void;
};

export const useGlobalStore = create<GlobalStore>()(
    devtools((set) => ({
        activeWorkspaceId: "",
        setActiveWorkspaceId: (id: string) =>
            set(() => ({ activeWorkspaceId: id })),
    }))
);
