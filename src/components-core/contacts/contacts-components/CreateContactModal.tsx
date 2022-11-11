import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWorkspace, useContacts } from "hooks";
import { useContactsUI } from "../useContactsUI";
import { Input } from "components-common/Input";
import { useForm } from "react-hook-form";
import * as React from "react";
import { Button } from "components-common/Button";
import { CreateContact, Schemas } from "server/schemas";

export const CreateContactModal = () => {
    const { modalOpen, setModalOpen } = useContactsUI();
    const workspace = useWorkspace();
    const contacts = useContacts();

    const contactsSchema = Schemas.contact();

    const createContact = contacts.createContact();

    const { register, handleSubmit, reset } = useForm<
        Omit<CreateContact, "workspaceId">
    >({
        resolver: zodResolver(
            contactsSchema.create.contact.omit({ workspaceId: true })
        ),
    });

    const onSubmit = handleSubmit(async (data) => {
        if (workspace.id) {
            const { contactMeta, ...rest } = data;
            const contact: CreateContact = {
                ...rest,
                workspaceId: workspace.id as string,
                contactMeta: {
                    ...contactMeta,
                    isPrimaryContact: true,
                },
            };
            createContact.mutate(contact, {
                onSuccess: (data) => {
                    contacts.invalidateGetAll({
                        workspaceId: data.workspaceId,
                    });
                    setModalOpen(false);
                },
            });
        }
    });

    React.useEffect(() => {
        // 🧹🧹🧹 Cleanup on close 😎
        return () => {
            if (!modalOpen) reset();
        };
    }, [modalOpen, reset]);

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
                                    name="create-contact-form"
                                    id="create-contact-form"
                                    onSubmit={onSubmit}
                                >
                                    <div className="mt-3 sm:mt-5">
                                        <div>
                                            <div>
                                                <Input
                                                    autoFocus
                                                    required
                                                    type="text"
                                                    label="Display Name"
                                                    id="contact-name"
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
                                                        id="contact-first-name"
                                                        {...register(
                                                            "contactMeta.firstName"
                                                        )}
                                                    />
                                                </div>
                                                <div>
                                                    <Input
                                                        autoComplete="off"
                                                        type="text"
                                                        label="Last"
                                                        id="contact-last-name"
                                                        {...register(
                                                            "contactMeta.lastName"
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-3">
                                                <Input
                                                    autoComplete="off"
                                                    type="email"
                                                    label="Email"
                                                    id="contact-primary-email"
                                                    {...register(
                                                        "contactMeta.primaryEmail"
                                                    )}
                                                />
                                            </div>
                                            <div className="mt-3">
                                                <Input
                                                    autoComplete="off"
                                                    type="tel"
                                                    label="Phone"
                                                    id="contact-primary-phone"
                                                    {...register(
                                                        "contactMeta.primaryPhone"
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-6">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            className="w-full justify-center"
                                        >
                                            {createContact.isLoading
                                                ? "Saving..."
                                                : "Save Contact"}
                                        </Button>
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
