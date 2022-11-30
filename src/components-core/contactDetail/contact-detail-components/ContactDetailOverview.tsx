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

const ContactDetailOverview = () => {
    const workspace = useWorkspace();
    const router = useRouter();
    const { getOne } = useContacts();

    const { setContactDisplayName } = useContactDetailUi();

    const id = router.query.contactId;

    const { data: contact, isLoading: loadingPerson } = getOne(
        { id: id as string, workspaceId: workspace.id as string },
        {
            enabled: exists(id) && exists(workspace.id),
        }
    );

    React.useEffect(() => {
        return () => {
            if (router.query.contactId !== contact?.id) {
                setContactDisplayName(undefined);
            }
        };
    }, [router, setContactDisplayName, contact]);

    React.useEffect(() => {
        setContactDisplayName(contact?.displayName);
    }, [setContactDisplayName, contact]);

    return loadingPerson && !contact ? (
        <Loading />
    ) : (
        <div>
            <ContactDetailOverviewModal />
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                {/* General Info */}
                <div className="grid grid-cols-1 gap-4 pb-4 lg:col-span-2 lg:pb-0">
                    <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                        {router.query.contactId && (
                            <ContactMetaList
                                contactId={router.query.contactId as string}
                            />
                        )}
                    </div>
                </div>
                {/* Upcoming Appointments */}
                <div className="col-span-1 col-start-3 space-y-8 border-t pt-4 lg:mt-0 lg:border-t-0 lg:pt-0">
                    {router.query.contactId && (
                        <ContactAppointmentList
                            contactId={router.query.contactId as string}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactDetailOverview;
