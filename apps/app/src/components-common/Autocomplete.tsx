import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import React from "react";

interface AutoCompleteProps<T>
    extends Omit<React.ComponentProps<"div">, "onSelect"> {
    options: T[] | undefined;
    direction?: "row" | "column";
    renderValue: (option: T) => string;
    label: string;
    name: string;
    value: string | undefined;
    setValue: (event: string) => void;
    required?: boolean;
    selected: T;
    onSelect: (item: T) => void;
    onClear?: () => void;
    isLoading?: boolean;
    isFetched?: boolean;
    optionValue?: T;
    optionalIndicator?: boolean;
}

export function Autocomplete<
    T extends ({ id: string } & Record<string, unknown>) | undefined
>(props: AutoCompleteProps<T | undefined>) {
    const {
        className,
        options,
        renderValue,
        direction,
        required,
        label,
        setValue,
        onSelect,
        selected,
        value,
        name,
        onClear,
        isFetched,
        optionValue,
        optionalIndicator,
    } = props;

    return (
        <Combobox
            as="div"
            value={selected}
            onChange={onSelect}
            className={clsx(
                className,
                direction == "row" ? "sm:gap-4" : "gap-0",
                "sm:grid sm:grid-cols-3 sm:items-start"
            )}
            nullable
        >
            {({ open }) => (
                <>
                    <Combobox.Label className={clsx("input-label")}>
                        {label}
                        {required && (
                            <span className="input-label__required">*</span>
                        )}
                        {!required && optionalIndicator && (
                            <span className="input-label__optional">
                                Optional
                            </span>
                        )}
                    </Combobox.Label>
                    <div
                        className={clsx(
                            direction == "row" ? "sm:col-span-2" : "col-span-3",
                            "input-field__container"
                        )}
                    >
                        <Combobox.Input
                            required={required}
                            name={name}
                            className="input-field w-full rounded-md border border-gray-300 bg-white px-3 pr-10 pb-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            onChange={(event) => setValue(event.target.value)}
                            autoComplete="off"
                            displayValue={renderValue}
                        />
                        {selected && (
                            <Combobox.Button
                                className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
                                onClick={onClear}
                            >
                                <span className="sr-only">Clear address</span>
                                <XMarkIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </Combobox.Button>
                        )}

                        <Transition
                            show={
                                (isFetched &&
                                    open &&
                                    value &&
                                    value.trim().length > 2) ||
                                false
                            }
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                            className={"z-[99]"}
                        >
                            <Combobox.Options
                                static
                                className="Z-[99] absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                            >
                                {options &&
                                    options?.length > 0 &&
                                    options.map((option) => {
                                        return (
                                            option && (
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
                                                    <span
                                                        className={clsx(
                                                            "block truncate",
                                                            selected?.id ==
                                                                option.id &&
                                                                "font-semibold"
                                                        )}
                                                    >
                                                        {renderValue(option)}
                                                    </span>

                                                    {selected?.id ==
                                                        option.id && (
                                                        <span
                                                            className={clsx(
                                                                "absolute inset-y-0 right-0 flex items-center pr-4",
                                                                selected?.id ==
                                                                    option.id
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
                                                </Combobox.Option>
                                            )
                                        );
                                    })}
                                {optionValue && open && isFetched && (
                                    <Combobox.Option
                                        value={optionValue}
                                        className="relative w-full cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <PlusIcon
                                                className="h-4 w-4"
                                                aria-hidden={true}
                                            />
                                            <span>
                                                Add &quot;
                                                {value}
                                                &quot;
                                            </span>
                                        </div>
                                    </Combobox.Option>
                                )}
                            </Combobox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Combobox>
    );
}
