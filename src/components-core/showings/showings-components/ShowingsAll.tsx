import { useGlobalStore } from "global-store/useGlobalStore";
import React from "react";
import { trpc } from "utils/trpc";

const ShowingsAll = () => {
    const { activeWorkspace } = useGlobalStore();
    const { data: showingGroups, isLoading } =
        trpc.showing.getAllGroups.useQuery(
            { workspaceId: activeWorkspace?.id as string },
            { enabled: activeWorkspace !== undefined }
        );

    return isLoading ? (
        <div>Loading...</div>
    ) : (
        <div>
            <h3>All Showings</h3>
        </div>
    );
};

export default ShowingsAll;
