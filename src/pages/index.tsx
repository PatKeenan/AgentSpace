import { Loading } from "components-common/Loading";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import * as React from "react";
import type { NextPageExtended } from "types/index";
import { trpc } from "utils/trpc";

const Dashboard: NextPageExtended = () => {
    const router = useRouter();
    const { data, isLoading } = trpc.user.getWorkspaceMeta.useQuery();

    useSession({
        required: true,
        onUnauthenticated: () => signIn(),
    });

    // If no user workspace meta, push user to the create page
    React.useEffect(() => {
        if (data && data.defaultWorkspace) {
            router.push(`/workspace/${data.defaultWorkspace}`);
        }

        if (data && data.workspaceMeta.length == 0) {
            router.push("/workspace/create");
        }
    }, [data, router, data?.defaultWorkspace]);

    return isLoading && !data ? <Loading /> : null;
};
export default Dashboard;
