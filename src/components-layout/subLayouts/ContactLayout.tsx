import React from "react";
import { Button, IconButton } from "components-common";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { SectionHeading } from "components-layout/SectionHeading";
import {
    ContactDetailModal,
    useContactDetailUi,
} from "components-core/contactDetail";

import { Breadcrumb, PageBody } from "components-layout";
import { useContacts } from "hooks/useContacts";
import { useRouter } from "next/router";
import { exists } from "utils/helpers";
import { useWorkspace } from "hooks";

export const ContactLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { setModal } = useContactDetailUi();
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
                className=""
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
            <PageBody extraClassName="max-w-8xl px-2 md:px-4 lg:px-0 mt-4 lg:mt-0">
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title
                            icon={
                                <IconButton
                                    title="Edit"
                                    icon={PencilIcon}
                                    onClick={() =>
                                        setModal({
                                            state: true,
                                            defaultData: {
                                                name: contact?.name || "",
                                            },
                                            form: "generalInfo",
                                        })
                                    }
                                />
                            }
                        >
                            {contact?.name ?? "Contact Details"}
                        </SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                    <SectionHeading.Actions>
                        <div className="flex flex-shrink-0 items-center space-x-2">
                            <Button variant="outlined" type="button">
                                <TrashIcon
                                    className={
                                        "h-5 w-5 text-gray-400 md:-ml-1 md:mr-2"
                                    }
                                    aria-hidden="true"
                                />
                                <span className="hidden md:block">Delete</span>
                            </Button>
                        </div>
                    </SectionHeading.Actions>
                </SectionHeading>
                {children}
            </PageBody>
        </>
    );
};