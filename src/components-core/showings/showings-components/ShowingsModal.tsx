import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWorkspace } from "hooks/useWorkspace";
import { useShowingsUI } from "../useShowingsUI";
import { Input } from "components-common/Input";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import * as React from "react";
import * as z from "zod";

export const ShowingsModal = () => {
    const { modalOpen, setModalOpen } = useShowingsUI();

    const { handleSubmit, register } = useForm<{ title: string; date: string }>(
        {
            resolver: zodResolver(
                z.object({
                    title: z.string(),
                    date: z.string(),
                })
            ),
        }
    );

    const workspace = useWorkspace();

    /*  const { mutate, isLoading } = trpc.showing.createGroup.useMutation({
        onSuccess(data) {
            router.push(`/workspace/${data.workspaceId}/showings/${data.id}`);
            utils.showing.getAllGroups.invalidate({
                workspaceId: data.workspaceId,
            });
        },
    }); */

    const onSubmit = handleSubmit(async (data) => {
        if (workspace.id) {
            /*  mutate({ ...data, workspaceId: workspace.id }); */
            setModalOpen(false);
        }
    });

    return (
        <Transition.Root show={modalOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setModalOpen}>
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                <form
                                    name="create-showing-form"
                                    id="create-showing-form"
                                    onSubmit={onSubmit}
                                >
                                    <div className="mt-3 sm:mt-5">
                                        <div>
                                            <div>
                                                <Input
                                                    type="text"
                                                    label="Showing Title"
                                                    id="showing-title"
                                                    {...register("title")}
                                                />
                                            </div>
                                            <div className="mt-3">
                                                <Input
                                                    type="date"
                                                    label="Date"
                                                    id="showing-date"
                                                    {...register("date")}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-6">
                                        <button
                                            type="submit"
                                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                                        >
                                            {/* {isLoading
                                                ? "Loading..."
                                                : "Add Showing"} */}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};
