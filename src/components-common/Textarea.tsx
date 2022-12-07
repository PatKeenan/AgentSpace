import clsx from "clsx";
import React from "react";

type TextareaProps = {
    id: string;
    label: string;
    containerClass?: string;
    direction?: "col" | "row";
} & Omit<React.ComponentProps<"textarea">, "id">;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    (props, forwardedRef) => {
        const {
            label,
            rows = 4,
            id,
            className,
            containerClass,
            direction = "col",
            ...htmlProps
        } = props;
        return (
            <div
                className={clsx(
                    direction == "row" ? "sm:gap-4" : "gap-0",
                    "sm:grid sm:grid-cols-3 sm:items-start sm:pt-5 sm:first:border-t sm:first:border-gray-200",
                    containerClass
                )}
            >
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
                <div
                    className={clsx(
                        direction == "row" ? "sm:col-span-2" : "col-span-3",
                        "relative pt-1 sm:mt-0"
                    )}
                >
                    <textarea
                        ref={forwardedRef}
                        rows={rows}
                        id={id}
                        className={clsx(
                            className,
                            "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        )}
                        {...htmlProps}
                    />
                </div>
            </div>
        );
    }
);
Textarea.displayName = "TextArea";
