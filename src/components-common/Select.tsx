import React from "react";
import { NewInputGroup } from "./NewInputGroup";

type SelectProps<T, K> = {
    options: T[];
    label?: string;
    displayField: K;
    selected: T;
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
    const { label, options, displayField, selected, setSelected, name, ref } =
        props;

    const handleSelect = (value: string) => {
        const selected = options.find((i) => i[displayField] == value);
        setSelected(selected as T);
    };

    return (
        <NewInputGroup>
            {label && (
                <NewInputGroup.Label htmlFor={name || ""}>
                    {label}
                </NewInputGroup.Label>
            )}
            <div className="input-field__container">
                <select
                    value={selected[displayField]}
                    className="input-field input-field__valid"
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
            </div>
        </NewInputGroup>
    );
}
