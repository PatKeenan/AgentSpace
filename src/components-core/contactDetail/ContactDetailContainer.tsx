import { Breadcrumb, PageBody, SectionHeading } from "components-layout";
import { useContacts, useWorkspace } from "hooks";
import type { NextPageExtended } from "types/index";
import { Tabs } from "components-common/Tabs";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import * as React from "react";
import { useContactDetailUi } from "./useContactDetailUi";
import { ContactDetailOverviewTitle } from "./contact-detail-components/ContactDetailOverviewTitle";
import { ContactDetailOverviewModal } from "./contact-detail-components/ContactDetailOverviewModal";

const ContactDetailOverview = dynamic(
    () => import("./contact-detail-components/ContactDetailOverview"),
    { suspense: true }
);
const ContactDetailAppointments = dynamic(
    () => import("./contact-detail-components/ContactDetailAppointments"),
    { suspense: true }
);
const ContactDetailProfiles = dynamic(
    () => import("./contact-detail-components/ContactDetailProfiles"),
    { suspense: true }
);

type ContactDetailTabs = "Overview" | "Appointments" | "Profiles";

const tabs: { title: ContactDetailTabs }[] = [
    { title: "Overview" },
    { title: "Appointments" },
    { title: "Profiles" },
];

const activeContactDetailTabView: { [key in ContactDetailTabs]: JSX.Element } =
    {
        Overview: <ContactDetailOverview />,
        Appointments: <ContactDetailAppointments />,
        Profiles: <ContactDetailProfiles />,
    };

export const ContactDetailContainer: NextPageExtended = () => {
    const [activeTabTitle, setActiveTabTitle] =
        React.useState<ContactDetailTabs>("Overview");
    const router = useRouter();

    const workspace = useWorkspace();

    return (
        <>
            <Breadcrumb
                items={[
                    {
                        title: "Contacts",
                        href: `/workspace/${workspace.id}/contacts`,
                    },
                    {
                        title: "Contact Details",
                        href: `/workspace/${workspace.id}/contacts/${router.query.contactId}`,
                    },
                ]}
            />
            <ContactDetailOverviewModal />
            <PageBody extraClassName="max-w-8xl">
                <ContactDetailOverviewTitle />
                <div className="mb-6">
                    <Tabs
                        id="contact-detail-tabs"
                        onTabClick={(tab) =>
                            setActiveTabTitle(tab as ContactDetailTabs)
                        }
                        tabs={tabs}
                    />
                </div>
                {/* Acts as Router Outlet fro tabs */}
                <React.Suspense fallback={"Loading..."}>
                    {activeContactDetailTabView[activeTabTitle]}
                </React.Suspense>
                {/* End Outlet */}
            </PageBody>
        </>
    );
};
ContactDetailContainer.layout = "dashboard";
