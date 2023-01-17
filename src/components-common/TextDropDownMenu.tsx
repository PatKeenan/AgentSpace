import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment, SVGProps } from "react";
import { NextLink } from "./NextLink";

type OptionBase = {
    icon?: (
        props: SVGProps<SVGSVGElement> & {
            title?: string | undefined;
            titleId?: string | undefined;
        }
    ) => JSX.Element;
    iconPosition?: "right" | "left";
    current?: boolean;
} & Record<string, any>;

type OptionWithLink = {
    href: string;
    onClick?: never;
} & OptionBase;

type OptionWithButton = {
    href?: never;
    onClick?: () => void;
} & OptionBase;

type TextDropDownProps<T, K> = {
    options: T[];
    displayField: K;
    title: string;
    menuPosition?: "right" | "left";
    onOptionClick?: (option?: T) => void;
};

export function TextDropDownMenu<
    T extends OptionWithButton | OptionWithLink,
    K extends keyof T
>(props: TextDropDownProps<T, K>) {
    const {
        options,
        displayField,
        title,
        menuPosition = "right",
        onOptionClick,
    } = props;
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium capitalize text-gray-600 hover:text-gray-800">
                    {title}
                    <ChevronDownIcon
                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                    />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    className={clsx(
                        menuPosition == "right"
                            ? "left-0 origin-top-left"
                            : "right-0 origin-top-right",
                        "absolute z-10 mt-2 w-40 rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
                    )}
                >
                    <div className="py-1">
                        {options.map((option, optionIdx) => (
                            <Menu.Item key={`${option.id || optionIdx}`}>
                                {({ active }) => {
                                    return option.href ? (
                                        <NextLink
                                            href={option.href}
                                            className={clsx(
                                                option.current
                                                    ? "font-medium text-gray-900"
                                                    : "text-gray-500",
                                                active && "bg-gray-100",
                                                "block px-4 py-2 text-sm"
                                            )}
                                        >
                                            <div className="flex items-center">
                                                {option.icon &&
                                                    (!option.iconPosition ||
                                                        option.iconPosition ==
                                                            "left") && (
                                                        <option.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                                                    )}
                                                <span>
                                                    {option[displayField]}
                                                </span>
                                                {(option.icon &&
                                                    !option.iconPosition) ||
                                                    (option.icon &&
                                                        option.iconPosition ==
                                                            "right" && (
                                                            <option.icon className="ml-2 h-4 w-4 flex-shrink-0 " />
                                                        ))}
                                            </div>
                                        </NextLink>
                                    ) : (
                                        <button
                                            className={clsx(
                                                option.current
                                                    ? "font-medium text-gray-900"
                                                    : "text-gray-500",
                                                active && "bg-gray-100",
                                                "block w-full px-4 py-2 text-sm"
                                            )}
                                            onClick={
                                                option.onClick
                                                    ? option.onClick
                                                    : onOptionClick
                                                    ? () =>
                                                          onOptionClick(option)
                                                    : undefined
                                            }
                                        >
                                            <div className="flex items-center">
                                                {(option.icon &&
                                                    !option.iconPosition) ||
                                                    (option.icon &&
                                                        option.iconPosition ==
                                                            "left" && (
                                                            <option.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                                                        ))}
                                                <span>
                                                    {option[displayField]}
                                                </span>
                                                {(option.icon &&
                                                    !option.iconPosition) ||
                                                    (option.icon &&
                                                        option.iconPosition ==
                                                            "right" && (
                                                            <option.icon className="ml-2 h-4 w-4 flex-shrink-0 " />
                                                        ))}
                                            </div>
                                        </button>
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
