import { useGlobalStore } from "global-store/useGlobalStore";
import { trpc } from "utils/trpc";
import React from "react";
import { useRouter } from "next/router";

type Children = {
    children: React.ReactNode | React.ReactNode[];
};

export const AccessControl = (props: Children) => {
    const { children } = props;
    const router = useRouter();
    const { activeWorkspace, setActiveWorkspace } = useGlobalStore();

    const { data: defaultWorkspaceQuery } =
        trpc.auth.getDefaultWorkspace.useQuery();

    const {
        data: isAllowed,
        isLoading,
        isError,
    } = trpc.workspace.checkIfAllowed.useQuery(
        { workspaceId: activeWorkspace?.id as string },
        { enabled: activeWorkspace !== undefined }
    );

    React.useEffect(() => {
        if (!isAllowed && !isLoading && !isError) {
        }
    }, [isAllowed, isError, isLoading]);

    React.useEffect(() => {
        if (!defaultWorkspaceQuery) {
            router.push("/workspace/create");
        }
    }, [defaultWorkspaceQuery, router]);

    React.useEffect(() => {
        if (!activeWorkspace && defaultWorkspaceQuery?.workspaceMeta) {
            const { defaultWorkspace } = defaultWorkspaceQuery;
            const workspace = defaultWorkspaceQuery.workspaceMeta.find(
                (i) => i.workspaceId == defaultWorkspace
            );
            setActiveWorkspace(
                workspace?.workspaceId && workspace.role
                    ? {
                          id: workspace.workspaceId,
                          role: workspace.role,
                      }
                    : undefined
            );
        }
    }, [activeWorkspace, defaultWorkspaceQuery, setActiveWorkspace]);

    return <>{children}</>;
};
