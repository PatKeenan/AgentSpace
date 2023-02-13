import * as React from "react";

import { Button } from "components-common/Button";
import { Loading } from "components-common/Loading";
import { trpc } from "utils/trpc";
import { NextLink } from "components-common/NextLink";
import { NewInputGroup } from "components-common/NewInputGroup";
import { CheckIcon, PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const SettingsGeneral = () => {
    const [editName, setEditName] = React.useState(false);

    const utils = trpc.useContext();

    const { mutate: updateName } = trpc.user.updateName.useMutation({
        onSuccess: () =>
            utils.user.getWorkspaceMeta
                .invalidate()
                .then(() => setEditName(false)),
    });
    const { data, isLoading } = trpc.user.getWorkspaceMeta.useQuery();
    const { mutate } = trpc.user.setDefaultWorkspace.useMutation();

    const handleClick = (activeWorkspaceId: string) => {
        mutate(
            { workspaceId: activeWorkspaceId },
            {
                onSuccess() {
                    utils.workspace.getDashboard.invalidate({
                        workspaceId: activeWorkspaceId,
                    });
                    utils.user.getWorkspaceMeta.invalidate();
                },
            }
        );
    };

    const nameQuery = utils.user.getUserInfo.getData();

    const {
        handleSubmit,
        reset,
        register,
        formState: { errors },
    } = useForm<{ name: string }>({
        resolver: zodResolver(
            z.object({
                name: z
                    .string()
                    .min(3, "Name must be at least 3 characters long")
                    .max(100, "Name must be less than 100 characters long"),
            })
        ),
        defaultValues: {
            name: nameQuery?.name || "",
        },
    });
    const onSubmit = handleSubmit(async (values) => {
        updateName(values);
    });

    const handleCancel = () => {
        setEditName(false);
        reset();
    };

    return !data && isLoading ? (
        <Loading />
    ) : (
        <div className="px-2">
            <div className="flex">
                <h3 className="font-bold text-gray-700">Basic Info</h3>
            </div>
            <div>
                {editName ? (
                    <form className="flex py-5" onSubmit={onSubmit}>
                        <NewInputGroup
                            isRequired
                            isInvalid={Boolean(errors && errors.name)}
                        >
                            <NewInputGroup.Label htmlFor="name">
                                Name
                            </NewInputGroup.Label>
                            <NewInputGroup.Input
                                className="min-w-[280px]"
                                placeholder={nameQuery?.name || "Name"}
                                {...register("name")}
                            />
                            <NewInputGroup.Error>
                                {errors && errors.name && errors.name?.message}
                            </NewInputGroup.Error>
                        </NewInputGroup>
                        <div className="mt-7 ml-4 space-x-2">
                            <Button variant="primary" size="sm" type="submit">
                                <CheckIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outlined"
                                size="sm"
                                onClick={handleCancel}
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">
                            Name
                        </dt>
                        <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <span className="flex-grow">{data?.name}</span>
                            <span className="ml-4 flex-shrink-0">
                                <button
                                    type="button"
                                    className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                    onClick={() => setEditName(true)}
                                >
                                    Edit
                                </button>
                            </span>
                        </dd>
                    </div>
                )}
            </div>

            <div className="mt-8 flex w-full items-center border-t pt-10">
                <div className="flex w-full items-center justify-between">
                    <h3 className="font-bold text-gray-700">Workspaces</h3>
                    <div className="ml-auto">
                        <Link passHref href="/workspace/create">
                            <a className="flex items-center rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700">
                                <PlusIcon className="h-3 w-3 " aria-hidden />
                                <span className="mr-2 text-sm ">Add</span>
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
            <ul>
                {data?.workspaceMeta.map((workspace) => (
                    <li className="mt-4 flex py-2" key={workspace.workspaceId}>
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
                        </div>
                    </li>
                ))}
            </ul>
            <div className=" mt-8 flex flex-col items-baseline">
                <h3 className="mr-4 font-bold text-gray-700">Shared with me</h3>
                <span className="mt-4 text-sm text-gray-700">
                    Coming Soon...
                </span>
            </div>
        </div>
    );
};
