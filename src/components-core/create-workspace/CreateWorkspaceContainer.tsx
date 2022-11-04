import { customLocalStorage } from "utils/customLocalStorage";
import { useGlobalStore } from "global-store/useGlobalStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Button } from "components-common/Button";
import { Input } from "components-common/Input";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import * as z from "zod";
import * as React from "react";
import clsx from "clsx";

export const CreateWorkspaceContainer = () => {
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            signIn();
        },
    });

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<{ title: string }>({
        resolver: zodResolver(
            z.object({
                title: z
                    .string()
                    .min(
                        4,
                        "Workspace title must be at least 4 characters long"
                    ),
            })
        ),
    });

    const router = useRouter();
    const { setActiveWorkspace, activeWorkspace } = useGlobalStore();
    const { data: session } = useSession();

    const { mutate, isLoading } = trpc.workspace.create.useMutation({
        onSuccess(data) {
            const workspacePermissions = data.usersOnWorkspace.find(
                (i) => i.userId == session?.user?.id
            );
            if (workspacePermissions) {
                setActiveWorkspace({
                    id: workspacePermissions.workspaceId,
                    role: workspacePermissions.role,
                });
            }
            router.push(`/workspace/${data.id}`);
        },
    });

    const onSubmit = handleSubmit(async (data) => {
        mutate(data);
    });

    const { data: workspaces, isLoading: isLoadingWorkspaces } =
        trpc.workspace.getAll.useQuery();

    const {
        mutate: setDefaultMutation,
        isLoading: isLoadingSetDefault,
        isError: setDefaultError,
    } = trpc.auth.setDefaultWorkspace.useMutation();

    const [selected, setSelected] = useState(
        workspaces?.find((i) => i.workspaceId == activeWorkspace?.id)
    );

    const handleSetAsActive = () => {
        if (selected) {
            setDefaultMutation(
                { workspaceId: selected.workspaceId },
                {
                    onSuccess: (data) => {
                        const activeWorkspaceData = data.workspaceMeta.find(
                            (i) => i.workspaceId == selected.workspaceId
                        );
                        if (activeWorkspaceData) {
                            setActiveWorkspace({
                                id: activeWorkspaceData.workspaceId,
                                role: activeWorkspaceData.role,
                            });
                            router.push(`/workspace/${activeWorkspaceData.id}`);
                        }
                    },
                    onError(error) {
                        alert(error.message);
                    },
                }
            );
        }
    };

    return status == "loading" || isLoadingWorkspaces ? (
        <div>Loading...</div>
    ) : (
        <div className="h-full bg-gray-50">
            <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        {workspaces && workspaces.length > 0 && (
                            <>
                                <h3 className="mb-3 text-center text-lg font-semibold text-gray-700">
                                    Select a Workspace
                                </h3>
                                <div className="space-y-6">
                                    <Listbox
                                        value={selected}
                                        onChange={setSelected}
                                    >
                                        {({ open }) => (
                                            <>
                                                <Listbox.Label className="sr-only block text-sm font-medium text-gray-700">
                                                    {workspaces.find(
                                                        (i) =>
                                                            i.id ==
                                                            activeWorkspace?.id
                                                    )?.workspace.title ||
                                                        "Choose a Workspace"}
                                                </Listbox.Label>
                                                <div className="relative mt-1">
                                                    <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                                        <span className="block truncate">
                                                            {selected?.workspace
                                                                .title ??
                                                                "Select Workspace"}
                                                        </span>
                                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                            <ChevronUpDownIcon
                                                                className="h-5 w-5 text-gray-400"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    </Listbox.Button>

                                                    <Transition
                                                        show={open}
                                                        as={Fragment}
                                                        leave="transition ease-in duration-100"
                                                        leaveFrom="opacity-100"
                                                        leaveTo="opacity-0"
                                                    >
                                                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                            {workspaces.map(
                                                                (workspace) => (
                                                                    <Listbox.Option
                                                                        key={
                                                                            workspace.id
                                                                        }
                                                                        className={({
                                                                            active,
                                                                        }) =>
                                                                            clsx(
                                                                                active
                                                                                    ? "bg-indigo-600 text-white"
                                                                                    : "text-gray-900",
                                                                                "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                            )
                                                                        }
                                                                        value={
                                                                            workspace
                                                                        }
                                                                    >
                                                                        {({
                                                                            selected,
                                                                            active,
                                                                        }) => (
                                                                            <>
                                                                                <span
                                                                                    className={clsx(
                                                                                        selected
                                                                                            ? "font-semibold"
                                                                                            : "font-normal",
                                                                                        "block truncate"
                                                                                    )}
                                                                                >
                                                                                    {
                                                                                        workspace
                                                                                            .workspace
                                                                                            .title
                                                                                    }
                                                                                </span>

                                                                                {selected ? (
                                                                                    <span
                                                                                        className={clsx(
                                                                                            active
                                                                                                ? "text-white"
                                                                                                : "text-indigo-600",
                                                                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                                        )}
                                                                                    >
                                                                                        <CheckIcon
                                                                                            className="h-5 w-5"
                                                                                            aria-hidden="true"
                                                                                        />
                                                                                    </span>
                                                                                ) : null}
                                                                            </>
                                                                        )}
                                                                    </Listbox.Option>
                                                                )
                                                            )}
                                                        </Listbox.Options>
                                                    </Transition>
                                                </div>
                                            </>
                                        )}
                                    </Listbox>
                                    <Button
                                        variant="primary"
                                        disabled={!selected}
                                        className={
                                            "mt-2 w-full justify-center disabled:cursor-not-allowed disabled:bg-gray-200"
                                        }
                                        onClick={() => handleSetAsActive()}
                                    >
                                        Set as Active
                                    </Button>
                                </div>
                                <p className="my-4 text-center italic text-gray-400">
                                    or
                                </p>
                            </>
                        )}
                        <h3 className="mb-3 text-center text-lg font-semibold text-gray-700">
                            Create a New Workspace
                        </h3>
                        <form className="space-y-6" onSubmit={onSubmit}>
                            <div>
                                <Input
                                    label="Workspace Name"
                                    type="text"
                                    id="title"
                                    {...register("title")}
                                />
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className={clsx(
                                        isLoading && "animate-pulse",
                                        "w-full justify-center"
                                    )}
                                >
                                    {isLoading
                                        ? "Loading..."
                                        : "Save Workspace"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
