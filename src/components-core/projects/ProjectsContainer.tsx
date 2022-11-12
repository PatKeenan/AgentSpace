import { PageBody } from "components-layout/PageBody";
import { SectionHeading } from "components-layout/SectionHeading";
import type { NextPageExtended } from "types/index";

export const ProjectContainer: NextPageExtended = () => {
    return (
        <>
            <PageBody>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>Projects</SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                </SectionHeading>
            </PageBody>
        </>
    );
};

ProjectContainer.layout = "dashboard";
