import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Button, ButtonLink, Input, Loading } from "components-common";
import { Listbox, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useWorkspace, useUser } from "hooks";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import * as React from "react";
import * as z from "zod";
import clsx from "clsx";

import type { UserOnWorkspace } from "@prisma/client";

export const CreateWorkspaceContainer = () => {
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            signIn();
        },
    });

    const router = useRouter();
    const workspace = useWorkspace();
    const user = useUser();

    const { mutate: createWorkspace, isLoading: loadingCreation } =
        workspace.create({
            onSuccess(data) {
                setDefaultWorkspace(
                    { workspaceId: data.id },
                    {
                        onSuccess: () => router.push(`/workspace/${data.id}`),
                    }
                );
            },
        });

    const { data: workspaces, isLoading: loadingWorkspaces } =
        user.getWorkspaces();

    const [selected, setSelected] = React.useState<
        | (UserOnWorkspace & {
              workspace: {
                  id: string;
                  title: string;
              };
          })
        | undefined
    >();

    const handleClick = () => {
        if (selected) router.push(`/workspace/${selected.workspaceId}`);
    };

    const { handleSubmit, register } = useForm<{ title: string }>({
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

    const onSubmit = handleSubmit(async (data) => {
        createWorkspace(data);
    });

    const { mutate: setDefaultWorkspace } = user.setDefaultWorkspace();

    return status == "loading" || loadingWorkspaces ? (
        <Loading />
    ) : (
        <div className="h-full bg-gray-50">
            <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        {workspaces && workspaces.length > 0 && (
                            <>
                                <h3 className="mb-3 text-center text-lg font-semibold text-gray-700">
                                    Select Workspace
                                </h3>
                                <div className="space-y-6">
                                    <Listbox
                                        value={selected}
                                        onChange={setSelected}
                                    >
                                        {({ open }) => (
                                            <>
                                                <Listbox.Label className="sr-only block text-sm font-medium text-gray-700">
                                                    Choose a Workspace
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
                                                        as={React.Fragment}
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
                                        onClick={() => handleClick()}
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
                            Create New Workspace
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
                                        loadingCreation && "animate-pulse",
                                        "w-full justify-center"
                                    )}
                                >
                                    {loadingCreation
                                        ? "Loading..."
                                        : "Save Workspace"}
                                </Button>
                            </div>
                        </form>
                    </div>
                    {workspaces && workspaces.length > 0 && (
                        <ButtonLink variant="text" href="/" className="mt-4">
                            Cancel
                        </ButtonLink>
                    )}
                </div>
            </div>
        </div>
    );
};
