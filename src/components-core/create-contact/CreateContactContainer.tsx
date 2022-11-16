import { Breadcrumb, PageBody, SectionHeading } from "components-layout";
import { Accordion } from "components-common/Accordion";
import { Button } from "components-common/Button";
import { CreateContactForm } from "./create-contact-components";

import type { NextPageExtended } from "types/index";
import { useWorkspace } from "hooks/useWorkspace";

export const CreateContactContainer: NextPageExtended = () => {
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
                        title: "Create",
                        href: `/workspace/${workspace.id}/contacts/create`,
                    },
                ]}
            />
            <PageBody>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>
                            Create Contact
                        </SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                </SectionHeading>
                <CreateContactForm />
            </PageBody>
        </>
    );
};

CreateContactContainer.layout = "dashboard";
