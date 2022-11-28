import { Dialog, Transition } from "@headlessui/react";
import { useAppointmentsUI } from "../useAppointmentsUI";
import {
    useDebounceState,
    useContacts,
    useAppointments,
    useWorkspace,
} from "hooks";
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
    Modal,
} from "components-common";

import type { AppointmentFormState } from "../types";
import { exists } from "utils/helpers";
import { ContactOnAppointmentRole, AppointmentStatus } from "@prisma/client";

export interface Status {
    id: string;
    value: AppointmentStatus;
    display: string;
}

const statusOptions: Status[] = [
    { id: "1", value: "CONFIRMED", display: "Confirmed" },
    { id: "2", value: "PENDING", display: "Pending" },
    { id: "4", value: "CANCELED", display: "Canceled" },
    { id: "5", value: "RESCHEDULED", display: "Rescheduled" },
    { id: "6", value: "DENIED", display: "Denied" },
];

const initialFormState: AppointmentFormState = {
    clients: [],
    address: undefined,
    agents: [],
    status: statusOptions[1],
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

type AddAppointmentModalProps = {
    appointment?: AppointmentFormState;
    selectedDate: Date;
    onSuccessCallback?: () => void;
};

export const AddAppointmentModal = (props: AddAppointmentModalProps) => {
    const { appointment, selectedDate, onSuccessCallback } = props;
    const [state, setState] = React.useReducer(
        appointmentFormReducer,
        appointment ?? initialFormState
    );

    const appointmentUI = useAppointmentsUI();
    const appointments = useAppointments();
    const workspace = useWorkspace();
    const contacts = useContacts();

    const addressInput = useDebounceState("");
    const contactsInput = useDebounceState("");
    const agentsInput = useDebounceState("");

    const sharedQueryOptions = { refetchOnWindowFocus: false };
    const baseTopPadding = "pt-2";

    const contactsQuery = contacts.search(
        { workspaceId: workspace.id as string, query: contactsInput.debounced },
        {
            ...sharedQueryOptions,
            enabled:
                exists(workspace.id) &&
                contactsInput.debounced.trim().length > 2,
        }
    );
    const agentsQuery = contacts.search(
        { workspaceId: workspace.id as string, query: agentsInput.debounced },
        {
            ...sharedQueryOptions,
            enabled:
                exists(workspace.id) && agentsInput.debounced.trim().length > 2,
        }
    );

    const { data } = trpc.addressSearch.search.useQuery(
        { query: addressInput.debounced },
        {
            ...sharedQueryOptions,
            enabled: addressInput.state.trim().length > 4,
        }
    );

    const createAppointment = appointments.create();
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (state.address) {
            const agentsFormatted = state.agents?.map((i) => ({
                contactId: i.id,
                role: ContactOnAppointmentRole["AGENT"],
            }));
            const clientsFormatted = state.clients?.map((i) => ({
                contactId: i.id,
                role: ContactOnAppointmentRole["CLIENT"],
            }));

            const contacts:
                | { contactId: string; role: ContactOnAppointmentRole }[]
                | [] =
                agentsFormatted && clientsFormatted
                    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      //@ts-ignore
                      agentsFormatted.concat(clientsFormatted)
                    : [];

            createAppointment.mutate(
                {
                    address: state.address.place_name,
                    longitude: String(state.address.geometry.coordinates[0]),
                    latitude: String(state.address.geometry.coordinates[1]),
                    workspaceId: workspace.id as string,
                    date: selectedDate.toISOString(),
                    note: state.note,
                    startTime: state.startTime,
                    endTime: state.endTime,
                    status: state.status?.value,
                    contacts,
                },
                {
                    onSuccess: () => {
                        onSuccessCallback && onSuccessCallback();
                        appointmentUI.setModalOpen(false);
                    },
                }
            );
        }
    };

    React.useEffect(() => {
        //Cleanup
        return () => setState(initialFormState);
    }, [appointmentUI.modalOpen]);

    /////////////////////////////////////////////////////////////

    return (
        <Modal
            open={appointmentUI.modalOpen}
            onClose={() => appointmentUI.setModalOpen(false)}
        >
            <form
                className="space-y-6 divide-y divide-gray-200"
                onSubmit={onSubmit}
                id="appointment-form"
            >
                <div className="flex w-full gap-3 ">
                    <div className={clsx("w-4/6", baseTopPadding)}>
                        <AutoComplete
                            required
                            name="address"
                            selected={state.address}
                            onSelect={(e) => setState({ address: e })}
                            label="Address"
                            query={addressInput.state}
                            setQuery={addressInput.setState}
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-ignore
                            options={data?.features}
                            displayField={"place_name"}
                            icon={false}
                        />
                    </div>

                    <div className={clsx("w-2/6", baseTopPadding)}>
                        <Input
                            id="building"
                            label="Building/Apt"
                            name="building"
                            type="text"
                            value={state.buildingOrApt}
                            onChange={(e) =>
                                setState({
                                    buildingOrApt: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>

                <div className="flex w-full gap-3">
                    <div className={clsx("w-6/12", baseTopPadding)}>
                        <MultiAutoComplete
                            selected={state.clients}
                            onSelect={(e) => setState({ clients: e })}
                            label="Client"
                            pluralOrSingle
                            query={contactsInput.state}
                            setQuery={contactsInput.setState}
                            options={contactsQuery?.data ?? []}
                            displayField={"displayName"}
                            icon={false}
                        />
                    </div>
                    <div className={clsx("w-6/12", baseTopPadding)}>
                        <MultiAutoComplete
                            selected={state.agents}
                            onSelect={(e) => setState({ agents: e })}
                            label={`Agent`}
                            pluralOrSingle
                            query={agentsInput.state}
                            setQuery={agentsInput.setState}
                            options={agentsQuery?.data ?? []}
                            displayField="displayName"
                            icon={false}
                        />
                    </div>
                </div>

                <div className="flex w-full items-center gap-3">
                    <div className={clsx("w-1/3", baseTopPadding)}>
                        <Input
                            id="time"
                            label="Start Time"
                            name="startTime"
                            type="time"
                            value={state.startTime}
                            onChange={(e) =>
                                setState({
                                    startTime: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className={clsx("w-1/3", baseTopPadding)}>
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

                    <div className={clsx("w-1/3", baseTopPadding)}>
                        <Select
                            name="status"
                            selected={state.status}
                            setSelected={(e) => setState({ status: e })}
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
                        name="notes"
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
                    form="appointment-form"
                >
                    Save Appointment
                </Button>
            </div>
        </Modal>
    );
};
