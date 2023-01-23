import { CalendarIcon, MapPinIcon } from "@heroicons/react/20/solid";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useWorkspace } from "hooks/useWorkspace";
import {
    Button,
    Breadcrumb,
    SectionHeading,
    PageBody,
    Tag,
    NextLink,
    Modal,
    ModalTitle,
    FieldGroup,
    NewInputGroup,
} from "components-common";
import { useRouter } from "next/router";
import * as React from "react";
import { AppointmentDetailList } from "./appointment-detail-components";
import dynamic from "next/dynamic";
import type { AppointmentFormState } from "./types";
import { useAppointments } from "hooks/useAppointments";
import { GridSectionTitle } from "components-core/contactDetail";

const AppointmentsMap = dynamic(
    () => import("../appointments/appointments-components/AppointmentsMap"),
    {
        ssr: false,
    }
);
import { AppointmentSingleton, type AppointmentSingletonType } from "lib";
import { format } from "date-fns";
import { formatStringToDate } from "utils/formatDate";
import { formatTime } from "utils/formatTime";
import {
    statusColorsLight,
    statusDisplay,
} from "components-core/appointments/appointments-utils";
import clsx from "clsx";
import Link from "next/link";
import { FormSections } from "types/index";
import {
    AppointmentForm,
    AppointmentFormType,
} from "components-core/appointments/appointments-components/AppointmentForm";
import { trpc } from "utils/trpc";
import { useAppointmentFormStore } from "components-core/appointments/appointments-components";

const { appointmentFormFields } = AppointmentSingleton;

const { date, address, address_2, contacts, startTime, endTime, status, note } =
    appointmentFormFields;

const fields = [
    status,
    date,
    address,
    address_2,
    contacts,
    startTime,
    endTime,
    note,
];

