import { PageBody } from "components-layout/PageBody";
import { SectionHeading } from "components-layout/SectionHeading";
import { useRouter } from "next/router";
import React from "react";
import { NextPageExtended } from "types/index";

export const TagDetailContainer: NextPageExtended = () => {
    const router = useRouter();
    return (
        <>
            <PageBody>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>
                            Tag Detail container - {router.query.tagId}
                        </SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                </SectionHeading>
            </PageBody>
        </>
    );
};
TagDetailContainer.layout = "dashboard";
