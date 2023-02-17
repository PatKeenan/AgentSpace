import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export function Accordion({
    label,
    children,
    description,
    className,
    toggleContainer,
    defaultOpen,
    titleContainer,
}: {
    label: string;
    description?: string;
    className?: string;
    flag?: React.ReactNode | React.ReactNode[];
    children: React.ReactNode | React.ReactNode[];
    toggleContainer?: React.ReactNode | React.ReactNode[];
    titleContainer?: React.ReactNode | React.ReactNode[];
    defaultOpen?: boolean;
}) {
    return (
        <div className={clsx(className)}>
            <Disclosure
                defaultOpen={defaultOpen}
                as="div"
                className={clsx("text-left")}
            >
                {({ open }) => (
                    <>
                        <div className="flex items-center space-x-4">
                            <Disclosure.Button className="flex w-full items-center justify-between text-left text-base font-medium text-gray-900  focus:outline-none focus-visible:ring focus-visible:ring-indigo-500  focus-visible:ring-opacity-75 sm:text-sm sm:text-gray-700">
                                <div>
                                    <div className="flex items-center space-x-4">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                                            {label}
                                        </h3>
                                        {titleContainer}
                                    </div>

                                    {description ? (
                                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                            {description}
                                        </p>
                                    ) : null}
                                </div>
                                <ChevronUpIcon
                                    className={`${
                                        open ? "rotate-180 transform" : ""
                                    } h-5 w-5 text-gray-500`}
                                />
                            </Disclosure.Button>
                            {toggleContainer}
                        </div>
                        <Transition>
                            <Disclosure.Panel className="pt-4 pb-2 text-sm">
                                {children}
                            </Disclosure.Panel>
                        </Transition>
                    </>
                )}
            </Disclosure>
        </div>
    );
}
