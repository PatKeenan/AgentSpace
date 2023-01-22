import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import React from "react";

type SelectProps<T, K> = {
    options: T[];
    displayField: K;
    selected: T;
    isInvalid?: boolean;
    setSelected: (selected: T) => void;
    className?: string;
    name?: string;
    ref?: React.ForwardedRef<HTMLSelectElement>;
};

export function Select<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends { id: string } & Record<string, any>,
    K extends keyof T
>(props: SelectProps<T, K>) {
    const {
        options,
        isInvalid,
        displayField,
        selected,
        setSelected,
        name,
        ref,
    } = props;

    const handleSelect = (value: string) => {
        const selected = options.find((i) => i[displayField] == value);
        setSelected(selected as T);
    };

    return (
        <div className="input-field__container">
            <select
                value={selected[displayField]}
                className={clsx(
                    isInvalid ? "input-field__invalid" : "input-field__valid",
                    "input-field"
                )}
                aria-invalid={isInvalid}
                onChange={(i) => handleSelect(i.target.value)}
                ref={ref}
                name={name}
            >
                {options?.map((option) => (
                    <option
                        value={option[displayField]}
                        key={option.id}
                        className="capitalize"
                    >
                        {option[displayField]}
                    </option>
                ))}
            </select>
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
