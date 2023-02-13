import { NextLink } from "components-common/NextLink";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

import clsx from "clsx";
import {
    EllipsisHorizontalIcon,
    EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface ItemBase {
    text: string | React.ReactNode | React.ReactNode[];
    borderT?: boolean;
    extraClasses?: string;
}

type ItemIsButton = {
    onClick: () => void;
    href?: `An href is not allowed when onClick is defined. Remove onClick or remove href.`;
} & ItemBase;

type ItemIsLink = {
    href: string;
    onClick?: `An onClick function is not allowed when href is defined. Remove onClick or remove href.`;
} & ItemBase;

type GenericToggleItem = ItemBase & (ItemIsButton | ItemIsLink);

interface ToggleMenuBaseProps<T extends GenericToggleItem[]> {
    items: T;
    buttonText?: string;
    icon?: "Vertical" | "Horizontal";
}

export function ToggleMenu<T extends GenericToggleItem[]>(
    props: ToggleMenuBaseProps<T>
) {
    const { items, icon } = props;

    return (
        <Menu as="div" className="relative ml-auto">
            <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600">
                <span className="sr-only">More</span>
                {icon && icon == "Horizontal" ? (
                    <EllipsisHorizontalIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                    />
                ) : (
                    <EllipsisVerticalIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                    />
                )}
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {items.map((item, idx) => (
                            <Menu.Item key={idx} as="div">
                                {({ active }) => {
                                    const {
                                        extraClasses,
                                        href,
                                        onClick,
                                        text,
                                    } = item;

                                    const sharedClasses = clsx(
                                        active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                        "block px-4 py-2 text-sm w-full text-left",
                                        extraClasses
                                    );

                                    return onClick &&
                                        typeof onClick !== "string" &&
                                        !href ? (
                                        <button
                                            onClick={() => onClick()}
                                            className={sharedClasses}
                                        >
                                            {text}
                                        </button>
                                    ) : href && !onClick ? (
                                        <Link href={href} passHref>
                                            <a className={sharedClasses}>
                                                {text}
                                            </a>
                                        </Link>
                                    ) : (
                                        <>{text}</>
                                    );
                                }}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
