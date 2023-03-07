import format from "date-fns/format";
import { useAppointments } from "hooks/useAppointments";
import { useWorkspace } from "hooks/useWorkspace";

import { SidebarList } from "./SidebarList";
import Link from "next/link";
import {
    statusColorsLight,
    statusDisplay,
} from "components-core/appointments/appointments-utils";
import clsx from "clsx";

export const ContactAppointmentList = ({
    contactId,
}: {
    contactId: string | undefined;
}) => {
    const { getAllForContact } = useAppointments();
    const { data } = getAllForContact(
        { contactId: contactId as string, take: 3, page: 1 },
        { enabled: typeof contactId == "string", refetchOnWindowFocus: false }
    );
    const appointments = data && data[0];
    const workspace = useWorkspace();

    return (
        <SidebarList
            title="Appointments"
            data={appointments}
            href={`/workspace/${workspace.id}/contacts/${contactId}/appointments`}
            renderItem={(i) => {
                const rawDate = new Date(i.appointment.date);
                const formattedDate = format(
                    new Date(
                        rawDate.getUTCFullYear(),
                        rawDate.getUTCMonth(),
                        rawDate.getUTCDate()
                    ),
                    "MM/dd/yyyy"
                );
                return (
                    <Link
                        href={`/workspace/${i.appointment.workspaceId}/appointments/${i.appointmentId}`}
                        passHref
                    >
                        <a>
                            <div className="relative focus-within:ring-2 focus-within:ring-cyan-500 hover:underline">
                                <h3 className="text-sm font-semibold text-gray-800">
                                    {formattedDate}
                                    <span
                                        className={clsx(
                                            i.appointment.status &&
                                                statusColorsLight[
                                                    i.appointment.status
                                                ],
                                            "capitalize",
                                            "top-0 right-0 rounded-md px-2 py-1 text-xs md:absolute"
                                        )}
                                    >
                                        {statusDisplay(i.appointment.status)}
                                    </span>
                                </h3>
                                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                                    {i.appointment.address}
                                </p>
                            </div>
                        </a>
                    </Link>
                );
            }}
        />
    );
};
