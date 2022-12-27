import { useAppointmentsUI } from "../useAppointmentsUI";
import { trpc } from "utils/trpc";
import * as React from "react";
import {
    useDebounceState,
    useContacts,
    useAppointments,
    useWorkspace,
} from "hooks";

import { QuickAddContactFrom } from "./QuickAddContactForm";

import {
    Textarea,
    Select,
    Button,
    Modal,
    ModalTitle,
    InputGroup,
    ComboboxOption,
    Tag,
    Autocomplete,
} from "components-common";

import type {
    AddAppointmentModalProps,
    AppointmentFormState,
    Selected,
} from "../types";

import { Combobox, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { statusOptions } from "../appointments-utils";

const initialFormState: AppointmentFormState = {
    clients: [],
    address: undefined,
    agents: [],
    status: statusOptions[0],
    startTime: "",
    endTime: "",
    buildingOrApt: "",
    note: "",
};

const appointmentFormReducer = (
    state: AppointmentFormState,
    newState: Partial<AppointmentFormState>
) => ({
    ...state,
    ...newState,
});

export const AppointmentModal = (props: AddAppointmentModalProps) => {
    const { appointment, selectedDate, onSuccessCallback } = props;

    const [state, setState] = React.useReducer(
        appointmentFormReducer,
        appointment ?? initialFormState
    );

    const addressInput = useDebounceState("");
    const { resetModal, modal } = useAppointmentsUI();

    const sharedQueryOptions = { refetchOnWindowFocus: false };

    const [selected, setSelected] = React.useState<Selected>([]);

    const { data: addressOptions } = trpc.addressSearch.search.useQuery(
        { query: addressInput.debounced },
        {
            ...sharedQueryOptions,
            enabled:
                (addressInput.state && addressInput.state?.trim().length > 4) ||
                false,
        }
    );

    const handleClose = () => {
        resetModal();
        // Accounts for the animation that runs before closing. This prevents a flash of the form resetting
        setTimeout(() => setState(initialFormState), 200);
    };
    const { id } = useWorkspace();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };
    const {
        state: input,
        setState: setInput,
        debounced: debouncedInput,
    } = useDebounceState("", 300);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const { search } = useContacts();
    const [selectedStatus, setSelectedStatus] = React.useState(
        statusOptions[0]
    );
    const [addContactForm, setAddContactForm] = React.useState(false);
    const handleDelete = (i: {
        selectedRoleId?: string;
        contactId: string;
    }) => {
        const filteredContacts = selected
            ? selected.filter((selectedContact) => {
                  if (
                      selectedContact.data.id == i.contactId &&
                      selectedContact.selectedRoleId == i.selectedRoleId
                  )
                      return false;
                  return true;
              })
            : [];

        setSelected(filteredContacts);
    };
    const { data: contactOptions, isFetched } = search(
        { query: debouncedInput, workspaceId: id as string },
        {
            enabled:
                debouncedInput.trim().length > 2 &&
                typeof id == "string" &&
                !addContactForm,
            refetchOnWindowFocus: false,
            cacheTime: 0,
        }
    );
    const handleAddContact = () => {
        setAddContactForm(true);
    };
    const handleCancel = () => {
        return resetModal();
    };

    const handleChange = (i: Selected) => {
        setSelected(i);
        setInput("");
        return inputRef.current?.focus();
    };

    const handleSelectAddress = (e: AppointmentFormState["address"]) => {
        setState({ address: e });
    };

    /////////////////////////////////////////////////////////////
    return (
        <Modal open={modal.state || false} onClose={handleClose}>
            {addContactForm ? (
                <QuickAddContactFrom
                    defaultName={input}
                    setDisplayName={setInput}
                    workspaceId={id as string}
                    onCancel={() => setAddContactForm(false)}
                />
            ) : (
                <form onSubmit={handleSubmit}>
                    <ModalTitle>Add Appointment</ModalTitle>

                    {/* --- Address --- */}
                    <div className="grid w-full grid-cols-8 gap-2">
                        <div className="z-[99] col-span-6">
                            <Autocomplete
                                name="address"
                                label="Address"
                                selected={state?.address || null}
                                onSelect={handleSelectAddress}
                                value={addressInput.state}
                                setValue={addressInput.setState}
                                direction="column"
                                options={addressOptions?.features}
                                renderValue={(option) => option?.place_name}
                                onClear={() => {
                                    setState({ address: null });
                                    return addressInput.setState(undefined);
                                }}
                            />
                        </div>
                        <div className="col-span-2 ">
                            <InputGroup
                                name="building"
                                label="Building/Apt"
                                direction="column"
                            />
                        </div>
                    </div>
                    {/* --- End Address ---  */}

                    {/* Contacts */}
                    <div className="relative z-50 col-span-8 grid w-full">
                        <Combobox
                            as="div"
                            value={selected}
                            onChange={handleChange}
                            multiple
                            className="relative mt-4"
                        >
                            {({ open }) => (
                                <>
                                    <Combobox.Label className="block text-sm font-medium text-gray-700">
                                        Contacts
                                    </Combobox.Label>
                                    <div
                                        className="relative mt-1"
                                        onClick={() =>
                                            inputRef.current?.focus()
                                        }
                                    >
                                        <div className="flex w-full items-center rounded-md border border-gray-300 bg-white pl-2 pr-10 shadow-sm focus-within:border-indigo-500 focus-within:outline-none focus-within:ring-1 focus-within:ring-indigo-500 sm:text-sm">
                                            <Combobox.Input
                                                as={React.Fragment}
                                                onChange={(e) =>
                                                    setInput(e.target.value)
                                                }
                                            >
                                                <input
                                                    value={input}
                                                    autoComplete="off"
                                                    ref={inputRef}
                                                    className="mx-0 w-full border-0 px-2 ring-0 focus:border-0 focus:ring-0"
                                                />
                                            </Combobox.Input>
                                        </div>
                                        <Transition
                                            show={
                                                (open &&
                                                    input &&
                                                    input.trim().length > 2) ||
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
                                                className="absolute z-[99] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                                                static
                                            >
                                                {contactOptions?.map((i) => {
                                                    return (
                                                        <React.Fragment
                                                            key={i.id}
                                                        >
                                                            <ComboboxOption
                                                                value={{
                                                                    data: i,
                                                                }}
                                                                display={
                                                                    i.displayName
                                                                }
                                                                key={i.id}
                                                            />

                                                            {i.profiles.map(
                                                                (p) => (
                                                                    <ComboboxOption
                                                                        value={{
                                                                            selectedRoleId:
                                                                                p.id,
                                                                            data: i,
                                                                        }}
                                                                        display={`${i.displayName} - ${p.name}`}
                                                                        key={
                                                                            p.id
                                                                        }
                                                                    />
                                                                )
                                                            )}
                                                        </React.Fragment>
                                                    );
                                                })}
                                                {open && isFetched && (
                                                    <button
                                                        className="relative w-full cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                                                        onClick={
                                                            handleAddContact
                                                        }
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <PlusIcon
                                                                className="h-4 w-4"
                                                                aria-hidden={
                                                                    true
                                                                }
                                                            />
                                                            <span>
                                                                Add &quot;
                                                                {input}
                                                                &quot; to
                                                                Contacts
                                                            </span>
                                                        </div>
                                                    </button>
                                                )}
                                            </Combobox.Options>
                                        </Transition>
                                    </div>

                                    {selected && selected.length > 0 && (
                                        <ul className="mt-2  flex flex-wrap">
                                            {selected.map((i) => (
                                                <li
                                                    key={
                                                        i.selectedRoleId +
                                                        i.data.id
                                                    }
                                                    className={"mr-2 mt-2"}
                                                >
                                                    <Tag
                                                        onDelete={() =>
                                                            handleDelete({
                                                                selectedRoleId:
                                                                    i.selectedRoleId,
                                                                contactId:
                                                                    i.data.id,
                                                            })
                                                        }
                                                    >
                                                        <span>
                                                            {i.data.displayName}
                                                        </span>

                                                        {i?.selectedRoleId && (
                                                            <span className="ml-1">
                                                                - {}
                                                                {
                                                                    i.data.profiles.find(
                                                                        (
                                                                            profile
                                                                        ) =>
                                                                            profile.id ==
                                                                            i.selectedRoleId
                                                                    )?.name
                                                                }
                                                            </span>
                                                        )}
                                                    </Tag>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            )}
                        </Combobox>
                    </div>

                    {/* Time */}
                    <div className="grid w-full grid-cols-6 gap-4">
                        <div className="col-span-2">
                            <InputGroup
                                type="time"
                                label="Start Time"
                                name="start-time"
                                direction="column"
                            />
                        </div>
                        <div className="col-span-2">
                            <InputGroup
                                type="time"
                                label="End Time"
                                name="end-time"
                                direction="column"
                            />
                        </div>
                        <div className="col-span-2 pt-2">
                            <Select
                                label="Status"
                                name="status"
                                direction="col"
                                displayField="display"
                                selected={selectedStatus}
                                setSelected={setSelectedStatus}
                                className="max-h-[140px] capitalize"
                                options={statusOptions}
                            />
                        </div>
                    </div>

                    <Textarea label="Notes" name="notes" id="notes" />

                    <div className="mt-8 flex justify-end space-x-3">
                        <Button
                            variant="outlined"
                            onClick={() => handleCancel()}
                        >
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
