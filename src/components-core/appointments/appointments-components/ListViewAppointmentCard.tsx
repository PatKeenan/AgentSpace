import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { AppointmentStatus } from "@prisma/client";
import clsx from "clsx";
import { IconButton } from "components-common/Button";

import { formatStringToDate } from "utils/formatDate";
import { statusColorsLight, statusDisplay } from "../appointments-utils";
import { AppointmentSingleton } from "lib";

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
        <div
            className={clsx(
                createdAt ? "px-6 pt-6 pb-8 lg:pb-6" : " p-6",
                "group relative block text-gray-500 hover:text-gray-800"
            )}
        >
            <div className="flex flex-1">
                <div className="flex-grow">
                    <div className="mb-3 -mt-2.5 w-full">
                        <p
                            className={clsx(
                                status && statusColorsLight[status],
                                "-ml-2 inline-flex items-center truncate rounded-md px-2 py-1 text-xs font-medium capitalize"
                            )}
                        >
                            {thisOrThat(statusDisplay(status), "--")}
                        </p>
                    </div>
                    <div className="grid max-w-2xl grid-cols-3 gap-4 text-sm">
                        <div className="col-span-2 block ">
                            <h4 className="text-sm font-medium text-gray-700">
                                {appointmentFormFields.address.label}
                            </h4>
                            <p className="mt-1 max-w-sm truncate ">
                                {thisOrThat(address, "--")}
                            </p>
                        </div>
                        <div className="col-span-1 block ">
                            <h4 className="font-medium text-gray-700">
                                {appointmentFormFields.address_2.label}
                            </h4>
                            <p className="mt-1 break-words ">
                                {thisOrThat(address_2, "--")}
                            </p>
                        </div>
                    </div>

                    <div className="mt-3 grid max-w-2xl grid-cols-3 gap-4 text-sm">
                        <div className="col-span-2">
                            <h4 className="font-medium text-gray-700">Time</h4>
                            <p className="mt-1 truncate ">
                                {thisOrThat(time, "--")}
                            </p>
                        </div>
                        <div className="col-span-1 block">
                            <h4 className="font-medium text-gray-700">
                                {appointmentFormFields.date.label}
                            </h4>
                            <p className="mt-1 truncate ">
                                {date
                                    ? formatStringToDate(date)?.toDateString()
                                    : "--"}
                            </p>
                        </div>
                    </div>
                    <div className="mt-3 grid max-w-2xl grid-cols-3 gap-4 text-sm">
                        <div className="col-span-2">
                            <h4 className="text-sm font-medium text-gray-700">
                                {appointmentFormFields.contacts.label}
                            </h4>
                            <p className="mt-1 truncate">
                                {thisOrThat(contacts, "--")}
                            </p>
                        </div>
                        <div className="col-span-1 block">
                            <h4 className="font-medium text-gray-700">
                                {appointmentFormFields.note.label}
                            </h4>
                            <p className="mt-1 truncate">
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

            {createdAt && (
                <p className="absolute left-6 bottom-2 text-xs md:left-auto md:right-5">
                    Created {createdAt}
                </p>
            )}
        </div>
    );
};
