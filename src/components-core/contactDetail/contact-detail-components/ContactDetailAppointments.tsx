import { useAppointments } from "hooks/useAppointments";
import { useRouter } from "next/router";

const ContactDetailAppointments = () => {
    const router = useRouter();
    const contactId = router.query.contactId;
    const { getAllForContact } = useAppointments();

    const { data: appointments } = getAllForContact(
        { contactId: contactId as string, take: 20 },
        { enabled: typeof contactId == "string" }
    );

    return (
        <div>
            {appointments && appointments.length > 0 ? (
                <ul>
                    {appointments.map((i) => (
                        <li key={i.id}>{i.appointment.address}</li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
};

export default ContactDetailAppointments;
