import { useRouter } from "next/router";
import React from "react";
import { trpc } from "utils/trpc";

type UseWorkspaceIdProps = {
    handleWorkspaceNotFound?: () => unknown;
    handleForbidden?: () => unknown;
};

export const useWorkspace = (opts: UseWorkspaceIdProps) => {
    const router = useRouter();
    const {
        handleForbidden = () => router.push("/unauthorized"),
        handleWorkspaceNotFound = () => router.push("/404"),
    } = opts;

    const [isForbidden, setIsForbidden] = React.useState(false);
    const [workspaceNotFound, setWorkspaceNotFound] = React.useState(false);

    const workspaceId = router.query.workspaceId as string | undefined;

    const { data, isLoading, isError } =
        trpc.workspace.getWorkspaceMeta.useQuery(
            { workspaceId: workspaceId as string },
            { enabled: typeof workspaceId == "string" }
        );
    React.useEffect(() => {
        if (!data && !isLoading) {
            setWorkspaceNotFound(true);
            handleWorkspaceNotFound();
        }

        if (data && data.usersOnWorkspace.length == 0) {
            setIsForbidden(true);
            handleForbidden();
        }
    }, [data, handleForbidden, isLoading, handleWorkspaceNotFound, router]);

    return {
        workspaceId,
        isLoading,
        isForbidden,
        isError,
        workspaceNotFound,
    };
};
