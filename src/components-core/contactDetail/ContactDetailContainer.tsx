import { Breadcrumb, PageBody, SectionHeading } from "components-layout";
import { Loading } from "components-common/Loading";
import { useContacts, useWorkspace } from "hooks";
import type { NextPageExtended } from "types/index";
import { Tabs } from "components-common/Tabs";
import { useRouter } from "next/router";
import { exists } from "utils/helpers";
import dynamic from "next/dynamic";
import * as React from "react";
import { useContactDetailUi } from "./useContactDetailUi";

const ContactDetailOverview = dynamic(
    () => import("./contact-detail-components/ContactDetailOverview"),
    { suspense: true }
);
const ContactDetailShowings = dynamic(
    () => import("./contact-detail-components/ContactDetailShowings"),
    { suspense: true }
);

type ContactDetailTabs = "Overview" | "Showings";

const tabs: { title: ContactDetailTabs }[] = [
    { title: "Overview" },
    { title: "Showings" },
];

const activeContactDetailTabView: { [key in ContactDetailTabs]: JSX.Element } =
    {
        Overview: <ContactDetailOverview />,
        Showings: <ContactDetailShowings />,
    };

export const ContactDetailContainer: NextPageExtended = () => {
    const [activeTabTitle, setActiveTabTitle] =
        React.useState<ContactDetailTabs>("Overview");
    const router = useRouter();

    const workspace = useWorkspace();
    const { contactDisplayName } = useContactDetailUi();

    return (
        <>
            <Breadcrumb
                items={[
                    {
                        title: "Contacts",
                        href: `/workspace/${workspace.id}/contacts`,
                    },
                    {
                        title: contactDisplayName ?? "Contact Detail",
                        href: `/workspace/${workspace.id}/contacts/${router.query.contactId}`,
                    },
                ]}
            />
            <PageBody extraClassName="max-w-8xl">
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>
                            {contactDisplayName ?? "Contact Details"}
                        </SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                </SectionHeading>
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
