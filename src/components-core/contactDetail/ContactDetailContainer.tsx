import { SubRouter, Tabs, Button } from "components-common";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { SectionHeading } from "components-layout/SectionHeading";
import { ContactDetailModal } from "./contact-detail-components";
import { Breadcrumb, PageBody } from "components-layout";
import { useContacts } from "hooks/useContacts";
import { useRouter } from "next/router";
import { exists } from "utils/helpers";
import { useWorkspace } from "hooks";
import dynamic from "next/dynamic";
import * as React from "react";

import type { NextPageExtended } from "types/index";

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

export const ContactDetailContainer: NextPageExtended = () => {
    const [activeTabTitle, setActiveTabTitle] =
        React.useState<ContactDetailTabs>("Overview");
    const router = useRouter();

    const workspace = useWorkspace();

    const { getName } = useContacts();
    const id = router.query.contactId;

    const { data: contact } = getName(
        { id: router.query.contactId as string },
        {
            enabled: exists(id),
        }
    );

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
            <ContactDetailModal />
            <PageBody extraClassName="max-w-8xl">
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title
                            icon={
                                <button className="group mt-auto mb-1 flex h-full items-center rounded-sm px-2 text-sm font-medium focus:outline-none  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                    <PencilIcon
                                        aria-hidden={true}
                                        className="-mr-1 ml-1 h-4 w-4 flex-shrink-0 text-gray-400 "
                                    />
                                    <span className="ml-2 text-gray-600 group-hover:text-gray-700">
                                        Edit
                                    </span>
                                </button>
                            }
                        >
                            {contact?.name ?? "Contact Details"}
                        </SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                    <SectionHeading.Actions>
                        <div className="flex flex-shrink-0 items-center space-x-2">
                            <Button variant="outlined" type="button">
                                <TrashIcon
                                    className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                                <span>Delete</span>
                            </Button>
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
                    <SubRouter
                        component={<ContactDetailOverview />}
                        active={activeTabTitle == "Overview"}
                    />
                    <SubRouter
                        component={<ContactDetailAppointments />}
                        active={activeTabTitle == "Appointments"}
                    />
                    <SubRouter
                        component={<ContactDetailProfiles />}
                        active={activeTabTitle == "Profiles"}
                    />
                </React.Suspense>
            </PageBody>
        </>
    );
};
ContactDetailContainer.layout = "dashboard";
