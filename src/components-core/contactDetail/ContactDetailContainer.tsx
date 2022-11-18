import { Breadcrumb, PageBody, SectionHeading } from "components-layout";
import { useWorkspace } from "hooks";
import type { NextPageExtended } from "types/index";
import { Tabs } from "components-common/Tabs";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import * as React from "react";
import { useContactDetailUi } from "./useContactDetailUi";
import { TrashIcon } from "@heroicons/react/20/solid";

const ContactDetailOverview = dynamic(
    () => import("./contact-detail-components/ContactDetailOverview"),
    { suspense: true }
);
const ContactDetailAppointments = dynamic(
    () => import("./contact-detail-components/ContactDetailAppointments"),
    { suspense: true }
);

type ContactDetailTabs = "Overview" | "Appointments";

const tabs: { title: ContactDetailTabs }[] = [
    { title: "Overview" },
    { title: "Appointments" },
];

const activeContactDetailTabView: { [key in ContactDetailTabs]: JSX.Element } =
    {
        Overview: <ContactDetailOverview />,
        Appointments: <ContactDetailAppointments />,
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
                    <SectionHeading.Actions>
                        <div className="flex flex-shrink-0 items-center">
                            <button
                                type="button"
                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <TrashIcon
                                    className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                                <span>Delete</span>
                            </button>
                        </div>
                    </SectionHeading.Actions>
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
