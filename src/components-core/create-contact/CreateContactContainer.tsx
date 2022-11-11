import { PageBody, SectionHeading } from "components-layout";
import React from "react";

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
            </PageBody>
        </>
    );
};

CreateContactContainer.layout = "dashboard";
