import { Breadcrumb, PageBody, SectionHeading } from "components-layout";
import { useContacts, useWorkspace } from "hooks";
import type { NextPageExtended } from "types/index";
import { Tabs } from "components-common/Tabs";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import * as React from "react";
import { useContactDetailUi } from "./useContactDetailUi";
import { ContactDetailOverviewTitle } from "./contact-detail-components/ContactDetailOverviewTitle";

const ContactDetailOverview = dynamic(
    () => import("./contact-detail-components/ContactDetailOverview"),
    { suspense: true }
);
const ContactDetailAppointments = dynamic(
    () => import("./contact-detail-components/ContactDetailAppointments"),
    { suspense: true }
);
const ContactDetailTags = dynamic(
    () => import("./contact-detail-components/ContactDetailTags"),
    { suspense: true }
);

type ContactDetailTabs = "Overview" | "Appointments" | "Tags";

const tabs: { title: ContactDetailTabs }[] = [
    { title: "Overview" },
    { title: "Appointments" },
    { title: "Tags" },
];

const activeContactDetailTabView: { [key in ContactDetailTabs]: JSX.Element } =
    {
        Overview: <ContactDetailOverview />,
        Appointments: <ContactDetailAppointments />,
        Tags: <ContactDetailTags />,
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
                <React.Suspense fallback={"Loading..."}>
                    {activeContactDetailTabView[activeTabTitle]}
                </React.Suspense>
            </PageBody>
        </>
    );
};
ContactDetailContainer.layout = "dashboard";
