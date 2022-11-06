import { Loading } from "components-common/Loading";
import { useGlobalStore } from "global-store/useGlobalStore";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import * as React from "react";
import type { NextPageExtended } from "types/index";
import { trpc } from "utils/trpc";

const Dashboard: NextPageExtended = () => {
    const router = useRouter();
    const { activeWorkspaceId, setActiveWorkspaceId } = useGlobalStore();
    const { data, isLoading } = trpc.user.getWorkspaceMeta.useQuery();

    useSession({
        required: true,
        onUnauthenticated: () => signIn(),
    });

    React.useEffect(() => {
        if (!isLoading && data && data.defaultWorkspace) {
            return setActiveWorkspaceId(data.defaultWorkspace);
        }
    }, [data, setActiveWorkspaceId, isLoading]);

    React.useEffect(() => {
        if (
            !isLoading &&
            data &&
            data.defaultWorkspace &&
            activeWorkspaceId == data.defaultWorkspace
        ) {
            router.push(`/workspace/${activeWorkspaceId}`);
        }
    }, [activeWorkspaceId, data, router, isLoading]);

    React.useEffect(() => {
        if (!isLoading && !activeWorkspaceId && !data?.defaultWorkspace) {
            router.push("/workspace/create");
        }
    }, [activeWorkspaceId, data?.defaultWorkspace, isLoading, router]);

    return isLoading && !data ? <Loading /> : null;
};
export default Dashboard;
