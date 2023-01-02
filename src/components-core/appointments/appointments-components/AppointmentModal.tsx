import { useDebounceState, useContacts, useWorkspace } from "hooks";
import { QuickAddContactFrom } from "./QuickAddContactForm";
import { useAppointmentsUI } from "../useAppointmentsUI";
import { Combobox, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { AppointmentStatus } from "@prisma/client";
import { useAppointments } from "hooks";
import { trpc } from "utils/trpc";
import * as React from "react";

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
import { v4 } from "uuid";

import {
    AppointmentSchema,
    ContactOnAppointmentSchema,
    ContactOnAppointmentSchemaExtended,
} from "server/schemas";
import { formatDate } from "utils/formatDate";

export type AppointmentFormType = AppointmentSchema & {
    contacts?: ContactOnAppointmentSchemaExtended[];
};

type AppointmentModalProps = {
    selectedDate: string;
    onSuccessCallback: () => void;
    appointment?: AppointmentSchema;
};

// Used for the select component when choosing an appointment status
const statusOptions = Object.keys(AppointmentStatus).map((key, index) => ({
    id: String(index),
    value: key,
    display: key.toLowerCase().replace("_", " "),
}));

const initialFormState: AppointmentFormType = {
    address: "",
    latitude: undefined,
    longitude: undefined,
    contacts: [],
    address_2: undefined,
    status: "NO_STATUS",
    startTime: "",
    endTime: "",
    note: undefined,
    date: new Date().toISOString(),
};

const appointmentReducer = (
    state: AppointmentFormType,
    newState: Partial<AppointmentFormType>
) => ({
    ...state,
    ...newState,
});

export const AppointmentModal = (props: AppointmentModalProps) => {
    const { selectedDate, onSuccessCallback } = props;
    const { resetModal, modal } = useAppointmentsUI();
    const [state, setState] = React.useReducer(
        appointmentReducer,
        modal?.defaultData ?? { ...initialFormState, date: selectedDate }
    );

    const [addContactFormOpen, setAddContactFormOpen] = React.useState(false);
    const contactInputRef = React.useRef<HTMLInputElement>(null);

    const { id: workspaceId } = useWorkspace();
    const { search } = useContacts();

    const { create, update } = useAppointments();

    const contactInput = useDebounceState("", 300);
    const addressInput = useDebounceState("");

    const sharedQueryOptions = { refetchOnWindowFocus: false };

    const addressQuery = trpc.addressSearch.search.useQuery(
        { query: addressInput.debounced },
        {
            ...sharedQueryOptions,
            enabled:
                (addressInput.state && addressInput.state?.trim().length > 4) ||
                false,
        }
    );

    const handleSelectAddress = (
        e:
            | Pick<AppointmentSchema, "address" | "latitude" | "longitude">
            | undefined
    ) => {
        setState({
            address: e?.address,
            latitude: e?.latitude,
            longitude: e?.longitude,
        });
    };

    const handleAddAddressOption = () => {
        setState({
            address: addressInput.state,
            latitude: undefined,
            longitude: undefined,
        });
    };

    const handleSelectContacts = (value: AppointmentFormType["contacts"]) => {
        setState({ contacts: value });
        contactInputRef.current?.focus();
        return contactInput.setState("");
    };

    const handleDeleteContact = (contact: ContactOnAppointmentSchema) => {
        const filteredContacts = state.contacts
            ? state.contacts.filter((selectedContact) => {
                  if (
                      selectedContact.contactId == contact.contactId &&
                      selectedContact.selectedProfileId ==
                          contact.selectedProfileId
                  )
                      return false;
                  return true;
              })
            : [];

        return setState({ contacts: filteredContacts });
    };

    const { data: contactOptions, isFetched } = search(
        { query: contactInput.debounced, workspaceId: workspaceId as string },
        {
            enabled:
                contactInput.debounced.trim().length > 2 &&
                typeof workspaceId == "string" &&
                !addContactFormOpen,
            refetchOnWindowFocus: false,
            cacheTime: 0,
        }
    );

    const handleClose = () => {
        resetModal();
        // Accounts for the animation that runs before closing. This prevents a flash of the form resetting
        setTimeout(() => setState(initialFormState), 200);
    };

    const { mutate: createAppointmentMutation } = create({
        onSuccess: () => onSuccessCallback(),
    });
    const { mutate: updateAppointmentMutation } = update({
        onSuccess: () => onSuccessCallback(),
    });

    const onSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (workspaceId && !modal?.defaultData) {
            createAppointmentMutation({
                ...state,
                workspaceId: workspaceId as string,
                contacts: state.contacts?.map((contact) => ({
                    contactId: contact.contactId,
                    selectedProfileId: contact.selectedProfileId,
                })),
            });
        }
        if (workspaceId && modal?.defaultData) {
            const selectedContactIds = state.contacts?.flatMap(
                (i) => i.contactOnAppointmentId
            );
            const defaultIds =
                modal.defaultData.contacts?.flatMap(
                    (i) => i.contactOnAppointmentId
                ) || [];

            const deletedIds =
                defaultIds.filter(
                    (i) => i && !selectedContactIds?.includes(i)
                ) || [];

            updateAppointmentMutation({
                ...state,
                id: modal.defaultData.id,
                newContacts: state.contacts
                    ?.filter((i) => !i.contactOnAppointmentId)
                    ?.map((contact) => ({
                        contactId: contact.contactId,
                        selectedProfileId: contact.selectedProfileId,
                    })),
                removedContactOnAppointmentIds: deletedIds.map((i) => ({
                    id: i as string,
                })),
            });
        }
    };

    /////////////////////////////////////////////////////////////
    return (
        <Modal open={modal.state || false} onClose={handleClose}>
            {addContactFormOpen ? (
                <QuickAddContactFrom
                    defaultName={contactInput.state}
                    setDisplayName={contactInput.setState}
                    workspaceId={workspaceId as string}
                    onCancel={() => setAddContactFormOpen(false)}
                    onSuccessCallback={(data) =>
                        handleSelectContacts(
                            state.contacts
                                ? [
                                      ...state.contacts,
                                      {
                                          contactId: data.id,
                                          displayName: data.displayName,
                                          profileName:
                                              data.profiles[0]?.name ||
                                              undefined,
                                          selectedProfileId:
                                              data.profiles[0]?.id || undefined,
                                      },
                                  ]
                                : [
                                      {
                                          contactId: data.id,
                                          displayName: data.displayName,
                                          profileName:
                                              data.profiles[0]?.name ||
                                              undefined,
                                          selectedProfileId:
                                              data.profiles[0]?.id || undefined,
                                      },
                                  ]
                        )
                    }
                />
            ) : (
                <form onSubmit={onSubmit}>
                    <ModalTitle className="text-center lg:text-left">
                        {modal?.defaultData ? "Edit" : "Add"} Appointment
                    </ModalTitle>

                    {/* Date only in edit mode */}

                    <div className="col-span-8">
                        <InputGroup
                            autoFocus={false}
                            type="date"
                            label="Date"
                            name="date"
                            value={formatDate(
                                state.date || new Date(),
                                "YYY-MM-DD"
                            )}
                            onChange={(e) => setState({ date: e.target.value })}
                            direction="column"
                        />
                    </div>

                    {/* --- Address --- */}
                    <div className="grid w-full grid-cols-8 lg:gap-2">
                        <div className="z-[99] col-span-8 mt-2 lg:col-span-6">
                            <Autocomplete
                                required
                                label="Address"
                                name="address"
                                selected={
                                    state.address
                                        ? {
                                              id: "",
                                              address: state.address,
                                              latitude: undefined,
                                              longitude: undefined,
                                          }
                                        : undefined
                                }
                                onSelect={(i) => handleSelectAddress(i)}
                                value={addressInput.state}
                                setValue={addressInput.setState}
                                direction="column"
                                options={addressQuery.data?.features.map(
                                    (i) => ({
                                        id: i.id,
                                        address: i.place_name,
                                        latitude: i.center && i.center[1],
                                        longitude: i.center && i?.center[0],
                                    })
                                )}
                                renderValue={(option) =>
                                    option ? option.address : ""
                                }
                                onClear={() => {
                                    setState({
                                        address: undefined,
                                        latitude: undefined,
                                        longitude: undefined,
                                    });
                                    return addressInput.setState(undefined);
                                }}
                                isFetched={addressQuery.isFetched}
                                isLoading={addressQuery.isLoading}
                                addOption={handleAddAddressOption}
                            />
                        </div>
                        <div className="col-span-8 mt-2 lg:col-span-2 lg:mt-0">
                            <InputGroup
                                name="building"
                                label="Building/Apt"
                                direction="column"
                                value={state.address_2}
                                onChange={(e) =>
                                    setState({ address_2: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    {/* --- End Address ---  */}

                    {/* Contacts */}
                    <div className="relative z-50 col-span-8 grid w-full">
                        <Combobox
                            as="div"
                            value={state.contacts}
                            onChange={(i) => handleSelectContacts(i)}
                            multiple
                            className="relative mt-2 sm:pt-5 md:mt-0"
                        >
                            {({ open }) => (
                                <>
                                    <Combobox.Label className="block text-sm font-medium text-gray-700">
                                        Contacts
                                    </Combobox.Label>
                                    <div
                                        className="relative mt-1"
                                        onClick={() =>
                                            contactInputRef.current?.focus()
                                        }
                                    >
                                        <div className="flex w-full items-center rounded-md border border-gray-300 bg-white pl-2 pr-10 shadow-sm focus-within:border-indigo-500 focus-within:outline-none focus-within:ring-1 focus-within:ring-indigo-500 sm:text-sm">
                                            <Combobox.Input
                                                as={React.Fragment}
                                                onChange={(e) =>
                                                    contactInput.setState(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <input
                                                    value={contactInput.state}
                                                    autoComplete="off"
                                                    ref={contactInputRef}
                                                    className="mx-0 w-full border-0 px-2 ring-0 focus:border-0 focus:ring-0"
                                                />
                                            </Combobox.Input>
                                        </div>
                                        <Transition
                                            show={
                                                (open &&
                                                    contactInput.state &&
                                                    contactInput.state.trim()
                                                        .length > 2) ||
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
                                                {contactOptions?.map(
                                                    (contactOption) => {
                                                        return (
                                                            <React.Fragment
                                                                key={
                                                                    contactOption.id
                                                                }
                                                            >
                                                                <ComboboxOption
                                                                    value={{
                                                                        contactId:
                                                                            contactOption.id,
                                                                        displayName:
                                                                            contactOption.displayName,
                                                                    }}
                                                                    display={
                                                                        contactOption.displayName
                                                                    }
                                                                    key={
                                                                        contactOption.id
                                                                    }
                                                                />

                                                                {contactOption.profiles.map(
                                                                    (
                                                                        profile
                                                                    ) => (
                                                                        <ComboboxOption
                                                                            value={{
                                                                                contactId:
                                                                                    contactOption.id,
                                                                                displayName:
                                                                                    contactOption.displayName,
                                                                                selectedProfileId:
                                                                                    profile.id,
                                                                                profileName:
                                                                                    profile.name,
                                                                            }}
                                                                            display={`${contactOption.displayName} - ${profile.name}`}
                                                                            key={
                                                                                profile.id
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </React.Fragment>
                                                        );
                                                    }
                                                )}
                                                {open && isFetched && (
                                                    <button
                                                        className="relative w-full cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                                                        onClick={() =>
                                                            setAddContactFormOpen(
                                                                true
                                                            )
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
                                                                {
                                                                    contactInput.state
                                                                }
                                                                &quot; to
                                                                Contacts
                                                            </span>
                                                        </div>
                                                    </button>
                                                )}
                                            </Combobox.Options>
                                        </Transition>
                                    </div>

                                    {state.contacts &&
                                        state.contacts.length > 0 && (
                                            <ul className="mt-2  flex flex-wrap">
                                                {state.contacts.map((i) => (
                                                    <li
                                                        key={v4()}
                                                        className={"mr-2 mt-2"}
                                                    >
                                                        <Tag
                                                            onDelete={() =>
                                                                handleDeleteContact(
                                                                    i
                                                                )
                                                            }
                                                        >
                                                            <span>
                                                                {i.displayName}
                                                            </span>

                                                            {i.selectedProfileId && (
                                                                <span className="ml-1">
                                                                    - {}
                                                                    {
                                                                        i.profileName
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

                    {/* Time & Status*/}
                    <div className="mt-4 mb-4 grid w-full grid-cols-6 gap-4 lg:mt-0 lg:mb-0">
                        <div className="col-span-3 lg:col-span-2">
                            <InputGroup
                                type="time"
                                label="Start Time"
                                name="start-time"
                                value={state.startTime}
                                onChange={(e) =>
                                    setState({ startTime: e.target.value })
                                }
                                direction="column"
                            />
                        </div>
                        <div className="col-span-3 lg:col-span-2">
                            <InputGroup
                                type="time"
                                label="End Time"
                                name="end-time"
                                value={state.endTime}
                                onChange={(e) =>
                                    setState({ endTime: e.target.value })
                                }
                                direction="column"
                            />
                        </div>
                        <div className="col-span-6 lg:col-span-2 lg:pt-2">
                            <Select
                                label="Status"
                                name="status"
                                direction="col"
                                displayField="display"
                                selected={statusOptions.find(
                                    (i) => i.value == state.status
                                )}
                                setSelected={(i) =>
                                    setState({
                                        status: i.value as AppointmentStatus,
                                    })
                                }
                                className="max-h-[140px] capitalize"
                                options={statusOptions}
                            />
                        </div>
                    </div>

                    <Textarea
                        label="Notes"
                        name="notes"
                        id="notes"
                        value={state.note}
                        onChange={(e) => setState({ note: e.target.value })}
                    />

                    <div className="mt-8 flex justify-end space-x-3">
                        <Button variant="outlined" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {modal.defaultData
                                ? "Update Appointment"
                                : "Save Appointment"}
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
