import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWorkspace, usePeople } from "hooks";
import { usePeopleUI } from "../usePeopleUI";

import { Input } from "components-common/Input";
import { useForm } from "react-hook-form";
import * as React from "react";
import * as z from "zod";
import { CreatePerson, Schemas } from "server/schemas";

export const PeopleModal = () => {
    const { modalOpen, setModalOpen } = usePeopleUI();
    const workspace = useWorkspace();
    const people = usePeople();

    const personSchema = Schemas.person();

    const {
        mutate: createPerson,
        isLoading: loadingCreatePerson,
        isError: errorCreatingPerson,
    } = people.createPerson();

    const { register, handleSubmit } = useForm<
        Omit<CreatePerson, "workspaceId">
    >({
        resolver: zodResolver(
            personSchema.create.person.omit({ workspaceId: true })
        ),
    });

    const onSubmit = handleSubmit(async (data) => {
        if (workspace.id) {
            const { personMeta, ...rest } = data;
            const person: CreatePerson = {
                ...rest,
                workspaceId: workspace.id as string,
                personMeta: {
                    ...personMeta,
                    isPrimaryContact: true,
                },
            };
            createPerson(person, {
                onSuccess: (data) => {
                    people.invalidateGetAll({ workspaceId: data.workspaceId });
                    setModalOpen(false);
                },
            });
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
                                    name="create-person-form"
                                    id="create-person-form"
                                    onSubmit={onSubmit}
                                >
                                    <div className="mt-3 sm:mt-5">
                                        <div>
                                            <div>
                                                <Input
                                                    required
                                                    type="text"
                                                    label="Display Name"
                                                    id="person-name"
                                                    {...register("name")}
                                                />
                                            </div>
                                            <div className="mt-3 flex items-center space-x-2 ">
                                                <div>
                                                    <Input
                                                        required
                                                        autoComplete="off"
                                                        type="text"
                                                        label="First"
                                                        id="person-first-name"
                                                        {...register(
                                                            "personMeta.firstName"
                                                        )}
                                                    />
                                                </div>
                                                <div>
                                                    <Input
                                                        autoComplete="off"
                                                        type="text"
                                                        label="Last"
                                                        id="person-last-name"
                                                        {...register(
                                                            "personMeta.lastName"
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-3">
                                                <Input
                                                    autoComplete="off"
                                                    type="email"
                                                    label="Email"
                                                    id="person-primary-email"
                                                    {...register(
                                                        "personMeta.primaryEmail"
                                                    )}
                                                />
                                            </div>
                                            <div className="mt-3">
                                                <Input
                                                    autoComplete="off"
                                                    type="tel"
                                                    label="Phone"
                                                    id="person-primary-phone"
                                                    {...register(
                                                        "personMeta.primaryPhone"
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-6">
                                        <button
                                            type="submit"
                                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                                        >
                                            Save Person
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
