import { useGlobalStore } from "global-store/useGlobalStore";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from "utils/trpc";

export const useActiveWorkspace = () => {
    const { activeWorkspace, setActiveWorkspace } = useGlobalStore();
    const router = useRouter();
    const { data: user, isLoading } = trpc.auth.getDefaultWorkspace.useQuery(
        undefined,
        {
            enabled: !activeWorkspace,
        }
    );

    const userDefaultWorkspace = user?.defaultWorkspace;
    React.useEffect(() => {
        //If user exists - that means there was no global state active workspace and the query was called
        if (user && user.defaultWorkspace) {
            const workspaceMeta = user.workspaceMeta.find(
                (i) => i.workspaceId == userDefaultWorkspace
            );
            setActiveWorkspace(
                workspaceMeta
                    ? {
                          id: workspaceMeta?.workspaceId,
                          role: workspaceMeta?.role,
                      }
                    : undefined
            );
            if (user && !user.defaultWorkspace && router.isReady) {
                router.push("/workspace/create");
            }
        }
    }, [setActiveWorkspace, user, userDefaultWorkspace, router]);

    return { activeWorkspace, isLoading };
};
