import clsx from "clsx";
import { SVGProps } from "react";
import { NextLink } from "./NextLink";

export const variantStyles = {
    text: "bg-white text-purple-600 hover:text-purple-500 focus:ring-purple-500",
    outlined:
        "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-purple-500",
    primary:
        "border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
};

type ButtonProps = {
    variant: keyof typeof variantStyles;
} & React.ComponentProps<"button">;

export const Button = (props: ButtonProps) => {
    const { variant, className, type = "button", ...htmlProps } = props;
    return (
        <button
            type={type}
            className={clsx(
                className,
                variantStyles[variant],
                "rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2",
                ["primary", "outlined"].includes(variant) &&
                    "inline-flex items-center border px-4 py-2 shadow-sm"
            )}
            {...htmlProps}
        />
    );
};
type ButtonLinkProps = {
    variant: keyof typeof variantStyles;
    href: string;
} & Omit<React.HtmlHTMLAttributes<HTMLAnchorElement>, "href">;

export const ButtonLink = (props: ButtonLinkProps) => {
    const { variant, className, ...htmlProps } = props;
    return (
        <NextLink
            type="button"
            className={clsx(
                className,
                variantStyles[variant],
                "rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2",
                ["primary", "outlined"].includes(variant) &&
                    "inline-flex items-center border px-4 py-2 shadow-sm"
            )}
            {...htmlProps}
        />
    );
};

const iconSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
};

type IconButtonProps = {
    icon: (
        props: SVGProps<SVGSVGElement> & {
            title?: string | undefined;
            titleId?: string | undefined;
        }
    ) => JSX.Element;
    title: string;
    size?: keyof typeof iconSize;
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
                    iconSize[size],
                    textColor
                        ? textColor
                        : "text-gray-300 group-hover:text-gray-400"
                )}
                aria-hidden="true"
            />
        </button>
    );
};
