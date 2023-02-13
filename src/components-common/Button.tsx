import {
    ArrowLeftIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from "@heroicons/react/20/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { SVGProps } from "react";
import { NextLink } from "./NextLink";
import Link from "next/link";

export const variantStyles = {
    text: "bg-white text-indigo-600 hover:text-indigo-500 focus:ring-indigo-500",
    outlined:
        "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500 disabled:hover:bg-white disabled:focus:ring-none disabled:cursor-not-allowed disabled:opacity-40",
    primary:
        "border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:hover:bg-indigo-600 disabled:focus:ring-none disabled:cursor-not-allowed disabled:opacity-40",
};

const iconSizeOptions = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
};
const buttonSize = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
};

const actionIcons = {
    delete: TrashIcon,
    edit: PencilIcon,
    add: PlusIcon,
    backArrow: ArrowLeftIcon,
    forwardArrow: ArrowRightIcon,
};

type ButtonProps = {
    variant: keyof typeof variantStyles;
    actionIcon?: keyof typeof actionIcons;
    iconSize?: keyof typeof iconSizeOptions;
    iconPosition?: "left" | "right";
    hideChildrenOnMobile?: boolean;
    size?: keyof typeof buttonSize;
} & React.ComponentProps<"button">;

export const Button = (props: ButtonProps) => {
    const {
        variant,
        className,
        children,
        actionIcon,
        iconSize = "lg",
        iconPosition = "left",
        type = "button",
        hideChildrenOnMobile = true,
        size = "md",
        ...htmlProps
    } = props;

    const Icon = actionIcon ? actionIcons[actionIcon] : null;
    return (
        <button
            type={type}
            className={clsx(
                className,
                variantStyles[variant],
                "rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2",
                ["primary", "outlined"].includes(variant) &&
                    "inline-flex items-center border shadow-sm",
                buttonSize[size]
            )}
            {...htmlProps}
        >
            {Icon && iconPosition == "left" && (
                <Icon
                    className={clsx(
                        iconSizeOptions[iconSize],
                        hideChildrenOnMobile
                            ? "lg:-ml-1 lg:mr-2"
                            : "-ml-1 mr-2",
                        variant == "primary" &&
                            actionIcon !== "delete" &&
                            "text-white",
                        actionIcon == "delete"
                            ? "text-red-400"
                            : "text-gray-400"
                    )}
                    aria-hidden
                />
            )}
            <span
                className={clsx(
                    Icon && hideChildrenOnMobile && "hidden lg:block",
                    actionIcon == "delete" && "text-red-400"
                )}
            >
                {children}
            </span>
            {Icon && iconPosition == "right" && (
                <Icon
                    className={clsx(
                        iconSizeOptions[iconSize],
                        hideChildrenOnMobile
                            ? "lg:-mr-1 lg:ml-2"
                            : "-mr-1 ml-2",
                        variant == "primary" &&
                            actionIcon !== "delete" &&
                            "text-white",
                        actionIcon == "delete"
                            ? "text-red-400"
                            : "text-gray-400"
                    )}
                    aria-hidden
                />
            )}
        </button>
    );
};
type ButtonLinkProps = {
    variant: keyof typeof variantStyles;
    href: string;
    iconSize?: keyof typeof iconSizeOptions;
    actionIcon?: keyof typeof actionIcons;
    iconPosition?: "left" | "right";
    hideChildrenOnMobile?: boolean;
} & Omit<React.HtmlHTMLAttributes<HTMLAnchorElement>, "href">;

export const ButtonLink = (props: ButtonLinkProps) => {
    const {
        variant,
        className,
        actionIcon,
        children,
        iconSize = "lg",
        hideChildrenOnMobile = true,
        iconPosition = "left",
        href,
        ...htmlProps
    } = props;
    const Icon = actionIcon ? actionIcons[actionIcon] : null;
    return (
        <Link href={href} passHref>
            <a
                className={clsx(
                    className,
                    variantStyles[variant],
                    "rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2",
                    ["primary", "outlined"].includes(variant) &&
                        "inline-flex items-center border px-4 py-2 shadow-sm"
                )}
                {...htmlProps}
            >
                {Icon && iconPosition == "left" && (
                    <Icon
                        className={clsx(
                            iconSizeOptions[iconSize],
                            hideChildrenOnMobile
                                ? "lg:-ml-1 lg:mr-2"
                                : "-ml-1 mr-2",
                            variant == "primary"
                                ? "text-white"
                                : "text-gray-400"
                        )}
                        aria-hidden
                    />
                )}
                <span
                    className={clsx(
                        Icon && hideChildrenOnMobile && "hidden lg:block"
                    )}
                >
                    {children}
                </span>
                {Icon && iconPosition == "right" && (
                    <Icon
                        className={clsx(
                            iconSizeOptions[iconSize],
                            hideChildrenOnMobile
                                ? "lg:-mr-1 lg:ml-2"
                                : "-mr-1 ml-2",
                            variant == "primary"
                                ? "text-white"
                                : "text-gray-400"
                        )}
                        aria-hidden
                    />
                )}
            </a>
        </Link>
    );
};

type IconButtonProps = {
    icon: (
        props: SVGProps<SVGSVGElement> & {
            title?: string | undefined;
            titleId?: string | undefined;
        }
    ) => JSX.Element;
    title: string;
    size?: keyof typeof iconSizeOptions;
    textColor?: string;
} & Omit<React.ComponentProps<"button">, "title">;
export const IconButton = (props: IconButtonProps) => {
    const { icon: Icon, size = "md", title, textColor, ...htmlProps } = props;

    return (
        <button
            className="group flex items-center justify-center rounded-full p-2 text-sm hover:bg-gray-100"
            title={title}
            {...htmlProps}
        >
            <span className="sr-only">{title}</span>
            <Icon
                className={clsx(
                    iconSizeOptions[size],
                    textColor
                        ? textColor
                        : "text-gray-300 group-hover:text-gray-400"
                )}
                aria-hidden="true"
            />
        </button>
    );
};
