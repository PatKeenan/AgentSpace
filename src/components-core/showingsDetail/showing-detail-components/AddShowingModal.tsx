import { useShowingDetailUI } from "../useShowingDetailUI";
import { Dialog, Transition } from "@headlessui/react";
import { useDebounceState } from "utils/useDebounce";
import { trpc } from "utils/trpc";
import * as React from "react";
import clsx from "clsx";
import {
    AutoComplete,
    MultiAutoComplete,
    Textarea,
    Input,
    Select,
    Button,
} from "components-common";

import type { Person, ShowingFormState, Status } from "../types";

const people: Person[] = [
    { id: "asd123fq", name: "Patrick" },
    { id: "asd123saf", name: "Morgan" },
    { id: "asd12dsvsq", name: "TIco" },
];

const statusOptions: Status[] = [
    { id: "1", value: "confirmed", display: "Confirmed" },
    { id: "2", value: "pending", display: "Pending" },
    { id: " 3", value: "canceled", display: "Canceled" },
];

const initialFormState: ShowingFormState = {
    clients: [],
    address: undefined,
    agent: undefined,
    status: statusOptions[1],
    startTime: "",
    endTime: "",
    buildingOrApt: "",
    note: "",
};

const showingFormReducer = (
    state: ShowingFormState,
    newState: Partial<ShowingFormState>
) => ({
    ...state,
    ...newState,
});

type AddShowingModalProps = {
    showing?: ShowingFormState;
    handleAddShowing: React.Dispatch<
        React.SetStateAction<ShowingFormState[] | undefined>
    >;
};

export const AddShowingModal = (props: AddShowingModalProps) => {
    const { showing, handleAddShowing } = props;

    const { editSliderOpen, setEditSliderOpen } = useShowingDetailUI();

    const [state, setState] = React.useReducer(
        showingFormReducer,
        showing ?? initialFormState
    );

    const {
        state: addressQuery,
        setState: setAddressQuery,
        debounced: debouncedAddressQuery,
    } = useDebounceState("");

    const {
        state: peopleQuery,
        setState: setPeopleQuery,
        debounced: debouncedPeopleQuery,
    } = useDebounceState("");

    const { data } = trpc.addressSearch.search.useQuery(
        { query: debouncedAddressQuery },
        { enabled: addressQuery.trim().length > 4, refetchOnWindowFocus: false }
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleAddShowing((prev) => (prev ? [...prev, state] : [state]));
    };

    const baseTopPadding = "pt-2";

    const handleReset = () => {
        setState(initialFormState);
    };

    /////////////////////////////////////////////////////////////

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
                                <form
                                    className="space-y-6 divide-y divide-gray-200"
                                    onSubmit={handleSubmit}
                                    id="showing-form"
                                >
                                    <div className="flex w-full gap-3 ">
                                        <div
                                            className={clsx(
                                                "w-4/6",
                                                baseTopPadding
                                            )}
                                        >
                                            <AutoComplete
                                                name="address"
                                                selected={state.address}
                                                onSelect={(e) =>
                                                    setState({ address: e })
                                                }
                                                label="Address"
                                                query={addressQuery}
                                                setQuery={setAddressQuery}
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                //@ts-ignore   TODO: Solve the ts warning
                                                options={data?.features}
                                                displayField={"place_name"}
                                                icon={false}
                                            />
                                        </div>

                                        <div
                                            className={clsx(
                                                "w-2/6",
                                                baseTopPadding
                                            )}
                                        >
                                            <Input
                                                id="building"
                                                label="Building/Apt"
                                                name="building"
                                                type="text"
                                                value={state.buildingOrApt}
                                                onChange={(e) =>
                                                    setState({
                                                        buildingOrApt:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="flex w-full gap-3">
                                        <div
                                            className={clsx(
                                                "w-6/12",
                                                baseTopPadding
                                            )}
                                        >
                                            <MultiAutoComplete
                                                selected={state.clients}
                                                onSelect={(e) =>
                                                    setState({ clients: e })
                                                }
                                                label="Clients"
                                                query={peopleQuery}
                                                setQuery={setPeopleQuery}
                                                options={people}
                                                displayField="name"
                                                icon={false}
                                            />
                                        </div>
                                        <div
                                            className={clsx(
                                                "w-6/12",
                                                baseTopPadding
                                            )}
                                        >
                                            <MultiAutoComplete
                                                selected={state.clients}
                                                onSelect={(e) =>
                                                    setState({ clients: e })
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
                                        <div
                                            className={clsx(
                                                "w-1/3",
                                                baseTopPadding
                                            )}
                                        >
                                            <Input
                                                id="time"
                                                label="Start Time"
                                                name="startTime"
                                                type="time"
                                                value={state.startTime}
                                                onChange={(e) =>
                                                    setState({
                                                        startTime:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div
                                            className={clsx(
                                                "w-1/3",
                                                baseTopPadding
                                            )}
                                        >
                                            <Input
                                                id="end-time"
                                                label="End Time"
                                                name="endTime"
                                                type="time"
                                                value={state.endTime}
                                                onChange={(e) =>
                                                    setState({
                                                        endTime: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div
                                            className={clsx(
                                                "w-1/3",
                                                baseTopPadding
                                            )}
                                        >
                                            <Select
                                                name="status"
                                                selected={state.status}
                                                setSelected={(e) =>
                                                    setState({ status: e })
                                                }
                                                options={statusOptions}
                                                displayField="display"
                                                label="Status"
                                                className="max-h-60"
                                            />
                                        </div>
                                    </div>
                                    <div className={baseTopPadding}>
                                        <Textarea
                                            id="note"
                                            name="notes="
                                            label="Note"
                                            value={state.note ?? ""}
                                            onChange={(e) =>
                                                setState({
                                                    note: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </form>

                                <div className="mt-5 sm:mt-8">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full justify-center"
                                        form="showing-form"
                                    >
                                        Save Showing
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};
