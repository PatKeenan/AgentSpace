import { useAppointments } from "hooks/useAppointments";
import { GridSectionTitle } from "./GridSectionTitle";
import { Button } from "components-common/Button";
import { GridCard } from "./GridCard";
import format from "date-fns/format";

export const ContactAppointmentList = ({
    contactId,
}: {
    contactId: string | undefined;
}) => {
    const { getAllForContact } = useAppointments();
    const { data: appointments } = getAllForContact(
        { contactId: contactId as string, take: 3 },
        { enabled: typeof contactId == "string" }
    );

    return (
        <GridCard>
            <GridSectionTitle title="Upcoming Appointments" />
            {appointments && appointments.length > 0 ? (
                <ul
                    role="list"
                    className="-mt-3 flow-root divide-y divide-gray-200"
                >
                    {appointments?.map((i) => {
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
                            <li className="py-5" key={i.id}>
                                <div className="relative focus-within:ring-2 focus-within:ring-cyan-500">
                                    <h3 className="text-sm font-semibold text-gray-800">
                                        <a
                                            /*  href={announcement.href} */
                                            className="hover:underline focus:outline-none"
                                        >
                                            {/* Extend touch target to entire panel */}
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
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="py-2 text-sm">No Appointments</p>
            )}
            <Button variant="outlined" className="mt-3 w-full justify-center">
                View All
            </Button>
        </GridCard>
    );
};
