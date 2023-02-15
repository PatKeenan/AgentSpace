import { NotAuthorized } from "components-core/NotAuthorized";
import { useGlobalStore } from "global-store/useGlobalStore";
import { Loading } from "components-common/Loading";
import { useWorkspace } from "hooks/useWorkspace";

import type { ChildrenPropsObj } from "types/index";

export const GatedWorkspace = (props: ChildrenPropsObj) => {
    const { children } = props;
    const { setUserOnWorkspace } = useGlobalStore();

    const workspace = useWorkspace();

    const { data, isLoading } = workspace.getUser(
        { workspaceId: workspace.id as string },
        {
            refetchInterval: 300000,
            refetchOnWindowFocus: false,
            enabled: typeof workspace.id == "string",
            onSuccess: (data) => {
                if (!data) {
                    setUserOnWorkspace(null);
                } else {
                    setUserOnWorkspace(data);
                }
            },
        }
    );

    return isLoading && !data ? (
        <Loading />
    ) : !data && !isLoading ? (
        <NotAuthorized />
    ) : (
        <>{children}</>
    );
};
