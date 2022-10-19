import clsx from "clsx";
import { NextLink } from "./NextLink";

export const variantStyles = {
    text: "bg-white text-purple-600 hover:text-purple-500 focus:ring-purple-500",
    outlined:
        "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-purple-500 inline-flex items-center border px-4 py-2 shadow-sm",
    primary:
        "border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 inline-flex items-center border px-4 py-2 shadow-sm",
};

type ButtonProps = {
    variant: keyof typeof variantStyles;
} & React.HtmlHTMLAttributes<HTMLButtonElement>;

export const Button = (props: ButtonProps) => {
    const { variant, className, ...htmlProps } = props;
    return (
        <button
            type="button"
            className={clsx(
                className,
                variantStyles[variant],
                "rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
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
                "rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
            )}
            {...htmlProps}
        />
    );
};
