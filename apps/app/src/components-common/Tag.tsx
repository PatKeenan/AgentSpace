import { XMarkIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import Link from "next/link";

const sizeOptions = {
    sm: "px-2 py-2",
    md: "px-4 py-2",
    lg: "px-6 py-3",
};
export const Tag = ({
    onDelete,
    size = "md",
    href,
    ...rest
}: {
    onDelete?: () => void;
    href?: string;
    size?: keyof typeof sizeOptions;
} & React.ComponentProps<"div">) => {
    const { className, children, ...htmlProps } = rest;
    return (
        <div
            className={clsx(
                className,
                sizeOptions[size],
                "flex items-center space-x-2 rounded-md bg-gray-100 text-xs shadow"
            )}
            {...htmlProps}
        >
            <div
                className={clsx(
                    href &&
                        "cursor-pointer hover:text-indigo-600 hover:underline",
                    "truncate"
                )}
            >
                {href ? <Link href={href}>{children}</Link> : children}
            </div>

            {onDelete && (
                <button onClick={onDelete}>
                    <XMarkIcon className="h-4 w-4" aria-hidden />
                    <span className="sr-only">Delete</span>
                </button>
            )}
        </div>
    );
};
