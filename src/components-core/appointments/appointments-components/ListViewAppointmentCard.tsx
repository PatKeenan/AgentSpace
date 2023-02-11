import {
    ChevronRightIcon,
    ClockIcon,
    HomeIcon,
    UserGroupIcon,
} from "@heroicons/react/20/solid";
import { AppointmentStatus } from "@prisma/client";
import clsx from "clsx";
import { IconButton } from "components-common/Button";

import { formatStringToDate } from "utils/formatDate";
import { statusColorsLight, statusDisplay } from "../appointments-utils";
import { AppointmentSingleton } from "lib";
import { format } from "date-fns";
import { Card } from "components-common/Card";

function thisOrThat<T, U>(arg1: T, arg2: U) {
    if (!arg1) return arg2;
    if (typeof arg1 == "object") {
        return Object.keys(arg1).length == 0 ? arg2 : arg1;
    }
    return arg1;
}

const { appointmentFormFields } = AppointmentSingleton;

export const ListViewAppointmentCard = ({
    address,
    address_2,
    date,
    time,
    status,
    contacts,
    notes,
    createdAt,
}: {
    address?: string;
    address_2?: string;
    date?: string;
    time?: string;
    status?: AppointmentStatus;
    contacts?: string;
    notes?: string;
    createdAt?: string;
}) => {
    return (
        <Card
            className={clsx(
                createdAt
                    ? "mt-3 px-2 pb-4 md:px-6 md:pt-6 md:pb-8 lg:pb-6"
                    : "p-3 md:p-6",
                "text-sm"
            )}
        >
            <div className="flex flex-auto p-1 md:hidden">
                <div className="relative max-w-md flex-grow space-y-2 overflow-hidden">
                    <div className="relative flex items-center space-x-4 pb-2">
                        <h3 className="text-md font-semibold text-gray-600">
                            {date
                                ? format(
                                      formatStringToDate(date) || new Date(),
                                      "PP"
                                  )
                                : "--"}
                        </h3>
                        <span
                            className={clsx(
                                status && statusColorsLight[status],
                                "capitalize",
                                "top-0 right-0 rounded-md px-2 py-1 text-xs md:absolute"
                            )}
                        >
                            {statusDisplay(status)}
                        </span>
                    </div>

                    {time && (
                        <div className="flex items-center  text-gray-500">
                            <ClockIcon className="mr-2 h-4 w-4 text-gray-400" />
                            <span className="truncate">
                                {thisOrThat(time, "--")}
                            </span>
                        </div>
                    )}

                    {address && (
                        <div className="flex space-x-2">
                            <div className="flex flex-grow  items-center overflow-hidden text-gray-500">
                                <HomeIcon className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                                <span className="overflow-ellipsis line-clamp-2">
                                    {thisOrThat(address, "--")}
                                </span>
                            </div>
                            {address_2 && (
                                <div className="block border-l border-l-gray-300 pl-4 md:flex md:border-0">
                                    <h4 className=" pb-2 font-medium text-gray-600">
                                        Apt/Bldg.
                                    </h4>
                                    <span className="">
                                        {thisOrThat(address_2, "")}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    {contacts && contacts.length > 0 && (
                        <div className="flex items-center  text-gray-500">
                            <UserGroupIcon className="mr-2 h-4 w-4 text-gray-400" />
                            <span className="truncate">
                                {thisOrThat(contacts, "--")}
                            </span>
                        </div>
                    )}
                </div>
                <div className="ml-auto flex flex-shrink-0 items-center px-4">
                    <button>
                        <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Larger Screens */}
            <div className="hidden flex-1 md:flex">
                <div className="flex-grow">
                    <div className="mb-3 flex w-full items-center justify-end md:-mt-2.5 md:justify-start">
                        <p
                            className={clsx(
                                status && statusColorsLight[status],
                                "order-1 -ml-1 inline-flex items-center truncate rounded-md px-2 py-1 text-xs font-medium capitalize md:-ml-2"
                            )}
                        >
                            {thisOrThat(statusDisplay(status), "--")}
                        </p>
                    </div>
                    <ResponsiveGroup className="-mt-8 md:-mt-0">
                        <div className="grid grid-cols-5 md:block">
                            <FormFieldTitle className="col-span-1">
                                {appointmentFormFields.date.label}
                            </FormFieldTitle>
                            <p className="col-span-4 truncate">
                                {date
                                    ? format(
                                          formatStringToDate(date) ||
                                              new Date(),
                                          "PP"
                                      )
                                    : "--"}
                            </p>
                        </div>
                        <div className="grid grid-cols-5 md:block">
                            <FormFieldTitle className="col-span-1">
                                Time
                            </FormFieldTitle>
                            <p className="col-span-4 truncate ">
                                {thisOrThat(time, "--")}
                            </p>
                        </div>
                    </ResponsiveGroup>

                    <ResponsiveGroup singleItem={!address_2}>
                        <div className="grid grid-cols-5 md:block">
                            <FormFieldTitle className="col-span-1">
                                {appointmentFormFields.address.label}
                            </FormFieldTitle>
                            <p className="col-span-4 max-w-lg line-clamp-2">
                                {thisOrThat(address, "--")}
                            </p>
                        </div>
                        {address_2 && (
                            <div className="grid grid-cols-5 md:block">
                                <FormFieldTitle className="col-span-1">
                                    {appointmentFormFields.address_2.label}
                                </FormFieldTitle>
                                <p className="col-span-4 break-words">
                                    {thisOrThat(address_2, "--")}
                                </p>
                            </div>
                        )}
                    </ResponsiveGroup>
                    <ResponsiveGroup>
                        <div className="grid grid-cols-5 md:block">
                            <FormFieldTitle className="col-span-1">
                                {appointmentFormFields.contacts.label}
                            </FormFieldTitle>
                            <p className="col-span-4">
                                {thisOrThat(contacts, "--")}
                            </p>
                        </div>

                        <div className="hidden md:block">
                            <FormFieldTitle>
                                {appointmentFormFields.note.label}
                            </FormFieldTitle>
                            <p className="truncate">
                                {thisOrThat(notes, "--")}
                            </p>
                        </div>
                    </ResponsiveGroup>
                </div>
                <div className="-mr-3 hidden flex-shrink-0 md:flex">
                    <div className="my-auto">
                        <IconButton
                            title="View"
                            icon={ChevronRightIcon}
                            textColor="text-gray-600 group-hover:text-gray-700"
                        />
                    </div>
                </div>
            </div>

            {createdAt && (
                <p className="absolute left-6 bottom-2 hidden text-xs md:left-auto md:right-5 md:block">
                    Created {createdAt}
                </p>
            )}
        </Card>
    );
};
const ResponsiveGroup = ({
    singleItem = false,
    className,
    ...props
}: {
    singleItem?: boolean;
} & React.ComponentProps<"div">) => {
    return (
        <div
            className={clsx(
                className,
                singleItem
                    ? "[&>div:nth-child(odd)]:col-span-5 md:[&>div:nth-child(odd)]:col-span-3"
                    : "[&>div:nth-child(odd)]:col-span-3 md:[&>div:nth-child(odd)]:col-span-2 [&>div:nth-child(even)]:col-span-2 md:[&>div:nth-child(even)]:col-span-1",
                "mt-4 block grid-cols-5 gap-3 space-y-3 text-sm md:grid md:grid-cols-3 md:space-y-0"
            )}
            {...props}
        />
    );
};

const FormFieldTitle = ({
    className,
    ...props
}: React.ComponentProps<"h4">) => (
    <h4
        className={clsx(className, "mb-1 text-sm font-medium text-gray-700")}
        {...props}
    />
);
