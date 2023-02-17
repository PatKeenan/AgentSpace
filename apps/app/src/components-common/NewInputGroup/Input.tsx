import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import React from "react";
import { InputContext, useInputGroup } from "./context";
import { Select } from "./Select";
import { InputErrorProps, InputGroupProps, InputLabelProps } from "./types";

export const NewInputGroup = (props: InputGroupProps) => {
    const { isInvalid = false, isRequired = false, children } = props;
    return (
        <InputContext.Provider value={{ isInvalid, isRequired }}>
            <div className="input-group">{children}</div>
        </InputContext.Provider>
    );
};
const InputLabel = (props: InputLabelProps) => {
    const { htmlFor, children, optionalIndicator = true } = props;
    const { isRequired } = useInputGroup();
    return (
        <label htmlFor={htmlFor} className="input-label">
            {children}
            {isRequired && <span className="input-label__required">*</span>}
            {!isRequired && optionalIndicator && (
                <span className="input-label__optional">Optional</span>
            )}
        </label>
    );
};

const InputError = (props: InputErrorProps) => {
    const { isInvalid } = useInputGroup();
    return (
        <p
            className={clsx(
                isInvalid ? "opacity-100" : "opacity-0",
                "input-error__message"
            )}
            {...props}
        />
    );
};

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    (props, forwardedRef) => {
        const { isInvalid } = useInputGroup();
        const { type = "text", className, ...rest } = props;
        return (
            <div className={clsx("input-field__container", className)}>
                <input
                    type={type}
                    className={clsx(
                        isInvalid
                            ? "input-field__invalid"
                            : "input-field__valid",
                        "input-field"
                    )}
                    aria-invalid={isInvalid}
                    {...rest}
                    ref={forwardedRef}
                />
                <div className="input-field__error-symbol-container">
                    {isInvalid ? (
                        <ExclamationCircleIcon
                            className="input-field__error-icon"
                            aria-hidden="true"
                        />
                    ) : null}
                </div>
            </div>
        );
    }
);
Input.displayName = "Input";

const TextArea = React.forwardRef<
    HTMLTextAreaElement,
    React.ComponentProps<"textarea">
>((props, forwardedRef) => {
    const { isInvalid } = useInputGroup();
    const { className, ...rest } = props;
    return (
        <div className={clsx("input-field-container", className)}>
            <textarea
                className={clsx(
                    isInvalid ? "input-field__invalid" : "input-field__valid",
                    "input-field"
                )}
                aria-invalid={isInvalid}
                {...rest}
                ref={forwardedRef}
            />
            <div className="input-field__error-symbol-container">
                {isInvalid ? (
                    <ExclamationCircleIcon
                        className="input-field__error-icon"
                        aria-hidden="true"
                    />
                ) : null}
            </div>
        </div>
    );
});

TextArea.displayName = "TextArea";

NewInputGroup.Select = Select;
NewInputGroup.Input = Input;
NewInputGroup.TextArea = TextArea;
NewInputGroup.Label = InputLabel;
NewInputGroup.Error = InputError;
