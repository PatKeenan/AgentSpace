import { Transition } from "@headlessui/react";
import React from "react";

export const TransitionDelay = ({
    isLoading,
    children,
}: {
    isLoading?: boolean;
    delay?: number;
    children: React.ReactNode | React.ReactNode[];
}) => {
    return (
        <Transition show={!isLoading || true} appear={true}>
            <Transition.Child
                enter="transition-opacity ease-linear duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                {children}
            </Transition.Child>
        </Transition>
    );
};
