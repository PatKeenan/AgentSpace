import React from "react";

import {
    ContactDetailModal,
    useContactDetailUi,
} from "components-core/contactDetail";
import {
    Button,
    SectionHeading,
    Breadcrumb,
    PageBody,
} from "components-common";
import { useContacts } from "hooks/useContacts";
import { useRouter } from "next/router";
import { exists } from "utils/helpers";
import { useWorkspace } from "hooks";

export const ContactLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { setModal } = useContactDetailUi();
    const id = router.query.contactId;

    const workspace = useWorkspace();

    const { getName, hardDelete } = useContacts();

    const { data: contact } = getName(
        { id: router.query.contactId as string },
        {
            enabled: exists(id),
            refetchOnWindowFocus: false,
        }
    );
    const { mutate } = hardDelete({
        onSettled: () => {
            router.push(`/workspace/${workspace.id}/contacts`);
        },
    });

    const handleDelete = () => {
        if (id && typeof id === "string") {
            mutate({ contactId: id });
        }
    };
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
            <PageBody>
                <SectionHeading className="mt-2">
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title
                            icon={
                                <Button
                                    actionIcon="edit"
                                    variant="text"
                                    iconSize="md"
                                    onClick={() =>
                                        setModal({
                                            state: true,
                                            defaultData: {
                                                name: contact?.name || "",
                                            },
                                            form: "generalInfo",
                                        })
                                    }
                                    className="ml-2 flex items-center"
                                >
                                    Edit
                                </Button>
                            }
                        >
                            {contact?.name ?? "Contact Details"}
                        </SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                    <SectionHeading.Actions>
                        <div className="flex flex-shrink-0 items-center space-x-2">
                            <Button
                                variant="outlined"
                                type="button"
                                actionIcon="delete"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        </div>
                    </SectionHeading.Actions>
                </SectionHeading>
                {children}
            </PageBody>
        </>
    );
};
