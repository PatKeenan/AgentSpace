import clsx from "clsx";
import React from "react";

type InputProps = {
    label: string;
    id: string;
    name: string;
} & Omit<React.ComponentProps<"input">, "name" | "id">;

export const Input = (props: InputProps) => {
    const { label, name, className, id, ...htmlProps } = props;
    return (
        <div className="pt-2">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            <div className="mt-1">
                <input
                    name={name}
                    id={id}
                    className={clsx(
                        className,
                        "w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    )}
                    {...htmlProps}
                />
            </div>
        </div>
    );
};
