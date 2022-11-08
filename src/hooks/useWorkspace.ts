import { useRouter } from "next/router";
import { trpc } from "utils/trpc";

export function useWorkspace() {
    const router = useRouter();

    // Id can only be used when /workspace/<workspaceId> exists in the path
    const id = router.query.workspaceId;
    const { workspace } = trpc;

    return {
        id,
        getAll: workspace.getAll.useQuery,
        getUsers: workspace.getUsers.useQuery,
        getUser: workspace.getUser.useQuery,
        create: workspace.create.useMutation,
    };
}
