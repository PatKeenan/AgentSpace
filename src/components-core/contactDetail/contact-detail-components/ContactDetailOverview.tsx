import { ContactDetailOverviewModal } from "./ContactDetailOverviewModal";
import { useContactDetailUi } from "../useContactDetailUi";
import { PlusIcon } from "@heroicons/react/24/outline";
import { GridSectionTitle } from "./GridSectionTitle";
import { Loading } from "components-common/Loading";
import { Button } from "components-common/Button";
import { useWorkspace } from "hooks/useWorkspace";
import { useContacts } from "hooks/useContacts";
import { useRouter } from "next/router";
import { exists } from "utils/helpers";
import { GridCard } from "./GridCard";
import React from "react";
import { ContactMetaList } from "./ContactMetaList";
import { ContactAppointmentList } from "./ContactAppointmentList";
import { ContactTagsList } from "./ContactTagsList";

const ContactDetailOverview = () => {
    const router = useRouter();
    const id = router.query.contactId;

    return (
        <div>
            <ContactDetailOverviewModal />
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                {/* Main Content */}
                <div className="grid grid-cols-1 gap-4 pb-4 lg:col-span-2 lg:pb-0">
                    <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                        {router.query.contactId && (
                            <ContactMetaList contactId={id as string} />
                        )}
                    </div>
                </div>
                {/* Sidebar */}
                <div className="col-span-1 col-start-3 space-y-8 border-t pt-4 lg:mt-0 lg:border-t-0 lg:pt-0">
                    {router.query.contactId ? (
                        <React.Fragment>
                            <ContactAppointmentList contactId={id as string} />
                            <ContactTagsList contactId={id as string} />
                        </React.Fragment>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default ContactDetailOverview;
