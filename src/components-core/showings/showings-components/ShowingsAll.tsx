import { useGlobalStore } from "global-store/useGlobalStore";
import { trpc } from "utils/trpc";

const ShowingsAll = () => {
    const { activeWorkspaceId } = useGlobalStore();
    const { isLoading } = trpc.showing.getAllGroups.useQuery(
        { workspaceId: activeWorkspaceId as string },
        { enabled: typeof activeWorkspaceId == "string" }
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
