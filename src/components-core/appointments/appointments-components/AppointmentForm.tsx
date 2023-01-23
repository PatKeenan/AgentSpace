import { useDebounceState, useContacts, useWorkspace } from "hooks";
import { QuickAddContactFrom } from "./QuickAddContactForm";
import { Combobox, Transition } from "@headlessui/react";
import {
    AppointmentSingleton,
    type AppointmentSingletonType,
} from "lib/AppointmentSingleton";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useAppointments } from "hooks";
import { trpc } from "utils/trpc";
import * as React from "react";

import {
    Textarea,
    Select,
    Button,
    ModalTitle,
    OldInputGroup,
    NewInputGroup,
    ComboboxOption,
    Tag,
    Autocomplete,
} from "components-common";

import { v4 } from "uuid";
import { dateUtils } from "utils/dateUtils";

import { devtools } from "zustand/middleware";
import create from "zustand/react";
import { useAppointmentFormStore } from "./appointmentFormStore";

export type AppointmentFormData = Omit<
    AppointmentSingletonType["appointmentSchemas"]["create"],
    "contacts"
> & {
    contacts?: AppointmentSingletonType["appointmentSchemas"]["extendedContactOnAppointmentSchema"][];
    id: string;
};

type AppointmentFormProps = {
    defaultData?: AppointmentFormData;
    onSuccess?: (date: string) => void;
    onCancel?: () => void;
    selectedDate?: string;
};

export type AppointmentFormType = Omit<AppointmentFormData, "id">;

const initialFormState: AppointmentFormType = {
    address: "",
    status: "NO_STATUS",
    date: new Date().toISOString(),
};

const { appointmentFormFields, appointmentStatusOptions } =
    AppointmentSingleton;

const appointmentReducer = (
    state: AppointmentFormType,
    newState: Partial<AppointmentFormType>
) => ({
    ...state,
    ...newState,
});

