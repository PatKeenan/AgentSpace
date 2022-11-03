import { customLocalStorage } from "utils/customLocalStorage";
import { useGlobalStore } from "global-store/useGlobalStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { Button } from "components-common/Button";
import { Input } from "components-common/Input";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import * as z from "zod";
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
    const { setActiveWorkspaceId } = useGlobalStore();

    const { mutate, isLoading } = trpc.workspace.create.useMutation({
        onSuccess(data) {
            setActiveWorkspaceId(data.id);
            customLocalStorage().setItem("activeWorkspaceId", data.id);
            router.push(`/workspace/${data.id}`);
        },
    });

    const onSubmit = handleSubmit(async (data) => {
        mutate(data);
    });

    return status == "loading" ? (
        <div>Loading...</div>
    ) : (
        <div className="h-full bg-gray-50">
            <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="mt-4 space-y-6" onSubmit={onSubmit}>
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
