import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import * as React from "react";
import clsx from "clsx";

type AutoCompleteProps<T, K> = {
    options: T[] | undefined | null;
    label: string;
    query: string;
    setQuery: (q: string) => void;
    selected: T | undefined;
    onSelect: (selectedItem: T) => void;
    displayField: K;
    icon?: boolean;
    multiple?: boolean;
    name?: string;
    direction?: "row" | "column";
    required?: boolean;
    className?: string;
};

export function AutoComplete<
    T extends { id: string } & Record<string, any>,
    K extends keyof T
>(props: AutoCompleteProps<T, K>) {
    const {
        label,
        query,
        setQuery,
        selected,
        onSelect,
        displayField,
        options,
        icon = true,
        name,
        direction = "row",
        className,
        required = false,
    } = props;

    return (
        <Combobox
            as="div"
            value={selected}
            onChange={onSelect}
            className={clsx(
                className,
                direction == "row" ? "sm:gap-4" : "gap-0",
                "sm:grid sm:grid-cols-3 sm:items-start sm:pt-5 sm:first:border-t sm:first:border-gray-200"
            )}
        >
            <Combobox.Label
                className={clsx(
                    direction == "row" && "pt-2",
                    "block text-sm font-medium text-gray-700"
                )}
            >
                {label}
            </Combobox.Label>
            <div
                className={clsx(
                    direction == "row" ? "sm:col-span-2" : "col-span-3",
                    "sm:mt-0, relative  pt-1"
                )}
            >
                <Combobox.Input
                    required={required}
                    name={name}
                    value={query}
                    className="w-full rounded-md border border-gray-300 bg-white pb-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    onChange={(event) => setQuery(event.target.value)}
                    autoComplete="off"
                    displayValue={(option: T) => {
                        return option && option[displayField];
                    }}
                />
                {icon && (
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                        <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </Combobox.Button>
                )}

                {options && options.length > 0 && (
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {options.map((option) => (
                            <Combobox.Option
                                key={option.id}
                                value={option}
                                className={({ active }) =>
                                    clsx(
                                        "relative cursor-default select-none py-2 pl-3 pr-9",
                                        active
                                            ? "bg-indigo-600 text-white"
                                            : "text-gray-900"
                                    )
                                }
                            >
                                {({ active, selected }) => (
                                    <>
                                        <span
                                            className={clsx(
                                                "block truncate",
                                                selected && "font-semibold"
                                            )}
                                        >
                                            {option[displayField as T[K]]}
                                        </span>

                                        {selected && (
                                            <span
                                                className={clsx(
                                                    "absolute inset-y-0 right-0 flex items-center pr-4",
                                                    active
                                                        ? "text-white"
                                                        : "text-indigo-600"
                                                )}
                                            >
                                                <CheckIcon
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        )}
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                )}
            </div>
        </Combobox>
    );
}
