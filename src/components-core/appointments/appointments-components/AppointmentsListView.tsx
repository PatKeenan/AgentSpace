import {
    CheckCircleIcon,
    ChevronRightIcon,
    MagnifyingGlassIcon,
    PaperClipIcon,
    PlusIcon,
} from "@heroicons/react/20/solid";
import { AppointmentStatus } from "@prisma/client";
import clsx from "clsx";
import { Button, ButtonLink, IconButton } from "components-common/Button";
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
                    {/* <div className="col-span-2 col-start-6 col-end-8">
                        <Select
                            label="Sort"
                            direction="row"
                            options={filterOptions}
                            containerClass="h-full flex-shrink-0"
                            displayField="name"
                            selected={filterOptions[0]}
                            setSelected={() => alert()}
                        />
                    </div> */}
                </div>
            </div>
            <div className="mt-2 block grid-cols-12 gap-4 lg:grid">
                <div className="col-span-9 overflow-hidden  bg-white sm:rounded-md">
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
                                        notes={i.note || ""}
                                        address_2={i.address_2 || ""}
                                    />
                                </NextLink>
                            </li>
                        ))}
                    </ul>
                    <nav
                        className="flex items-center justify-between border-t border-gray-200 bg-white py-3 "
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
                <div className="hidden md:col-span-3 lg:block">
                    <div>
                        <h5 className="border-b pb-1 text-gray-700">Status</h5>
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
    address_2,
    date,
    time,
    status,
    contacts,
    notes,
}: {
    address?: string;
    address_2?: string;
    date?: string;
    time?: string;
    status?: AppointmentStatus;
    contacts?: string;
    notes?: string;
}) => {
    const statusDisplay = statusOptions.find((a) => a.value == status)?.display;

    return (
        <div className="group block p-6 text-gray-500  hover:text-gray-800">
            <div className="flex flex-1">
                <div className="flex-grow">
                    <div className="mb-3 -mt-2.5 w-full">
                        <p
                            className={clsx(
                                status && statusColors[status],
                                "-ml-2 inline-flex items-center truncate rounded-md px-2 py-1 text-xs font-medium capitalize"
                            )}
                        >
                            {thisOrThat(statusDisplay, "--")}
                        </p>
                    </div>
                    <div className="grid max-w-2xl grid-cols-3 gap-4">
                        <div className=" col-span-2 block ">
                            <h4 className="text-sm font-medium text-gray-700">
                                Address
                            </h4>
                            <p className="mt-1 max-w-sm truncate text-sm">
                                {thisOrThat(address, "--")}
                            </p>
                        </div>
                        <div className="col-span-1 block ">
                            <h4 className="text-sm font-medium text-gray-700">
                                Building/Apt
                            </h4>
                            <p className="mt-1 break-words text-sm">
                                {thisOrThat(address_2, "--")}
                            </p>
                        </div>
                    </div>

                    <div className="mt-3 grid max-w-2xl grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <h4 className=" text-sm font-medium text-gray-700">
                                Time
                            </h4>
                            <p className="mt-1 truncate text-sm">
                                {thisOrThat(time, "--")}
                            </p>
                        </div>
                        <div className="col-span-1 block">
                            <h4 className="text-sm font-medium text-gray-700">
                                Date
                            </h4>
                            <p className="mt-1 truncate text-sm">
                                {date
                                    ? formatStringToDate(date)?.toDateString()
                                    : "--"}
                            </p>
                        </div>
                    </div>
                    <div className="mt-3 grid max-w-2xl grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <h4 className=" text-sm font-medium text-gray-700">
                                Contacts
                            </h4>
                            <p className="mt-1 truncate text-sm">
                                {thisOrThat(contacts, "--")}
                            </p>
                        </div>
                        <div className="col-span-1 block">
                            <h4 className="text-sm font-medium text-gray-700">
                                Notes
                            </h4>
                            <p className="mt-1 truncate text-sm ">
                                {thisOrThat(notes, "--")}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="-mr-3 flex flex-shrink-0">
                    <div className="my-auto">
                        <IconButton
                            title="View"
                            icon={ChevronRightIcon}
                            textColor="text-gray-600 group-hover:text-gray-700"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
