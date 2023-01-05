import { trpc } from "utils/trpc";

export const useUser = () => {
    const { user } = trpc;
    return {
        getWorkspaces: user.getWorkspaces.useQuery,
        setDefaultWorkspace: user.setDefaultWorkspace.useMutation,
    };
};
