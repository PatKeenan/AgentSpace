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

    // If no user workspace meta, push user to the create page
    React.useEffect(() => {
        if (data && data.defaultWorkspace) {
            setActiveWorkspaceId(data.defaultWorkspace);
            router.push(`/workspace/${data.defaultWorkspace}`);
        }

        if (data && data.workspaceMeta.length == 0) {
            setActiveWorkspaceId(undefined);
            router.push("/workspace/create");
        }
    }, [activeWorkspaceId, data, router, setActiveWorkspaceId]);

    return isLoading && !data ? <Loading /> : null;
};
export default Dashboard;
