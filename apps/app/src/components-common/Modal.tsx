import { Dialog, Transition } from "@headlessui/react";
import * as React from "react";

export type ModalState = {
    open: boolean;
    onClose: () => void;
    showInnerContainer?: boolean;
};

export const Modal = (
    props: {
        children: React.ReactNode[] | React.ReactNode;
    } & ModalState
) => {
    const { open, onClose, children, showInnerContainer = true } = props;
    /////////////////////////////////////////////////////////////
    return (
        <Transition.Root show={open} as={React.Fragment}>
            <Dialog as="div" className="relative z-[1000]" onClose={onClose}>
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
                    <div className="flex min-h-full items-start justify-center text-center sm:items-center sm:p-0">
                        {showInnerContainer ? (
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative w-full transform overflow-hidden bg-white px-3 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:max-w-2xl md:rounded-lg md:px-6 ">
                                    {children}
                                </Dialog.Panel>
                            </Transition.Child>
                        ) : null}
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};
