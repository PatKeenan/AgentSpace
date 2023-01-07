import React from "react";
import { Tabs, Button } from "components-common";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { SectionHeading } from "components-layout/SectionHeading";
import { ContactDetailModal } from "./contact-detail-components";
import { Breadcrumb, PageBody } from "components-layout";
import { useContacts } from "hooks/useContacts";
import { useRouter } from "next/router";
import { exists } from "utils/helpers";
import { useWorkspace } from "hooks";

export const ContactDetailLayout = ({
    children,
    activeTab,
}: {
    children: React.ReactNode;
    activeTab: "Overview" | "Profiles" | "Appointments";
}) => {
    const router = useRouter();
    const id = router.query.contactId;

    const workspace = useWorkspace();

    const { getName } = useContacts();

    const { data: contact } = getName(
        { id: router.query.contactId as string },
        {
            enabled: exists(id),
        }
    );

    const tabs: { title: typeof activeTab; href: string }[] = [
        {
            title: "Overview",
            href: `/workspace/${workspace.id}/contacts/${id}`,
        },
        {
            title: "Appointments",
            href: `/workspace/${workspace.id}/contacts/${id}/appointments`,
        },
        {
            title: "Profiles",
            href: `/workspace/${workspace.id}/contacts/${id}/profiles`,
        },
    ];

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
                        activeTab={activeTab}
                        id="contact-detail-tabs"
                        tabs={tabs}
                    />
                </div>
                {children}
            </PageBody>
        </>
    );
};
