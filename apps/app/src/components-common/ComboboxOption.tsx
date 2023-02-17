import { Combobox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export function ComboboxOption<T>({
    value,
    display,
}: {
    value: T;
    display: string | React.ReactNode;
}) {
    return (
        <Combobox.Option
            value={value}
            className={({ active }) =>
                clsx(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
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
                        {display}
                    </span>

                    {selected && (
                        <span
                            className={clsx(
                                "absolute inset-y-0 right-0 flex items-center pr-4",
                                active ? "text-white" : "text-indigo-600"
                            )}
                        >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                    )}
                </>
            )}
        </Combobox.Option>
    );
}
