import { PageBody, SectionHeading } from "components-common";
import { useRouter } from "next/router";
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
