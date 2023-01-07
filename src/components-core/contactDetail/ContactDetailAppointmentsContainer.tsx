import React from "react";
import { NextPageExtended } from "types/index";
import { ContactDetailLayout } from "./ContactDetailLayout";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/20/solid";
import { Button, ButtonLink } from "components-common/Button";
import { Tag } from "components-common/Tag";
import { useAppointments } from "hooks/useAppointments";
import { useRouter } from "next/router";
import { appointmentStatusOptions } from "utils/appointmentStatusOptions";

export const ContactDetailAppointmentsContainer: NextPageExtended = () => {
    const router = useRouter();
    const contactId = router.query.contactId;
    const { getAllForContact } = useAppointments();

    const { data: appointments } = getAllForContact(
        { contactId: contactId as string, take: 20 },
        { enabled: typeof contactId == "string" }
    );

    return (
        <ContactDetailLayout activeTab="Appointments">
            <div>
                <div className="flex">
                    {/* Search */}
                    <div className="mb-4 flex w-full max-w-md space-x-2">
                        <div className="w-full">
                            <label htmlFor="mobile-search" className="sr-only">
                                Search
                            </label>
                            <div className="relative rounded-md border border-gray-300 text-gray-700 shadow focus-within:text-gray-600">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MagnifyingGlassIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                </div>
                                <input
                                    id="mobile-search"
                                    className="block w-full rounded-md border border-transparent bg-white bg-opacity-20 py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-white focus:border-transparent focus:bg-opacity-100 focus:placeholder-gray-500 focus:outline-none focus:ring-0 sm:text-sm"
                                    placeholder="Search"
                                    type="search"
                                    name="search"
                                />
                            </div>
                        </div>
                        <Button variant="outlined" className="text-sm">
                            Search
                        </Button>
                    </div>
                    <div className="ml-auto">
                        <ButtonLink variant="primary" href="">
                            <PlusIcon className="-ml-1.5 mr-2 h-4 w-4" />
                            Add New
                        </ButtonLink>
                    </div>
                </div>
                {appointments && appointments.length > 0 ? (
                    <>
                        <ul className="space-y-4 pb-2">
                            {appointments.map((i, idx) => (
                                <li
                                    key={i.id}
                                    className="border border-gray-200 bg-white p-4 text-gray-800 shadow-md"
                                >
                                    {/*  <h4>{i.appointment.address} </h4> */}
                                    <div className="mt-2 flex  flex-col space-y-2">
                                        <div className="block space-y-1 lg:flex lg:items-center lg:space-x-1">
                                            <p className="font-medium">
                                                Address
                                            </p>
                                            <p className="text-gray-700">
                                                {i.appointment.address}
                                            </p>
                                        </div>

                                        <div className="block space-y-1 lg:grid lg:max-w-sm lg:grid-cols-2 lg:items-center lg:space-x-1">
                                            <p className="font-medium">
                                                Status
                                            </p>
                                            <p className="capitalize text-gray-700">
                                                {appointmentStatusOptions
                                                    .find(
                                                        (a) =>
                                                            a.value ==
                                                            i.appointment.status
                                                    )
                                                    ?.value.toLocaleLowerCase() ||
                                                    "No Status"}
                                            </p>
                                        </div>
                                        <div className="block space-y-1 lg:flex lg:items-center lg:space-x-1">
                                            <p className="font-medium">
                                                Created
                                            </p>
                                            <p className="text-gray-700">
                                                {i.createdAt.toDateString()}
                                            </p>
                                        </div>
                                        <div className="block space-y-1 lg:flex lg:items-center lg:space-x-1">
                                            <p className="font-medium">
                                                Contacts
                                            </p>
                                            <ul className="flex items-center">
                                                {i.appointment.contacts.map(
                                                    (contact) => (
                                                        <li
                                                            key={contact.id}
                                                            className="mr-2"
                                                        >
                                                            <Tag>
                                                                {
                                                                    contact
                                                                        .contact
                                                                        .name
                                                                }
                                                                {contact.profile
                                                                    ?.name &&
                                                                    ` - ${contact.profile?.name}`}
                                                            </Tag>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                /*  <AppointmentCard
                            appointment={i.appointment}
                            idx={idx}
                            key={i.id}
                        /> */
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
