import { devtools } from "zustand/middleware";
import create from "zustand";
import { UserOnWorkspace } from "@prisma/client";

type ActiveWorkspace =
    | {
          id: string;
          role: UserOnWorkspace["role"];
      }
    | undefined;

type GlobalStore = {
    activeWorkspace: ActiveWorkspace;
    setActiveWorkspace: (workspace: ActiveWorkspace) => void;
    permittedWorkspaces: ActiveWorkspace[];
    setPermittedWorkspaces: (workspaces: ActiveWorkspace[]) => void;
};

export const useGlobalStore = create<GlobalStore>()(
    devtools((set) => ({
        activeWorkspace: undefined,
        permittedWorkspaces: [],
        setActiveWorkspace: (workspace) =>
            set(() => ({ activeWorkspace: workspace })),

        setPermittedWorkspaces: (workspaces) =>
            set(() => ({ permittedWorkspaces: workspaces })),
    }))
);
