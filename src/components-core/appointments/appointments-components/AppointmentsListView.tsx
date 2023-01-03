import {
    ChevronRightIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { Button, ButtonLink } from "components-common/Button";
import { NextLink } from "components-common/NextLink";
import { Tag } from "components-common/Tag";
import { useAppointments } from "hooks/useAppointments";
import { useWorkspace } from "hooks/useWorkspace";
import Link from "next/link";
import { appointmentStatusOptions } from "utils/appointmentStatusOptions";

const ContactDetailAppointments = () => {
    const { getAll } = useAppointments();
    const { id } = useWorkspace();

    const { data: appointments } = getAll({ workspaceId: id as string });

    return (
        <div className="px-2">
            <div className="mt-4 flex">
                {/* Search */}
                <div className="mb-4 mr-auto flex w-full max-w-md space-x-2">
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
            </div>
            {appointments && appointments.length > 0 ? (
                <>
                    <ul className=" divide-y pb-2">
                        {appointments.map((i) => (
                            <li key={i.id}>
                                <NextLink
                                    href=""
                                    className=" flex flex-1 items-center bg-white p-4 text-gray-800 hover:bg-gray-50"
                                >
                                    <div className="mt-2 flex  w-full flex-col space-y-2">
                                        <div className="block space-y-1 lg:flex lg:items-center lg:space-x-1">
                                            <p className="font-medium">
                                                Address
                                            </p>
                                            <p className="text-gray-700">
                                                {i.address}
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
                                                            a.value == i.status
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
                                                {i.contacts.map((contact) => (
                                                    <li
                                                        key={contact.id}
                                                        className="mr-2"
                                                    >
                                                        <Tag>
                                                            {
                                                                contact.contact
                                                                    .displayName
                                                            }
                                                            {contact.profile
                                                                ?.name &&
                                                                ` - ${contact.profile?.name}`}
                                                        </Tag>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="sr-only">
                                            View Appointment
                                        </span>
                                        <ChevronRightIcon className="h-6 w-6 text-gray-600 hover:text-gray-700" />
                                    </div>
                                </NextLink>
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
                                Showing <span className="font-medium">1</span>{" "}
                                to{" "}
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
    );
};

export default ContactDetailAppointments;
