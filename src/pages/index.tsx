import { Loading } from "components-common/Loading";
import { Protected } from "components-layout/Protected";
import { useGlobalStore } from "global-store/useGlobalStore";
import { useActiveWorkspace } from "hooks/useActiveWorkspace";
import { useRouter } from "next/router";
import * as React from "react";
import type { NextPageExtended } from "types/index";

const Dashboard: NextPageExtended = () => {
    const router = useRouter();
    const { activeWorkspace, isLoading } = useActiveWorkspace();

    React.useEffect(() => {
        if (activeWorkspace && router.isReady) {
            router.push(`/workspace/${activeWorkspace.id}`);
        }
    }, [activeWorkspace, router]);

    return isLoading ? (
        <Loading />
    ) : (
        <Protected>
            <></>
        </Protected>
    );
};
export default Dashboard;