export const AppointmentDetailContainer = () => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const { setCallback } = useAppointmentFormStore();
    const router = useRouter();

    const { getOne } = useAppointments();
    const utils = trpc.useContext();
    const { data: appointment } = getOne(
        { id: router.query.appointmentId as string },
        { enabled: typeof router.query.appointmentId === "string" }
    );

    const invalidate = React.useCallback(() => {
        utils.appointment.getOne
            .invalidate({
                id: router.query.appointmentId as string,
            })
            .then(() => setModalOpen(false));
    }, [router.query.appointmentId]);

    React.useEffect(() => {
        setCallback(invalidate);
        return () => setCallback(undefined);
    }, [router.query.appointmentId]);

    const workspace = useWorkspace();
    const appointmentId = router.query.appointmentId;
    const breadCrumbItems = [
        {
            title: "Appointments",
            href: `/workspace/${workspace.id}/appointments`,
            active: false,
        },
        {
            title: appointmentId as string,
            href: `/workspace/${workspace.id}/appointments/${appointmentId}`,
            active: true,
        },
    ];

    // switch statement to handle formatting the fields in the appointment data
    function formatField(field: typeof fields[number], value: string) {
        switch (field.name) {
            case "date":
                return format(formatStringToDate(value) || new Date(), "PP");
            case "startTime":
            case "endTime":
                return formatTime(value) || "--";
            case "status":
                return (
                    <span
                        className={clsx(
                            statusColorsLight[
                                value as keyof typeof statusColorsLight
                            ],
                            "order-1 inline-flex items-center truncate rounded-md px-2 py-1 text-xs font-medium capitalize md:-ml-2"
                        )}
                    >
                        {statusDisplay(
                            value as AppointmentSingletonType["appointmentSchemas"]["base"]["status"]
                        )}
                    </span>
                );

            default:
                return value;
        }
    }
    // format contacts array from appointment data to match the format of the contacts array in the form
    const formattedContacts = appointment?.contacts.map(
        (contactOnAppointment) => ({
            contactOnAppointmentId: contactOnAppointment.id,
            contactId: contactOnAppointment.contact.id,
            name: contactOnAppointment.contact.name,
            profileName: contactOnAppointment.profile?.name || undefined,
            selectedProfileId: contactOnAppointment.profile?.id || undefined,
        })
    );

    const appointmentData: AppointmentFormType & { id: string } = {
        address: appointment?.address || "",
        address_2: appointment?.address_2 || "",
        contacts: formattedContacts || [],
        date: appointment?.date || "",
        endTime: appointment?.endTime || "",
        id: appointment?.id || "",
        note: appointment?.note || "",
        startTime: appointment?.startTime || "",
        status: appointment?.status,
    };

    return (
        <>
            <EditAppointmentModal
                appointmentData={appointmentData}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
            <Breadcrumb items={breadCrumbItems} />
            <PageBody fullHeight>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>
                            Appointment Details
                        </SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                </SectionHeading>

                <div className="flex flex-grow flex-col-reverse p-1  pb-8 lg:mt-4 lg:grid lg:grid-cols-12 lg:gap-x-4">
                    <div className=" mt-4 h-2/3 lg:col-span-7 lg:h-full">
                        <div className="">
                            <div className="w-full">
                                <GridSectionTitle
                                    title="Appointment Details"
                                    subTitle="People that are associated with each other."
                                    actions={
                                        <Button
                                            variant="outlined"
                                            type="button"
                                            onClick={() => setModalOpen(true)}
                                            actionIcon="edit"
                                        >
                                            Edit
                                        </Button>
                                    }
                                />
                            </div>
                            <dl className="divide-y divide-gray-200">
                                {appointment &&
                                    fields.map((field) => (
                                        <div
                                            className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5"
                                            key={field.name}
                                        >
                                            <dt className="text-sm font-medium text-gray-500">
                                                {field.label}
                                            </dt>
                                            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {field.name !== "contacts" &&
                                                    field.name !== "status" && (
                                                        <span className="flex-grow">
                                                            {formatField(
                                                                field,
                                                                appointment[
                                                                    field.name
                                                                ] || "--"
                                                            )}
                                                        </span>
                                                    )}
                                                {field.name == "status" &&
                                                    formatField(
                                                        field,
                                                        appointment[
                                                            field.name
                                                        ] || "--"
                                                    )}
                                                {field.name === "contacts" && (
                                                    <ul className="h-full space-y-4 overflow-auto pb-4 text-sm leading-6">
                                                        {appointment?.contacts.map(
                                                            ({
                                                                id,
                                                                contact,
                                                                profile,
                                                            }) => (
                                                                <li
                                                                    key={id}
                                                                    className="relative lg:mx-2"
                                                                >
                                                                    <Link
                                                                        href={`/workspace/${appointment.workspaceId}/contacts/${contact.id}`}
                                                                        passHref
                                                                    >
                                                                        <a>
                                                                            <Tag>
                                                                                <span className="hover:cursor-pointer hover:underline">
                                                                                    {
                                                                                        contact.name
                                                                                    }
                                                                                    {profile &&
                                                                                        ` - ${profile.name}`}
                                                                                </span>
                                                                            </Tag>
                                                                        </a>
                                                                    </Link>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                )}
                                            </dd>
                                        </div>
                                    ))}
                            </dl>
                        </div>
                    </div>
                    <div className="relative mt-4 h-1/3 lg:col-start-8 lg:col-end-13 lg:h-full">
                        <AppointmentsMap
                            appointments={appointment ? [appointment] : []}
                        />
                    </div>
                </div>
            </PageBody>
        </>
    );
};

AppointmentDetailContainer.layout = "dashboard";

type EditAppointmentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    appointmentData: AppointmentFormType & { id: string };
};

const EditAppointmentModal = (props: EditAppointmentModalProps) => {
    const { isOpen, onClose, appointmentData } = props;

    return (
        <Modal open={isOpen} onClose={onClose}>
            <AppointmentForm defaultData={appointmentData} />
        </Modal>
    );
};
