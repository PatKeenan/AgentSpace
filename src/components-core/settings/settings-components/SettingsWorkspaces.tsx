import { Button, ButtonLink } from "components-common/Button";
import { Loading } from "components-common/Loading";
import { trpc } from "utils/trpc";
import Link from "next/link";
import clsx from "clsx";
import { NextLink } from "components-common/NextLink";

const SettingsWorkspaces = () => {
    const { data, isLoading } = trpc.user.getWorkspaceMeta.useQuery();
    const { mutate } = trpc.user.setDefaultWorkspace.useMutation();
    const utils = trpc.useContext();

    const handleClick = (activeWorkspaceId: string) => {
        mutate(
            { workspaceId: activeWorkspaceId },
            {
                onSuccess() {
                    utils.user.getWorkspaceMeta.invalidate();
                },
            }
        );
    };

    return !data && isLoading ? (
        <Loading />
    ) : (
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
                        {data && data.workspaceMeta.length}
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
                {data?.workspaceMeta.map((workspace) => (
                    <li
                        className="mt-4 flex py-2 px-2"
                        key={workspace.workspaceId}
                    >
                        <div className="group flex items-center hover:cursor-pointer">
                            <NextLink
                                href={`/workspace/${workspace.workspaceId}`}
                            >
                                <span className="mr-2 text-gray-700 group-hover:text-purple-700 group-hover:underline">
                                    {workspace.workspace.title}
                                </span>
                            </NextLink>

                            {workspace.workspaceId == data.defaultWorkspace ? (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                    default
                                </span>
                            ) : null}
                        </div>

                        <div className="ml-auto space-x-4">
                            {workspace.workspaceId !==
                                data.defaultWorkspace && (
                                <Button
                                    variant="text"
                                    onClick={() =>
                                        handleClick(workspace.workspaceId)
                                    }
                                >
                                    Set as Default
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
