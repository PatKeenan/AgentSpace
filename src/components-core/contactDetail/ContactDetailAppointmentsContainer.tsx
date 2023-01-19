import { NextPageExtended } from "types/index";
import { TextDropDownMenu } from "components-common/TextDropDownMenu";
import { formatDate } from "utils/formatDate";
import { AppointmentSortSchema } from "server/schemas";
import { Button, ButtonLink } from "components-common/Button";
import { useAppointments } from "hooks/useAppointments";
import { useRouter } from "next/router";
import { ContactDetailLayout } from "./contact-detail-components/ContactDetailLayout";
import { NextLink } from "components-common/NextLink";
import { ListViewAppointmentCard } from "components-core/appointments/appointments-components";
import { timeDisplay } from "utils/formatTime";
import * as React from "react";

export const ContactDetailAppointmentsContainer: NextPageExtended = () => {
    const [sort, setSort] = React.useState<AppointmentSortSchema>({
        field: "createdAt",
        order: "desc",
    });

    const sortOptions = [
        {
            name: "Created At",
            onClick: () => setSort({ field: "createdAt", order: "desc" }),
            current: sort.field == "createdAt",
        },
        {
            name: "Updated At",
            onClick: () => setSort({ field: "updatedAt", order: "desc" }),
            current: sort.field == "updatedAt",
        },

        {
            name: "Date",
            onClick: () => setSort({ field: "date", order: "desc" }),
            current: sort.field == "date",
        },
    ];
    const orderOptions = [
        {
            name: "Descending",
            onClick: () => setSort({ ...sort, order: "desc" }),
            current: sort.order == "desc",
        },
        {
            name: "Ascending",
            onClick: () => setSort({ ...sort, order: "asc" }),
            current: sort.order == "asc",
        },
    ];

    const router = useRouter();
    const contactId = router.query.contactId;
    const { getAllForContact } = useAppointments();

    const { data: appointments } = getAllForContact(
        {
            contactId: contactId as string,
            take: 20,
            order: sort.order,
            field: sort.field,
        },
        { enabled: typeof contactId == "string" }
    );

    return (
        <ContactDetailLayout activeTab="Appointments">
            <div>
                <div className="mb-4 flex items-center">
                    {/* Sort/Status */}
                    <div className="flex-grow space-x-8">
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

                    <div className="ml-auto">
                        <ButtonLink variant="primary" href="" actionIcon="add">
                            Add New
                        </ButtonLink>
                    </div>
                </div>
                {appointments && appointments.length > 0 ? (
                    <>
                        <ul className="space-y-4 pb-2">
                            {appointments.map(({ appointment }) => (
                                <li key={appointment.id} className="">
                                    <NextLink
                                        href={"/"}
                                        className="block rounded-md border border-gray-200  hover:bg-gray-50"
                                    >
                                        <ListViewAppointmentCard
                                            key={appointment.id}
                                            address={appointment.address}
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
                                            notes={appointment.note || ""}
                                            address_2={
                                                appointment.address_2 || ""
                                            }
                                            createdAt={formatDate(
                                                appointment.createdAt,
                                                "MM/DD/YYYY"
                                            )}
                                        />
                                    </NextLink>
                                </li>
                            ))}
                        </ul>
                        <nav
                            className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
                            aria-label="Pagination"
                        >
                            <div className="hidden sm:block">
                                <p className="text-sm text-gray-700">
                                    Showing{" "}
                                    <span className="font-medium">1</span> to{" "}
                                    <span className="font-medium">
                                        {appointments.length}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-medium">
                                        {appointments.length}
                                    </span>{" "}
                                    results
                                </p>
                            </div>
                            <div className="flex flex-1 justify-between space-x-2 sm:justify-end">
                                <Button variant="outlined">Previous</Button>
                                <Button variant="outlined">Next</Button>
                            </div>
                        </nav>
                    </>
                ) : null}
            </div>
        </ContactDetailLayout>
    );
};

ContactDetailAppointmentsContainer.layout = "dashboard";
ContactDetailAppointmentsContainer.subLayout = "contact";
