import { GridCard } from "components-core/contactDetail/contact-detail-components/GridCard";
import { ToggleMenu } from "components-common/ToggleMenu";
import { useAppointmentsUI } from "../useAppointmentsUI";
import { TrashIcon } from "@heroicons/react/24/outline";
import { formatTime } from "utils/formatTime";
import * as React from "react";

import type { Appointment, AppointmentStatus } from "@prisma/client";
import clsx from "clsx";
import { AppointmentFormType } from "./AppointmentModal";
import { useAppointments } from "hooks/useAppointments";
import { Button } from "components-common/Button";
import { Select } from "components-common/Select";
import { statusOptions } from "../appointments-utils";
import { Tag } from "components-common/Tag";
import Link from "next/link";
import { format } from "date-fns";
import { formatDate } from "utils/formatDate";

export const AppointmentCard = (props: {
    idx: number;
    appointment: Appointment & {
        contacts: {
            contact: {
                id: string;
                name: string;
            };
            id: string;
            profile: {
                id: string;
                name: string;
            } | null;
        }[];
    };
    invalidate?: () => void;
}) => {
    const { idx, appointment, invalidate } = props;

    const [expanded, setExpanded] = React.useState(false);

    const [status, setStatus] = React.useState<
        typeof statusOptions[number] | undefined
    >(() => statusOptions.find((i) => i.value == String(appointment?.status)));

    React.useEffect(() => {
        const status = statusOptions.find(
            (i) => i.value == appointment?.status
        );
        setStatus(status);
    }, [appointment.status]);

    const { setModal } = useAppointmentsUI();
    const { deleteHard, quickUpdate } = useAppointments();

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
            name: contact.name,
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
    const { mutate: update } = quickUpdate();

    const handleDelete = () => {
        mutate(
            { appointmentId: appointment.id },
            { onSuccess: invalidate ? () => invalidate() : undefined }
        );
    };

    const handleChangeStatus = (i: typeof statusOptions[number]) => {
        update(
            {
                id: appointment.id,
                status: i.value as AppointmentStatus,
            },
            {
                onSuccess: () => {
                    invalidate && invalidate();
                    setStatus(i);
                },
            }
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
    const getStatusColor = () => {
        switch (appointment.status) {
            case "CONFIRMED": {
                return "bg-green-400";
            }
            case "PENDING": {
                return "bg-yellow-500";
            }
            case "DENIED": {
            }
            case "CANCELED": {
                return "bg-red-500";
            }
            default:
                return "bg-gray-300";
        }
    };

    return (
        <GridCard>
            <div className="relative mb-4 -mt-2 grid grid-cols-3 items-center gap-2 border-b py-2">
                <h4 className="col-span-1 flex-shrink-0 font-bold tracking-wide text-gray-600">
                    <span className="xl:hidden">Appt. {idx + 1}</span>
                    <span className="hidden xl:block">
                        Appointment {idx + 1}
                    </span>
                </h4>
                <div className="col-span-2 flex items-center">
                    <div className="relative flex-grow">
                        <div
                            aria-hidden="true"
                            className={clsx(
                                getStatusColor(),
                                "absolute top-[40%] -left-4 h-2 w-2 rounded-full"
                            )}
                        />

                        <Select
                            options={statusOptions}
                            selected={status}
                            setSelected={handleChangeStatus}
                            displayField="display"
                            className="max-h-[150px] pt-0"
                            containerClass="pt-0 sm:mt-0"
                        />
                    </div>
                    <div className="flex w-10 flex-shrink-0">
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
                </div>
            </div>
            <DetailsRow
                title="Date"
                value={formatDate(appointment.date, "MM/DD/YYYY")}
            />
            <DetailsRow title="Time" value={timeDisplay()} />
            <DetailsRow
                title="Address"
                value={appointment?.address}
                expand={expanded}
            />
            {appointment?.address_2 && (
                <DetailsRow
                    title="Building/Apt"
                    value={appointment?.address_2}
                    expand={expanded}
                />
            )}

            <div className="mt-2 grid w-full grid-cols-4 items-start ">
                <dt className="col-span-1 text-sm font-medium text-gray-700">
                    Contacts
                </dt>
                <ul
                    className={clsx(
                        expanded ? "overflow-auto" : "overflow-hidden",
                        "col-span-3 flex flex-wrap"
                    )}
                >
                    {appointment.contacts.map((contactOnAppointment) => (
                        <li
                            key={contactOnAppointment.id}
                            className={clsx(
                                !expanded && "truncate",
                                "mr-2 mt-2"
                            )}
                        >
                            <Link
                                href={`/workspace/${appointment.workspaceId}/contacts/${contactOnAppointment.contact.id}`}
                                passHref
                            >
                                <a>
                                    <Tag>
                                        <span className="hover:cursor-pointer hover:underline">
                                            {contactOnAppointment.contact.name}{" "}
                                            {contactOnAppointment?.profile
                                                ? `- ${contactOnAppointment.profile.name}`
                                                : null}
                                        </span>
                                    </Tag>
                                </a>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <DetailsRow
                title="Notes"
                value={appointment?.note}
                expand={expanded}
            />
            <div className="mt-2 flex w-full justify-center">
                <Button
                    variant="text"
                    className="mx-auto text-xs focus:outline-none focus:ring-0"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? "Show Less" : "Show More"}
                </Button>
            </div>
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
