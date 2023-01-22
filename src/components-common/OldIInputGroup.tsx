import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import * as React from "react";

type OldInputInputGroupProps = {
    name: string;
    label: string;
    wasSubmitted?: boolean;
    errorMessage?: string;
    containerClass?: string;
    startIcon?: React.ReactNode[] | React.ReactNode;
    direction?: "row" | "column";
} & Omit<React.ComponentProps<"input">, "name">;

export const OldInputGroup = React.forwardRef<
    HTMLInputElement,
    OldInputInputGroupProps
>((props, forwardedRef) => {
    const {
        wasSubmitted,
        name,
        errorMessage,
        label,
        direction = "row",
        containerClass,
        className,
        required,
        startIcon,
        autoFocus = false,
        type = "text",
        ...rest
    } = props;
    const [touched, setTouched] = React.useState(false);
    const displayErrorMessage = (wasSubmitted || touched) && errorMessage;

    return (
        <div
            className={clsx(
                direction == "row" ? "sm:gap-4" : "gap-0",
                "z-0 sm:grid sm:grid-cols-3 sm:items-start",
                containerClass
            )}
        >
            <label
                htmlFor={name}
                className={clsx(
                    direction == "row" ? "col-span-1" : "col-span-3",
                    "block text-sm font-medium text-gray-700"
                )}
            >
                {label}
                {required ? <span>*</span> : null}
            </label>
            <div
                className={clsx(
                    direction == "row" ? "sm:col-span-2" : "col-span-3",
                    "relative pt-1 sm:mt-0"
                )}
            >
                {startIcon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        {startIcon}
                    </div>
                )}
                <input
                    name={name}
                    type={type}
                    id={`${name}-input`}
                    autoComplete="off"
                    autoFocus={autoFocus}
                    onBlur={() => setTouched(true)}
                    aria-invalid={typeof displayErrorMessage == "string"}
                    aria-describedby={`error-${name}`}
                    ref={forwardedRef}
                    className={clsx(
                        className,
                        type == "checkbox" && "h-5 w-5",
                        startIcon && "pl-7",
                        errorMessage
                            ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500",
                        "block w-full rounded-md border pr-3 focus:outline-none sm:text-sm"
                    )}
                    {...rest}
                />
                {errorMessage ? (
                    <div className="pointer-events-none absolute inset-y-0 right-0 mr-auto flex items-center pr-3">
                        <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                        />
                    </div>
                ) : null}
                {errorMessage ? (
                    <p
                        role="alert"
                        id={`${name}-error`}
                        className={clsx(
                            direction == "row"
                                ? "col-span-2 col-start-2"
                                : "col-span-3",
                            "absolute truncate text-sm text-red-500 "
                        )}
                    >
                        {errorMessage}
                    </p>
                ) : null}
            </div>
        </div>
    );
});

OldInputGroup.displayName = "OldInputGroup";
