import { ButtonLink } from "components-common/Button";
import { PageBody } from "components-layout/PageBody";
import { SectionHeading } from "components-layout/SectionHeading";
import { useWorkspace } from "hooks/useWorkspace";
import { NextPageExtended } from "types/index";

export const TasksContainer: NextPageExtended = () => {
    const { id } = useWorkspace();
    return (
        <>
            <PageBody>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>Tasks</SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                </SectionHeading>
                <ButtonLink
                    variant="primary"
                    href={`/workspace/${id}/appointments?defaultTab=list`}
                >
                    List View
                </ButtonLink>
                <ButtonLink
                    variant="outlined"
                    href={`/workspace/${id}/appointments?defaultTab=map`}
                >
                    Map View
                </ButtonLink>
            </PageBody>
        </>
    );
};

TasksContainer.layout = "dashboard";
