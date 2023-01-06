import {
    CheckCircleIcon,
    ChevronRightIcon,
    MagnifyingGlassIcon,
    PaperClipIcon,
} from "@heroicons/react/20/solid";
import { AppointmentStatus } from "@prisma/client";
import clsx from "clsx";
import { Button, ButtonLink } from "components-common/Button";
import { NextLink } from "components-common/NextLink";
import { Select } from "components-common/Select";
import { Tag } from "components-common/Tag";
import { useAppointments } from "hooks/useAppointments";
import { useWorkspace } from "hooks/useWorkspace";
import Link from "next/link";
import { appointmentStatusOptions } from "utils/appointmentStatusOptions";
import { formatStringToDate } from "utils/formatDate";
import { formatTime } from "utils/formatTime";
import { isEmpty, statusOptions } from "../appointments-utils";

const filterOptions = [
    { id: "1", name: "Address" },
    { id: "2", name: "Contacts" },
];

const AppointmentListView = () => {
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
            <div className="mt-4 block">
                {/* Search */}
                <div className="gird-cols-12 mb-4 grid ">
                    <div className="col-span-5 flex space-x-2">
                        <div className="max-w-sm">
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
                        <div>
                            <Select
                                options={filterOptions}
                                containerClass="h-full flex-shrink-0"
                                displayField="name"
                                selected={filterOptions[0]}
                                setSelected={() => alert()}
                            />
                        </div>
                    </div>
                    <div className="col-span-2 col-start-6 col-end-8">
                        <Select
                            label="Sort"
                            direction="row"
                            options={filterOptions}
                            containerClass="h-full flex-shrink-0"
                            displayField="name"
                            selected={filterOptions[0]}
                            setSelected={() => alert()}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-2 grid grid-cols-12  gap-4">
                <div className="col-span-9  overflow-hidden  bg-white sm:rounded-md">
                    <ul className="w-full space-y-2 pb-4">
                        {appointments?.map((i) => (
                            <li key={i.id} className="">
                                <NextLink
                                    href={"/"}
                                    className="block rounded-md border border-gray-200  hover:bg-gray-50"
                                >
                                    <Card
                                        key={i.id}
                                        address={i.address}
                                        date={i.date}
                                        time={timeDisplay(
                                            i.startTime,
                                            i.endTime
                                        )}
                                        status={i.status}
                                        contacts={i.contacts
                                            .flatMap((p) =>
                                                p.profile
                                                    ? `${p.contact.name} - ${p.profile.name}`
                                                    : `${p.contact.name}`
                                            )
                                            .join(", ")}
                                    />

                                    {/* <div className="flex items-center px-4 py-4 sm:px-6">
                                        <div className="flex min-w-0 flex-1 items-center">
                                            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                                <div>
                                                    <p className="truncate text-sm font-medium text-gray-900">
                                                        {i.address}
                                                    </p>
                                                    <p className="mt-2 flex items-center text-sm text-gray-500">
                                                        <span className="truncate">
                                                            {i.contacts
                                                                .flatMap((p) =>
                                                                    p.profile
                                                                        ? `${p.contact.name} - ${p.profile.name}`
                                                                        : `${p.contact.name}`
                                                                )
                                                                .join(", ")}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="hidden md:block">
                                                    <div>
                                                        <p className="text-sm text-gray-900">
                                                            <time
                                                                dateTime={
                                                                    i.date
                                                                }
                                                            >
                                                                {i.date}
                                                                {timeDisplay(
                                                                    i.startTime,
                                                                    i.endTime
                                                                ) &&
                                                                    ` at ${timeDisplay(
                                                                        i.startTime,
                                                                        i.endTime
                                                                    )}`}
                                                            </time>
                                                        </p>
                                                        <p className="mt-2 flex items-center text-sm text-gray-500">
                                                            <div
                                                                className="mr-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-green-400"
                                                                aria-hidden="true"
                                                            />
                                                            {i.status}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <ChevronRightIcon
                                                className="h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div> */}
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
                                    {appointments?.length}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium">
                                    {appointments?.length}
                                </span>{" "}
                                results
                            </p>
                        </div>
                        <div className="flex flex-1 justify-between space-x-2 sm:justify-end">
                            <Button variant="outlined">Previous</Button>
                            <Button variant="outlined">Next</Button>
                        </div>
                    </nav>
                </div>
                <div className="col-span-3">
                    <div>
                        <h5 className="border-b pb-1 text-gray-700">
                            Appointment Status
                        </h5>
                        <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                name="confirmed"
                                defaultChecked={true}
                            />
                            <label htmlFor="">Confirmed</label>
                        </div>
                        <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                name="confirmed"
                                defaultChecked={true}
                            />
                            <label htmlFor="">Pending</label>
                        </div>
                        <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                name="confirmed"
                                defaultChecked={true}
                            />
                            <label htmlFor="">Canceled</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AppointmentListView;

function thisOrThat<T, U>(arg1: T, arg2: U) {
    if (!arg1) return arg2;
    if (typeof arg1 == "object") {
        return Object.keys(arg1).length == 0 ? arg2 : arg1;
    }
    return arg1;
}

const statusColors: { [Key in AppointmentStatus]: string } = {
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELED: "bg-red-100 text-red-800",
    DENIED: "bg-red-100 text-red-800",
    NO_STATUS: "bg-gray-100 text-gray-800",
    PENDING: "bg-yellow-100 text-yellow-800",
};
const Card = ({
    address,
    date,
    time,
    status,
    contacts,
}: {
    address?: string;
    date?: string;
    time?: string;
    status?: AppointmentStatus;
    contacts?: string;
}) => {
    const statusDisplay = statusOptions.find((a) => a.value == status)?.display;

    return (
        <div className="group block px-4 py-6 text-gray-600 hover:text-gray-800">
            <div className="grid max-w-2xl grid-cols-3 gap-4">
                <div className=" col-span-2 block ">
                    <h4 className="text-sm font-medium">Address</h4>
                    <p className="mt-1 break-words text-sm">
                        {thisOrThat(address, "--")}
                    </p>
                </div>
                <div className="col-span-1 block">
                    <h4 className="text-sm font-medium">Date</h4>
                    <p className="mt-1 truncate text-sm">
                        {date ? formatStringToDate(date)?.toDateString() : "--"}
                    </p>
                </div>
            </div>

            <div className="mt-3 grid max-w-2xl grid-cols-3 gap-4">
                <div className="col-span-2">
                    <h4 className=" text-sm font-medium">Time</h4>
                    <p className="mt-1 truncate text-sm">
                        {thisOrThat(time, "--")}
                    </p>
                </div>
                <div className="col-span-1">
                    <h4 className=" text-sm font-medium">Status</h4>
                    <p className="mt-1 truncate text-sm capitalize">
                        <span
                            className={clsx(
                                status && statusColors[status],
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                            )}
                        >
                            {thisOrThat(statusDisplay, "--")}
                        </span>
                    </p>
                </div>
            </div>

            {contacts && (
                <div className="mt-2">
                    <h4 className=" text-sm font-medium">Contacts</h4>
                    <p className="mt-1 truncate text-sm">
                        {thisOrThat(contacts, "--")}
                    </p>
                </div>
            )}
        </div>
    );
};