export const AppointmentForm = (props: AppointmentFormProps) => {
    const { callback } = useAppointmentFormStore();
    const { defaultData, selectedDate, onSuccess, onCancel } = props;

    const [state, setState] = React.useReducer(
        appointmentReducer,
        (defaultData as AppointmentFormType & { id: string }) ?? {
            ...initialFormState,
            date: selectedDate
                ? selectedDate
                : dateUtils.transform(new Date()).isoDateOnly,
        }
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
        e?: Pick<
            AppointmentSingletonType["appointmentSchemas"]["create"],
            "address" | "latitude" | "longitude"
        >
    ) => {
        setState({
            address: e?.address,
            latitude: e?.latitude,
            longitude: e?.longitude,
        });
    };

    const handleSelectContacts = (value: AppointmentFormType["contacts"]) => {
        setState({ contacts: value });
        contactInputRef.current?.focus();
        return contactInput.setState("");
    };

    const handleDeleteContact = (
        contact: AppointmentSingletonType["appointmentSchemas"]["base"]["contacts"][number]
    ) => {
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

    const { mutate: createAppointmentMutation } = create();
    const { mutate: updateAppointmentMutation } = update();
    const onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (workspaceId && !defaultData) {
            createAppointmentMutation(
                {
                    ...state,
                    workspaceId: workspaceId as string,
                    contacts: state.contacts?.map((contact) => ({
                        contactId: contact.contactId,
                        selectedProfileId: contact.selectedProfileId,
                    })),
                },
                {
                    onSuccess: () => {
                        callback?.();
                        onSuccess?.(state.date);
                    },
                }
            );
        }
        if (workspaceId && defaultData) {
            const selectedContactIds = state.contacts?.flatMap(
                (i) => i.contactOnAppointmentId
            );
            const defaultIds =
                defaultData.contacts?.flatMap(
                    (i) => i.contactOnAppointmentId
                ) || [];

            const deletedIds =
                defaultIds.filter(
                    (i) => i && !selectedContactIds?.includes(i)
                ) || [];

            updateAppointmentMutation(
                {
                    ...state,
                    id: defaultData.id,
                    newContacts: state.contacts
                        ?.filter((i) => !i.contactOnAppointmentId)
                        ?.map((contact) => ({
                            contactId: contact.contactId,
                            selectedProfileId: contact.selectedProfileId,
                        })),
                    removedContactOnAppointmentIds: deletedIds.map((i) => ({
                        id: i as string,
                    })),
                },
                {
                    onSuccess: () => {
                        callback?.();
                        onSuccess?.(state.date);
                    },
                }
            );
        }
    };
    const addressOptions = React.useCallback(
        () =>
            addressQuery.data?.features.map((i) => ({
                id: i.id,
                address: i.place_name,
                latitude: i.center && i.center[1],
                longitude: i.center && i?.center[0],
            })),
        [addressQuery.data]
    );
    const selectedAddressValue = state.address
        ? {
              id: "",
              address: state.address,
              latitude: undefined,
              longitude: undefined,
          }
        : undefined;
    const extraAddressOptionValue = {
        address: addressInput.state || "",
        id: "",
        latitude: undefined,
        longitude: undefined,
    };

    const handleClearAddress = () => {
        setState({
            address: undefined,
            latitude: undefined,
            longitude: undefined,
        });
        return addressInput.setState(undefined);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        return setState({ [e.target.name]: e.target.value });
    };

    return addContactFormOpen ? (
        <QuickAddContactFrom
            defaultName={contactInput.state}
            setName={contactInput.setState}
            workspaceId={workspaceId as string}
            onCancel={() => setAddContactFormOpen(false)}
            onSuccessCallback={(data) =>
                handleSelectContacts(
                    state.contacts
                        ? [
                              ...state.contacts,
                              {
                                  contactId: data.id,
                                  name: data.name,
                                  profileName:
                                      data.profiles[0]?.name || undefined,
                                  selectedProfileId:
                                      data.profiles[0]?.id || undefined,
                              },
                          ]
                        : [
                              {
                                  contactId: data.id,
                                  name: data.name,
                                  profileName:
                                      data.profiles[0]?.name || undefined,
                                  selectedProfileId:
                                      data.profiles[0]?.id || undefined,
                              },
                          ]
                )
            }
        />
    ) : (
        <form onSubmit={onSubmit} tabIndex={0}>
            <fieldset>
                <ModalTitle>
                    <legend>{defaultData ? "Edit" : "Add"} Appointment</legend>
                </ModalTitle>

                {/* Date only in edit mode */}

                <div className="col-span-8 mt-6">
                    <NewInputGroup
                        key={appointmentFormFields.date.name}
                        isRequired={true}
                    >
                        <NewInputGroup.Label
                            htmlFor={appointmentFormFields.date.name}
                        >
                            {appointmentFormFields.date.label}
                        </NewInputGroup.Label>
                        <NewInputGroup.Input
                            type="date"
                            value={state.date}
                            name={appointmentFormFields.date.name}
                            onChange={handleChange}
                        />
                    </NewInputGroup>
                </div>

                {/* --- Address --- */}
                <div className="mt-4 grid w-full grid-cols-8 gap-4">
                    <div className="z-[99] col-span-8 lg:col-span-6">
                        <Autocomplete
                            {...appointmentFormFields.address}
                            required
                            selected={selectedAddressValue}
                            onSelect={handleSelectAddress}
                            value={addressInput.state}
                            setValue={addressInput.setState}
                            direction="column"
                            options={addressOptions()}
                            renderValue={(option) =>
                                option ? option.address : ""
                            }
                            onClear={handleClearAddress}
                            isFetched={addressQuery.isFetched}
                            isLoading={addressQuery.isLoading}
                            optionValue={extraAddressOptionValue}
                        />
                    </div>
                    <div className="col-span-8  lg:col-span-2">
                        <OldInputGroup
                            {...appointmentFormFields.address_2}
                            direction="column"
                            value={state.address_2}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {/* --- End Address ---  */}

                {/* Contacts */}
                <div className="relative z-50 col-span-8 mt-4 grid w-full">
                    <Combobox
                        as="div"
                        value={state.contacts || []}
                        onChange={(i) => handleSelectContacts(i)}
                        multiple
                        className="relative  md:mt-0"
                    >
                        {({ open }) => (
                            <>
                                <Combobox.Label className="block text-sm font-medium text-gray-700">
                                    {appointmentFormFields.contacts.label}
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
                                                                    name: contactOption.name,
                                                                }}
                                                                display={
                                                                    contactOption.name
                                                                }
                                                                key={
                                                                    contactOption.id
                                                                }
                                                            />

                                                            {contactOption.profiles.map(
                                                                (profile) => (
                                                                    <ComboboxOption
                                                                        value={{
                                                                            contactId:
                                                                                contactOption.id,
                                                                            name: contactOption.name,
                                                                            selectedProfileId:
                                                                                profile.id,
                                                                            profileName:
                                                                                profile.name,
                                                                        }}
                                                                        display={`${contactOption.name} - ${profile.name}`}
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
                                                            aria-hidden={true}
                                                        />
                                                        <span>
                                                            Add &quot;
                                                            {contactInput.state}
                                                            &quot; to Contacts
                                                        </span>
                                                    </div>
                                                </button>
                                            )}
                                        </Combobox.Options>
                                    </Transition>
                                </div>

                                {state.contacts && state.contacts.length > 0 && (
                                    <ul className="mt-2  flex flex-wrap">
                                        {state.contacts.map((i) => (
                                            <li
                                                key={v4()}
                                                className={"mr-2 mt-2"}
                                            >
                                                <Tag
                                                    onDelete={() =>
                                                        handleDeleteContact(i)
                                                    }
                                                >
                                                    <span>{i.name}</span>

                                                    {i.selectedProfileId && (
                                                        <span className="ml-1">
                                                            - {}
                                                            {i.profileName}
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
                <div className="mt-4 grid w-full grid-cols-6 gap-4">
                    <div className="col-span-3 lg:col-span-2">
                        <OldInputGroup
                            {...appointmentFormFields.startTime}
                            type="time"
                            value={state.startTime}
                            onChange={handleChange}
                            direction="column"
                        />
                    </div>
                    <div className="col-span-3 lg:col-span-2">
                        <OldInputGroup
                            {...appointmentFormFields.endTime}
                            type="time"
                            value={state.endTime}
                            onChange={handleChange}
                            direction="column"
                        />
                    </div>
                    <div className="col-span-6 lg:col-span-2 ">
                        {/*  <Select
                                    {...appointmentFormFields.status}
                                    direction="column"
                                    displayField="display"
                                    selected={appointmentStatusOptions.find(
                                        (i) => i.value == state.status
                                    )}
                                    setSelected={(i) =>
                                        setState({
                                            status: i.value,
                                        })
                                    }
                                    className="max-h-[140px] capitalize"
                                    options={appointmentStatusOptions}
                                /> */}
                        <Select
                            {...appointmentFormFields.status}
                            displayField="display"
                            selected={
                                appointmentStatusOptions.find(
                                    (i) => i.value == state.status
                                ) as typeof appointmentStatusOptions[number]
                            }
                            setSelected={(i) =>
                                setState({
                                    status: i.value,
                                })
                            }
                            className="max-h-[140px] capitalize"
                            options={appointmentStatusOptions}
                        />
                    </div>
                </div>

                <Textarea
                    {...appointmentFormFields.note}
                    containerClass="mt-4"
                    value={state.note}
                    onChange={handleChange}
                />

                <div className="mt-8 flex justify-end space-x-3">
                    <Button variant="outlined" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        {defaultData ? "Save Changes" : "Save"}
                    </Button>
                </div>
            </fieldset>
        </form>
    );
};
