import { GridCard } from "components-core/contactDetail/contact-detail-components/GridCard";
import { ToggleMenu } from "components-common/ToggleMenu";
import { useAppointmentsUI } from "../useAppointmentsUI";
import { TrashIcon } from "@heroicons/react/24/outline";
import { formatTime } from "utils/formatTime";
import * as React from "react";

import type { Appointment } from "@prisma/client";
import clsx from "clsx";
import { AppointmentFormType } from "./AppointmentModal";
import { useAppointments } from "hooks/useAppointments";
import { Button } from "components-common/Button";

export const AppointmentCard = (props: {
    idx: number;
    appointment: Appointment & {
        contacts: {
            contact: {
                id: string;
                displayName: string;
            };
            id: string;
            profile: {
                id: string;
                name: string;
            } | null;
        }[];
    };
    onDelete?: () => void;
}) => {
    const [expanded, setExpanded] = React.useState(false);
    const { idx, appointment, onDelete } = props;
    const { setModal } = useAppointmentsUI();
    const { deleteHard } = useAppointments();

    const defaultModalData: AppointmentFormType & {
        id: string;
    } = {
        id: appointment.id,
        address: appointment.address,
        address_2: appointment?.address_2 || undefined,
        status: appointment.status,
        note: appointment?.note || undefined,
        latitude: appointment?.latitude || undefined,
        longitude: appointment?.longitude || undefined,
        date: appointment.date,
        startTime: appointment?.startTime || undefined,
        endTime: appointment?.endTime || undefined,
        contacts: appointment.contacts.map(({ id, contact, profile }) => ({
            contactOnAppointmentId: id,
            contactId: contact.id,
            displayName: contact.displayName,
            profileName: profile?.name,
            selectedProfileId: profile?.id,
        })),
    };

    const handleEdit = () => {
        setModal({
            state: true,
            defaultData: defaultModalData,
        });
    };

    const { mutate } = deleteHard();

    const handleDelete = () => {
        mutate(
            { appointmentId: appointment.id },
            { onSuccess: onDelete ? () => onDelete() : undefined }
        );
    };

    const timeDisplay = () => {
        const startTime = appointment.startTime
            ? formatTime(appointment.startTime)
            : undefined;
        if (startTime) {
            return appointment?.endTime
                ? `${startTime} - ${formatTime(appointment.endTime)}`
                : startTime;
        }
        return undefined;
    };

    return (
        <GridCard>
            <div className="relative mb-4 -mt-2 grid grid-cols-2 gap-2 border-b py-2">
                <h4 className="flex-shrink-0 font-bold tracking-wide text-gray-600">
                    Appointment {idx + 1}
                </h4>

                <ToggleMenu
                    items={[
                        {
                            text: "Edit",
                            onClick: handleEdit,
                        },
                        {
                            text: (
                                <div className="flex items-center text-sm text-red-600">
                                    <TrashIcon
                                        className="mr-2 h-4 w-4"
                                        aria-hidden="true"
                                    />
                                    <span>Delete</span>
                                </div>
                            ),
                            extraClasses: "border-t border-gray-200",
                            onClick: handleDelete,
                        },
                    ]}
                />
            </div>
            <DetailsRow
                title="Address"
                value={appointment?.address}
                expand={expanded}
            />
            {/*  <DetailsRow
                title="Status"
                value={appointment.status.toLowerCase()}
                detailsClassName="capitalize"
            /> */}
            <DetailsRow title="Time" value={timeDisplay()} expand={expanded} />
            <DetailsRow
                title="Notes"
                value={appointment?.note}
                expand={expanded}
            />
            <Button
                variant="outlined"
                className="mt-4 w-full justify-center text-xs"
                onClick={() => setExpanded(!expanded)}
            >
                {expanded ? "Collapse" : "Expand"}
            </Button>
        </GridCard>
    );
};

const DetailsRow = ({
    title,
    value,
    detailsClassName,
    expand = false,
}: {
    title: string;
    value?: string | null;
    detailsClassName?: string;
    expand?: boolean;
}) => {
    return (
        <div className="mt-2 grid grid-cols-4 items-start">
            <dt className="col-span-1 text-sm font-medium text-gray-700">
                {title}
            </dt>
            <dd
                className={clsx(
                    expand ? "whitespace-pre-line" : "truncate",
                    "col-span-3 flex-wrap text-gray-600",
                    detailsClassName
                )}
            >
                {value || "---"}
            </dd>
        </div>
    );
};
