import { NextPageExtended } from "types/index";
import { TextDropDownMenu } from "components-common/TextDropDownMenu";
import { formatDate } from "utils/formatDate";
import { AppointmentSortSchema } from "server/schemas";
import { Button } from "components-common/Button";
import { useAppointments } from "hooks/useAppointments";
import { useRouter } from "next/router";
import { ContactDetailLayout } from "./contact-detail-components/ContactDetailLayout";
import { ListViewAppointmentCard } from "components-core/appointments/appointments-components";
import { timeDisplay } from "utils/formatTime";
import * as React from "react";
import Link from "next/link";
import { Modal } from "components-common/Modal";
import { AppointmentForm } from "components-core/appointments/appointments-components/AppointmentForm";
import SelectProfileForm from "./contact-detail-components/SelectProfileForm";
import { trpc } from "utils/trpc";

import { TruckIcon } from "@heroicons/react/20/solid";
import { NoData } from "components-common/NoData";
import { isEmpty } from "utils/isEmpty";

import type { AppointmentSingletonType } from "lib";
import { GridSectionTitle } from "./contact-detail-components";
import { Pagination } from "components-common/Pagination";

export const ContactDetailAppointmentsContainer: NextPageExtended = () => {
    const take = 10;
    const [sort, setSort] = React.useState<AppointmentSortSchema>({
        field: "createdAt",
        order: "desc",
    });
    const [page, setPage] = React.useState(1);
    const [modalOpen, setModalOpen] = React.useState(false);

    const utils = trpc.useContext();

    const [form, setForm] = React.useState<
        | { name: "selectProfile" }
        | {
              name: "addAppointment";
              data: AppointmentSingletonType["appointmentSchemas"]["extendedContactOnAppointmentSchema"];
          }
    >({ name: "selectProfile" });

    const sortOptions = [
        {
            name: "Created At",
            onClick: () => {
                setPage(1);
                setSort({ field: "createdAt", order: "desc" });
            },
            current: sort.field == "createdAt",
        },
        {
            name: "Updated At",
            onClick: () => {
                setPage(1);
                setSort({ field: "updatedAt", order: "desc" });
            },
            current: sort.field == "updatedAt",
        },

        {
            name: "Date",
            onClick: () => {
                setPage(1);
                setSort({ field: "date", order: "desc" });
            },
            current: sort.field == "date",
        },
    ];
    const orderOptions = [
        {
            name: "Descending",
            onClick: () => {
                setPage(1);
                setSort({ ...sort, order: "desc" });
            },
            current: sort.order == "desc",
        },
        {
            name: "Ascending",
            onClick: () => {
                setPage(1);
                setSort({ ...sort, order: "asc" });
            },
            current: sort.order == "asc",
        },
    ];

    const router = useRouter();
    const contactId = router.query.contactId;
    const { getAllForContact } = useAppointments();

    const contactName = utils.contacts.getName.getData({
        id: contactId as string,
    });

    const { data, isLoading } = getAllForContact(
        {
            contactId: contactId as string,
            page: page,
            take: take,
            order: sort.order,
            field: sort.field,
        },
        { enabled: typeof contactId == "string", refetchOnWindowFocus: false }
    );
    const appointments = data && data.length == 2 ? data[0] : [];
    const totalAppointments = data && data.length == 2 ? data[1] : 0;

    const handleClose = () => {
        setModalOpen(false);
        setForm({ name: "selectProfile" });
    };

    const handleContinue = (
        data: AppointmentSingletonType["appointmentSchemas"]["extendedContactOnAppointmentSchema"]
    ) => {
        setForm({ name: "addAppointment", data });
    };

    const handleSuccess = () => {
        utils.appointment.getAllForContact.invalidate({
            contactId: contactId as string,
            take,
            page: page,
            order: sort.order,
            field: sort.field,
        });
        handleClose();
    };

    return (
        <>
            <Modal open={modalOpen} onClose={handleClose}>
                {modalOpen && form.name == "selectProfile" ? (
                    <SelectProfileForm
                        onCancel={handleClose}
                        contactId={contactId as string}
                        contactName={contactName?.name || ""}
                        onContinue={handleContinue}
                    />
                ) : null}
                {modalOpen && form.name == "addAppointment" ? (
                    <AppointmentForm
                        onSuccess={handleSuccess}
                        onCancel={handleClose}
                        defaultContact={form.data}
                    />
                ) : null}
            </Modal>
            <ContactDetailLayout activeTab="Appointments">
                <div>
                    <GridSectionTitle
                        titleIcon={
                            appointments ? (
                                <div className="flex h-5 w-5 justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                                    <span className="my-auto">
                                        {totalAppointments}
                                    </span>
                                </div>
                            ) : null
                        }
                        title="Appointments"
                        subTitle="Appointments associated with this contact."
                        actions={
                            <Button
                                variant="primary"
                                onClick={() => setModalOpen(true)}
                                actionIcon="add"
                                type="button"
                            >
                                Add New
                            </Button>
                        }
                    />

                    {/* Sort/Status */}
                    {appointments && appointments.length > 0 ? (
                        <div className="mb-4 flex-grow space-x-8">
                            <TextDropDownMenu
                                options={sortOptions}
                                displayField="name"
                                title="Sort By"
                            />
                            <TextDropDownMenu
                                options={orderOptions}
                                displayField="name"
                                title="Order"
                            />
                        </div>
                    ) : null}

                    {!isLoading && isEmpty(appointments) ? (
                        <NoData
                            icon={TruckIcon}
                            className="h-[60vh]"
                            title="No Appointments"
                            message="Start by adding an appointment."
                        />
                    ) : (
                        <>
                            <ul className="pb-2">
                                {appointments?.map(({ appointment }) => (
                                    <li key={appointment.id} className="">
                                        <Link
                                            href={`/workspace/${appointment.workspaceId}/appointments/${appointment.id}`}
                                            passHref
                                        >
                                            <a>
                                                <ListViewAppointmentCard
                                                    key={appointment.id}
                                                    address={
                                                        appointment.address
                                                    }
                                                    date={appointment.date}
                                                    time={timeDisplay(
                                                        appointment.startTime,
                                                        appointment.endTime
                                                    )}
                                                    status={appointment.status}
                                                    contacts={appointment.contacts
                                                        .flatMap((p) =>
                                                            p.profile
                                                                ? `${p.contact.name} - ${p.profile.name}`
                                                                : `${p.contact.name}`
                                                        )
                                                        .join(", ")}
                                                    notes={
                                                        appointment.note || ""
                                                    }
                                                    address_2={
                                                        appointment.address_2 ||
                                                        ""
                                                    }
                                                    createdAt={formatDate(
                                                        appointment.createdAt,
                                                        "MM/DD/YYYY"
                                                    )}
                                                />
                                            </a>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            {appointments && appointments.length > 0 ? (
                                <Pagination
                                    onPaginate={(newPage) => setPage(newPage)}
                                    totalItems={totalAppointments}
                                    currentPage={page || 1}
                                    itemsPerPage={take}
                                    currentResultsLength={
                                        appointments?.length || 0
                                    }
                                />
                            ) : null}
                        </>
                    )}
                </div>
            </ContactDetailLayout>
        </>
    );
};

ContactDetailAppointmentsContainer.layout = "dashboard";
ContactDetailAppointmentsContainer.subLayout = "contact";
