import { useGlobalStore } from "global-store/useGlobalStore";
import React from "react";
import { trpc } from "utils/trpc";

export const useActiveWorkspace = () => {
    const { activeWorkspace, setActiveWorkspace } = useGlobalStore();
    const { data: user, isLoading } = trpc.auth.getDefaultWorkspace.useQuery(
        undefined,
        { enabled: !activeWorkspace }
    );
    React.useEffect(() => {
        if (
            !activeWorkspace &&
            user &&
            user.workspaceMeta.find(
                (i) =>
                    i.workspaceId == user.defaultWorkspace &&
                    i.userId == user.id
            )
        ) {
            const workspace = user.workspaceMeta.find(
                (i) =>
                    i.workspaceId == user.defaultWorkspace &&
                    i.userId == user.id
            );

            setActiveWorkspace(
                workspace?.workspaceId && workspace.role
                    ? { id: workspace.workspaceId, role: workspace.role }
                    : undefined
            );
        }
    }, [activeWorkspace, setActiveWorkspace, user]);

    return { isLoading, activeWorkspace };
};
