import { AutoComplete } from "components-common/Autocomplete";
import { useShowingDetailUI } from "../useShowingDetailUI";
import { Dialog, Transition } from "@headlessui/react";
import { useDebounce } from "utils/useDebounce";
import { trpc } from "utils/trpc";
import * as React from "react";
import { MultiAutoComplete } from "components-common/MultiAutocomplete";
import { Input } from "components-common/Input";
import { Select } from "components-common/Select";

import type { MapboxPlaces } from "types/map-box";

function useSearchTerm(initialState: string) {
    const [state, setState] = React.useState(initialState);
    return { state, setState, debounced: useDebounce(state, 700) };
}

const people = [
    { id: "asd123fq", name: "Patrick" },
    { id: "asd123saf", name: "Morgan" },
    { id: "asd12dsvsq", name: "TIco" },
];

const statusOptions = [
    { id: "1", value: "confirmed", display: "Confirmed" },
    { id: "2", value: "pending", display: "Pending" },
    { id: " 3", value: "canceled", display: "Canceled" },
];

type ModalState = {
    address: MapboxPlaces["features"] | undefined;
    clients: typeof people;
    agent: typeof people[number] | undefined;
    status: typeof statusOptions[number] | undefined;
};

export const AddShowingModal = () => {
    const { editSliderOpen, setEditSliderOpen } = useShowingDetailUI();

    const [selected, setSelected] = React.useState<ModalState>({
        clients: [],
        address: undefined,
        agent: undefined,
        status: statusOptions[1],
    });

    function handleSelect<
        T extends keyof typeof selected,
        K extends Partial<typeof selected[T]>
    >(key: T, val: K) {
        setSelected((prev) => ({ ...prev, [key]: val }));
    }

    const {
        state: addressQuery,
        setState: setAddressQuery,
        debounced: debouncedAddressQuery,
    } = useSearchTerm("");

    const {
        state: peopleQuery,
        setState: setPeopleQuery,
        debounced: debouncedPeopleQuery,
    } = useSearchTerm("");

    const { data } = trpc.addressSearch.search.useQuery(
        { query: debouncedAddressQuery },
        { enabled: addressQuery.trim().length > 4, refetchOnWindowFocus: false }
    );

    return (
        <Transition.Root show={editSliderOpen} as={React.Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={setEditSliderOpen}
            >
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <form className="space-y-6 divide-y divide-gray-200">
                                    <div className="flex w-full gap-3 ">
                                        <div className="w-4/6">
                                            <AutoComplete
                                                selected={selected.address}
                                                onSelect={(e) =>
                                                    handleSelect("address", e)
                                                }
                                                label="Address"
                                                query={addressQuery}
                                                setQuery={setAddressQuery}
                                                options={data?.features}
                                                displayField="place_name"
                                                icon={false}
                                            />
                                        </div>

                                        <div className="w-2/6">
                                            <Input
                                                id="building"
                                                label="Building/Apt"
                                                name="building"
                                                type="text"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex w-full gap-3">
                                        <div className="w-6/12">
                                            <MultiAutoComplete
                                                selected={selected.clients}
                                                onSelect={(e) =>
                                                    handleSelect("clients", e)
                                                }
                                                label="Clients"
                                                query={peopleQuery}
                                                setQuery={setPeopleQuery}
                                                options={people}
                                                displayField="name"
                                                icon={false}
                                            />
                                        </div>
                                        <div className="w-6/12">
                                            <MultiAutoComplete
                                                selected={selected.clients}
                                                onSelect={(e) =>
                                                    handleSelect("clients", e)
                                                }
                                                label="Agent"
                                                query={peopleQuery}
                                                setQuery={setPeopleQuery}
                                                options={people}
                                                displayField="name"
                                                icon={false}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex w-full items-center gap-3">
                                        <div className="w-1/3">
                                            <Input
                                                id="time"
                                                label="Start Time"
                                                name="start-time"
                                                type="time"
                                            />
                                        </div>
                                        <div className="w-1/3">
                                            <Input
                                                id="end-time"
                                                label="End Time"
                                                name="end-time"
                                                type="time"
                                            />
                                        </div>

                                        <div className="w-1/3">
                                            <Select
                                                selected={selected.status}
                                                setSelected={(e) =>
                                                    handleSelect("status", e)
                                                }
                                                options={statusOptions}
                                                displayField="display"
                                                label="Status"
                                                className="max-h-60"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <label
                                            htmlFor="comment"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Notes
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                rows={4}
                                                name="comment"
                                                id="comment"
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                defaultValue={""}
                                            />
                                        </div>
                                    </div>
                                </form>

                                <div className="mt-5 sm:mt-8">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                                        onClick={() => setEditSliderOpen(false)}
                                    >
                                        Save Showing
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};
