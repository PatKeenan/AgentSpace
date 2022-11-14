import { PageBody, SectionHeading } from "components-layout";
import { Accordion } from "components-common/Accordion";
import { Button } from "components-common/Button";
import { CreateContactForm } from "./create-contact-components";

import type { NextPageExtended } from "types/index";

export const CreateContactContainer: NextPageExtended = () => {
    return (
        <>
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
