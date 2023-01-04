import {
    ChevronRightIcon,
    MagnifyingGlassIcon,
    PaperClipIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Button, ButtonLink } from "components-common/Button";
import { NextLink } from "components-common/NextLink";
import { Tag } from "components-common/Tag";
import { useAppointments } from "hooks/useAppointments";
import { useWorkspace } from "hooks/useWorkspace";
import Link from "next/link";
import { appointmentStatusOptions } from "utils/appointmentStatusOptions";
import { formatTime } from "utils/formatTime";
import { isEmpty } from "../appointments-utils";

const AppointmentListVieww = () => {
    const { getAll } = useAppointments();
    const { id } = useWorkspace();

    const { data: appointments } = getAll({ workspaceId: id as string });

    const timeDisplay = (
        start: string | undefined | null,
        end: string | undefined | null
    ) => {
        const startTime = start ? formatTime(start) : undefined;
        if (startTime) {
            return end ? `${startTime} - ${formatTime(end)}` : startTime;
        }
        return undefined;
    };
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
                                className="block w-full rounded-md border border-transparent bg-white bg-opacity-20 py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-400 focus:border-transparent focus:bg-opacity-100 focus:placeholder-gray-500 focus:outline-none focus:ring-0 sm:text-sm"
                                placeholder="Search"
                                type="search"
                                name="search"
                                autoComplete="off"
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
                    <ul className="w-full pb-4">
                        {appointments.map((i) => (
                            <li
                                key={i.id}
                                className="mb-4 rounded-md border border-gray-200 bg-white shadow hover:bg-gray-50"
                            >
                                <NextLink
                                    href={`/workspace/${i.workspaceId}/appointments/${i.id}`}
                                    className="flex flex-1 items-center px-6  py-4 text-gray-800 lg:px-8 lg:py-6 "
                                >
                                    <div className="mt-2 flex  w-full flex-col">
                                        <div className="grid grid-cols-3 gap-x-4">
                                            <div className="col-span-2 block space-y-1">
                                                <p className="font-medium">
                                                    Address
                                                </p>
                                                <p className="text=sm text-gray-600">
                                                    {i.address}
                                                </p>
                                            </div>
                                            <div className="col-span-1 block space-y-1">
                                                <p className="font-medium">
                                                    Building/Apt
                                                </p>
                                                <p className="text-gray-600">
                                                    {i?.address_2 || "--"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-3 gap-x-4">
                                            <div className="col-span-2 block space-y-1">
                                                <p className="font-medium">
                                                    Time
                                                </p>
                                                <p className="text-gray-600">
                                                    {timeDisplay(
                                                        i.startTime,
                                                        i.endTime
                                                    ) || "--"}
                                                </p>
                                            </div>
                                            <div className="col-span-1 block space-y-1">
                                                <p className="font-medium">
                                                    Status
                                                </p>
                                                <p className="capitalize text-gray-600">
                                                    {appointmentStatusOptions
                                                        .find(
                                                            (a) =>
                                                                a.value ==
                                                                i.status
                                                        )
                                                        ?.value.toLocaleLowerCase()
                                                        .replace("_", " ") ||
                                                        "No Status"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 grid grid-cols-3 gap-x-4 ">
                                            <div className="col-span-2 block space-y-2">
                                                <p className="font-medium">
                                                    Contacts
                                                </p>
                                                <ul className="flex flex-wrap items-center gap-y-2 pb-2">
                                                    {i.contacts &&
                                                    !isEmpty(i.contacts) ? (
                                                        i.contacts?.map(
                                                            (contact) => (
                                                                <li
                                                                    key={
                                                                        contact.id
                                                                    }
                                                                    className="mr-2"
                                                                >
                                                                    <Tag>
                                                                        {
                                                                            contact
                                                                                .contact
                                                                                .displayName
                                                                        }
                                                                        {contact
                                                                            .profile
                                                                            ?.name &&
                                                                            ` - ${contact.profile?.name}`}
                                                                    </Tag>
                                                                </li>
                                                            )
                                                        )
                                                    ) : (
                                                        <span>--</span>
                                                    )}
                                                </ul>
                                            </div>
                                            <div className="col-span-1 block space-y-1">
                                                <p className="font-medium">
                                                    Notes
                                                </p>
                                                <p className=" truncate text-gray-600">
                                                    {i.note || "--"}
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className={clsx(
                                                !i.contacts ||
                                                    (i.contacts &&
                                                        i.contacts.length > 0)
                                                    ? "mt-5"
                                                    : "mt-0",
                                                " -mb-1 flex  justify-between text-sm italic"
                                            )}
                                        >
                                            <p>
                                                Created{" "}
                                                <span>
                                                    {i.createdAt.toDateString()}
                                                </span>
                                            </p>
                                            {i.createdAt.toDateString() !==
                                                i.updatedAt.toDateString() && (
                                                <p>
                                                    Updated{" "}
                                                    <span>
                                                        {i.updatedAt.toDateString()}
                                                    </span>
                                                </p>
                                            )}
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
export default AppointmentListVieww;
