import clsx from "clsx";
import { Button, ButtonLink } from "components-common/Button";
import { useGlobalStore } from "global-store/useGlobalStore";
import { trpc } from "utils/trpc";

const SettingsWorkspaces = () => {
    const { data } = trpc.workspace.getAll.useQuery();
    const { activeWorkspace } = useGlobalStore();

    const { mutate } = trpc.auth.setDefaultWorkspace.useMutation();

    const handleClick = (activeWorkspaceId: string) => {
        mutate({ workspaceId: activeWorkspaceId });
    };

    return (
        <div>
            <div className="flex items-center">
                <div className="flex items-center">
                    <h3 className="ml-2 font-bold text-gray-700">Workspaces</h3>
                    <span
                        className={clsx(
                            true
                                ? "bg-indigo-100 text-indigo-600"
                                : "bg-gray-100 text-gray-900",
                            "ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block"
                        )}
                    >
                        {data && data.length}
                    </span>
                </div>

                <ButtonLink
                    href="/workspace/create"
                    variant="primary"
                    className="ml-auto"
                >
                    Add Workspace
                </ButtonLink>
            </div>
            <ul>
                {data?.map((workspace) => (
                    <li
                        className="mt-4 flex py-2 px-2"
                        key={workspace.workspaceId}
                    >
                        <p
                            className="mr-2 text-gray-700"
                            key={workspace.workspaceId}
                        >
                            {workspace.workspace.title}
                        </p>

                        {workspace.workspaceId == activeWorkspace?.id ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                active
                            </span>
                        ) : null}
                        <div className="ml-auto space-x-4">
                            {workspace.workspaceId !== activeWorkspace?.id && (
                                <Button
                                    variant="text"
                                    onClick={() =>
                                        handleClick(workspace.workspaceId)
                                    }
                                >
                                    Set as Active
                                </Button>
                            )}
                            <Button variant="text">Edit</Button>
                        </div>
                    </li>
                ))}
            </ul>

            <h3 className="ml-2 mt-8 font-bold text-gray-700">
                Shared with me
            </h3>
        </div>
    );
};

export default SettingsWorkspaces;
