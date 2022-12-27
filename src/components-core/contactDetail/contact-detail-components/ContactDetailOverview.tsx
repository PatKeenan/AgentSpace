import { useRouter } from "next/router";
import React from "react";
import { ContactMetaList } from "./ContactMetaList";
import { ContactAppointmentList } from "./ContactAppointmentList";
import { ContactProfilesList } from "./ContactProfilesList";

const ContactDetailOverview = () => {
    const router = useRouter();
    const id = router.query.contactId;

    return (
        <div>
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                {/* Main Content */}
                <div className="grid grid-cols-1 gap-4 pb-4 lg:col-span-2 lg:pb-0">
                    <div className="grid grid-cols-1 gap-4 divide-y lg:col-span-2">
                        {router.query.contactId && (
                            <ContactMetaList contactId={id as string} />
                        )}

                        <ContactProfilesList className="mt-5 pt-5" />
                    </div>
                </div>
                {/* Sidebar */}
                <div className="col-span-1 col-start-3 space-y-8 border-t pt-4 lg:mt-0 lg:border-t-0 lg:pt-0">
                    {router.query.contactId ? (
                        <React.Fragment>
                            <ContactAppointmentList contactId={id as string} />
                            {/*   <ContactTagsList contactId={id as string} /> */}
                        </React.Fragment>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default ContactDetailOverview;
