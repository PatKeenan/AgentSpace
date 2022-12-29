import { GridCard } from "components-core/contactDetail/contact-detail-components/GridCard";
import { ToggleMenu } from "components-common/ToggleMenu";
import { useAppointmentsUI } from "../useAppointmentsUI";
import { TrashIcon } from "@heroicons/react/24/outline";
import { formatTime } from "utils/formatTime";

import type { Appointment } from "@prisma/client";
import clsx from "clsx";
import { AppointmentFormType } from "./AppointmentModal";

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
}) => {
    const { idx, appointment } = props;
    const { setModal } = useAppointmentsUI();

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
                            onClick: () => alert("yee"),
                        },
                    ]}
                />
            </div>
            <DetailsRow title="Address" value={appointment?.address} />
            <DetailsRow
                title="Status"
                value={appointment.status.toLowerCase()}
                detailsClassName="capitalize"
            />
            <DetailsRow
                title="Time"
                value={
                    appointment?.startTime && formatTime(appointment.startTime)
                }
            />
            <DetailsRow title="Notes" value={appointment?.note} />
        </GridCard>
    );
};

const DetailsRow = ({
    title,
    value,
    detailsClassName,
}: {
    title: string;
    value?: string | null;
    detailsClassName?: string;
}) => {
    return (
        <div className="mt-2 grid grid-cols-4">
            <dt className="col-span-1 text-sm font-medium text-gray-700">
                {title}
            </dt>
            <dd
                className={clsx(
                    "col-span-3 flex-wrap text-gray-600",
                    detailsClassName
                )}
            >
                {value || "---"}
            </dd>
        </div>
    );
};
