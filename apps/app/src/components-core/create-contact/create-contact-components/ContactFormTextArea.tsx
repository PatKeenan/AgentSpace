import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import * as React from "react";

type TextAreaProps = {
    name: string;
    label: string;
    wasSubmitted?: boolean;
    errorMessage?: string;
    containerClass?: string;
} & Omit<React.ComponentProps<"textarea">, "name">;

export const ContactFormTextArea = React.forwardRef<
    HTMLTextAreaElement,
    TextAreaProps
>((props, forwardedRef) => {
    const {
        wasSubmitted,
        name,
        errorMessage,
        label,
        containerClass,
        className,
        required,

        ...rest
    } = props;
    const [touched, setTouched] = React.useState(false);
    const displayErrorMessage = (wasSubmitted || touched) && errorMessage;

    return (
        <div
            className={clsx(
                "sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5 sm:first:border-t sm:first:border-gray-200",
                containerClass
            )}
        >
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
                {label}
                {required ? <span>*</span> : null}
            </label>
            <div className="relative mt-1 sm:col-span-2 sm:mt-0">
                <textarea
                    ref={forwardedRef}
                    name={name}
                    id={`${name}-input`}
                    autoComplete="off"
                    onBlur={() => setTouched(true)}
                    aria-invalid={typeof displayErrorMessage == "string"}
                    aria-describedby={`error-${name}`}
                    className={clsx(
                        className,
                        errorMessage
                            ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500",
                        "block w-full rounded-md border pr-10 focus:outline-none sm:text-sm"
                    )}
                    defaultValue={""}
                    {...rest}
                />

                {displayErrorMessage ? (
                    <div className="pointer-events-none absolute inset-y-0 right-0 mr-auto flex items-center pr-3">
                        <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                        />
                    </div>
                ) : null}
                {displayErrorMessage ? (
                    <p
                        role="alert"
                        id={`${name}-error`}
                        className="col-span-2 col-start-2 mt-0 pt-1 text-red-500"
                    >
                        You have an error
                    </p>
                ) : null}
            </div>
        </div>
    );
});
ContactFormTextArea.displayName = "ContactFormTextArea";
