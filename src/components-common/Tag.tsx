import { XMarkIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export const Tag = ({
    onDelete,
    ...rest
}: {
    onDelete?: () => void;
} & React.ComponentProps<"div">) => {
    const { className, children, ...htmlProps } = rest;
    return (
        <div
            className={clsx(
                className,
                "flex items-center space-x-2 rounded-md bg-gray-100 px-4 py-2 text-xs shadow"
            )}
            {...htmlProps}
        >
            <div className="truncate">{children}</div>

            {onDelete && (
                <button onClick={onDelete}>
                    <XMarkIcon className="h-4 w-4" aria-hidden />
                    <span className="sr-only">Delete</span>
                </button>
            )}
        </div>
    );
};
