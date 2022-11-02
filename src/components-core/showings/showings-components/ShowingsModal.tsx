import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { useShowingsUI } from "../useShowingsUI";
import { Fragment } from "react";

export const ShowingsModal = () => {
    const { modalOpen, setModalOpen } = useShowingsUI();
    return (
        <Transition.Root show={modalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setModalOpen}>
                <Transition.Child
                    as={Fragment}
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
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                <div>
                                    <div className="mt-3 sm:mt-5">
                                        <div>
                                            <div>
                                                <label
                                                    htmlFor="showing-title"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Showing Title
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="text"
                                                        name="showing-title"
                                                        id="showing-title"
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                        aria-describedby="showing-title"
                                                    />
                                                </div>
                                                {/* <p
                                                    className="mt-2 text-sm text-gray-500"
                                                    id="email-description"
                                                >
                                                    We'll only use this for
                                                    spam.
                                                </p> */}
                                            </div>
                                            <div className="mt-4">
                                                <label
                                                    htmlFor="date"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Date
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="date"
                                                        name="date"
                                                        id="date"
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                        aria-describedby="date"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                                        onClick={() => setModalOpen(false)}
                                    >
                                        Add Showing
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};
