import { useGlobalStore } from "global-store/useGlobalStore";
import { trpc } from "utils/trpc";

const ShowingsAll = () => {
    const { activeWorkspace } = useGlobalStore();
    const { data, isLoading } = trpc.showing.getAllGroups.useQuery(
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
