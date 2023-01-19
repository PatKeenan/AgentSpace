import { PageBody, SectionHeading } from "components-common";
import { NextPageExtended } from "types/index";

export const TagsContainer: NextPageExtended = () => {
    return (
        <>
            <PageBody>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>Tags</SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                </SectionHeading>
            </PageBody>
        </>
    );
};

TagsContainer.layout = "dashboard";
