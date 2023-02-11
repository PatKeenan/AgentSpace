import format from "date-fns/format";
import { useAppointments } from "hooks/useAppointments";
import { useWorkspace } from "hooks/useWorkspace";

import { SidebarList } from "./SidebarList";

export const ContactAppointmentList = ({
    contactId,
}: {
    contactId: string | undefined;
}) => {
    const { getAllForContact } = useAppointments();
    const { data } = getAllForContact(
        { contactId: contactId as string, take: 3, page: 1 },
        { enabled: typeof contactId == "string" }
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
                    "PPPP"
                );
                return (
                    <div className="relative focus-within:ring-2 focus-within:ring-cyan-500">
                        <h3 className="text-sm font-semibold text-gray-800">
                            <a className="hover:underline focus:outline-none">
                                <span
                                    className="absolute inset-0"
                                    aria-hidden="true"
                                />
                                {formattedDate}
                            </a>
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {i.appointment.address}
                        </p>
                    </div>
                );
            }}
        />
    );
};
