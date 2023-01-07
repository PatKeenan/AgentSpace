import React from "react";
import { Button, IconButton } from "components-common";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { SectionHeading } from "components-layout/SectionHeading";
import { ContactDetailModal } from "components-core/contactDetail";

import { Breadcrumb, PageBody } from "components-layout";
import { useContacts } from "hooks/useContacts";
import { useRouter } from "next/router";
import { exists } from "utils/helpers";
import { useWorkspace } from "hooks";

export const ContactLayout = ({ children }: { children: React.ReactNode }) => {
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
                            icon={<IconButton title="Edit" icon={PencilIcon} />}
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
                {children}
            </PageBody>
        </>
    );
};
