import { CheckIcon, PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components-common/Button";
import { NewInputGroup } from "components-common/NewInputGroup";
import React from "react";
import { useForm } from "react-hook-form";
import { trpc } from "utils/trpc";
import { z } from "zod";

export const BetaUsersList = () => {
    const [addUserMode, setAddUserMode] = React.useState(false);
    const { data: users } = trpc.betaUsers.getAll.useQuery();

    const { handleSubmit, register } = useForm({
        resolver: zodResolver(z.object({ email: z.string().email() })),
    });

    return (
        <div>
            <div className="mb-4 flex justify-between">
                <div>
                    <h3 className="font-bold text-gray-700">Beta Users</h3>
                    <p className="text-sm text-gray-600">
                        Grant up to 5 of your colleagues access to the
                        application by adding their email below.
                    </p>
                </div>
                {users && users?.length < 5 && (
                    <div>
                        <button
                            className="flex items-center rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700"
                            onClick={() => setAddUserMode(!addUserMode)}
                        >
                            <PlusIcon className="h-3 w-3 " aria-hidden />
                            <span className="mr-2 text-sm">Add</span>
                        </button>
                    </div>
                )}
            </div>
            {users && users.length > 0 ? (
                <div className="space-y-2">
                    {users.map((user, userIdx) => (
                        <UsersCard
                            key={user.id}
                            email={user.email}
                            id={user.id}
                            number={userIdx + 1}
                        />
                    ))}
                </div>
            ) : null}
            {addUserMode ? (
                <UsersCard onSuccess={() => setAddUserMode(false)} />
            ) : null}
        </div>
    );
};

const UsersCard = ({
    email,
    id,
    onSuccess,
    number,
}: {
    number?: number;
    email?: string;
    id?: string;
    onSuccess?: () => void;
}) => {
    const [editMode, setEditMode] = React.useState(!email && !id);
    const { mutate: create } = trpc.betaUsers.create.useMutation();
    const { mutate: update } = trpc.betaUsers.update.useMutation();
    const { mutate: deleteMutation } = trpc.betaUsers.delete.useMutation();
    const utils = trpc.useContext();

    const {
        handleSubmit,
        register,
        reset,
        setError,
        formState: { errors },
    } = useForm<{ email: string }>({
        resolver: zodResolver(z.object({ email: z.string().email() })),
        defaultValues: {
            email: email,
        },
    });

    const onSubmit = handleSubmit(async (data) => {
        if (editMode && id) {
            return update(
                { email: data.email, id },
                {
                    onError: () => {
                        setError("email", { message: "Email already exists" });
                    },
                    onSuccess: () => {
                        utils.betaUsers.getAll.invalidate();
                        setEditMode(false);
                    },
                }
            );
        }
        create(
            {
                email: data.email,
            },
            {
                onError: () => {
                    setError("email", { message: "Email already exists" });
                },
                onSuccess: () => {
                    utils.betaUsers.getAll.invalidate();
                    setEditMode(false);
                    onSuccess?.();
                },
            }
        );
    });

    const handleCancel = () => {
        setEditMode(false);
        onSuccess?.();
        reset();
    };

    const handleDelete = () => {
        if (id) {
            deleteMutation(id, {
                onSuccess: () => {
                    utils.betaUsers.getAll.invalidate();
                    setEditMode(false);
                },
            });
        }
    };
    return (
        <div>
            {editMode ? (
                <form className="flex" onSubmit={onSubmit}>
                    <NewInputGroup
                        isRequired
                        isInvalid={Boolean(errors && errors.email)}
                    >
                        <NewInputGroup.Label htmlFor="name">
                            Email
                        </NewInputGroup.Label>
                        <NewInputGroup.Input
                            className="min-w-[280px]"
                            placeholder={email}
                            {...register("email")}
                        />
                        <NewInputGroup.Error>
                            {errors && errors.email && errors.email?.message}
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
                <div className="mb-1 flex text-gray-700">
                    <div className="flex space-x-2">
                        <p>{number}. </p>
                        <p>{email}</p>
                    </div>
                    <div className="ml-auto space-x-4">
                        <button
                            type="button"
                            className="rounded-md bg-white text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            onClick={() => setEditMode(true)}
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            className="rounded-md bg-white text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            onClick={() => handleDelete()}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
