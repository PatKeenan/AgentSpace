import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

type SelectProps<T, K> = {
    options?: T[] | undefined;
    label: string;
    displayField: K;
    selected: T | undefined;
    setSelected: (selected: T) => void;
    className?: string;
    containerClass?: string;
    direction?: "row" | "col";
    name?: string;
};

export function Select<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends { id: string } & Record<string, any>,
    K extends keyof T
>(props: SelectProps<T, K>) {
    const {
        label,
        options,
        displayField,
        selected,
        setSelected,
        direction = "col",
        containerClass,
        className,
        name,
    } = props;

    return (
        <Listbox
            value={selected}
            onChange={setSelected}
            name={name}
            as={"div"}
            className={clsx(
                direction == "row" ? "sm:gap-4" : "gap-0",
                "sm:grid sm:grid-cols-3 sm:items-start sm:pt-5",
                containerClass
            )}
        >
            {({ open }) => (
                <>
                    <Listbox.Label
                        className={clsx(
                            direction == "row" && "pt-2",
                            "block text-sm font-medium text-gray-700"
                        )}
                    >
                        {label}
                    </Listbox.Label>
                    <div
                        className={clsx(
                            direction == "row" ? "sm:col-span-2" : "col-span-3",
                            "relative pt-1 sm:mt-0"
                        )}
                    >
                        <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                            <span className="block truncate capitalize">
                                {selected && selected[displayField]}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options
                                className={clsx(
                                    className,
                                    "absolute z-[99] mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                                )}
                            >
                                {options?.map((option: T) => (
                                    <Listbox.Option
                                        key={option.id}
                                        className={({ active }) =>
                                            clsx(
                                                active
                                                    ? "bg-indigo-600 text-white"
                                                    : "text-gray-900",
                                                "relative cursor-default select-none py-2 pl-3 pr-9"
                                            )
                                        }
                                        value={option}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span
                                                    className={clsx(
                                                        selected
                                                            ? "font-semibold"
                                                            : "font-normal",
                                                        "block truncate capitalize"
                                                    )}
                                                >
                                                    {option[displayField]}
                                                </span>

                                                {selected ? (
                                                    <span
                                                        className={clsx(
                                                            active
                                                                ? "text-white"
                                                                : "text-indigo-600",
                                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                                        )}
                                                    >
                                                        <CheckIcon
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    );
}
