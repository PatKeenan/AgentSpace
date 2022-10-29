import clsx from "clsx";
import React from "react";

type TextareaProps = {
    id: string;
    label: string;
} & Omit<React.ComponentProps<"textarea">, "id">;

export const Textarea = (props: TextareaProps) => {
    const { label, rows = 4, id, className, ...htmlProps } = props;
    return (
        <>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            <div className="mt-1">
                <textarea
                    rows={rows}
                    id={id}
                    className={clsx(
                        className,
                        "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    )}
                    {...htmlProps}
                />
            </div>
        </>
    );
};
