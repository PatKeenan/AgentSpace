import { ButtonLink } from "components-common/Button";
import { PageBody } from "components-layout/PageBody";
import { SectionHeading } from "components-layout/SectionHeading";
import { useWorkspace } from "hooks/useWorkspace";
import type { NextPageExtended } from "types/index";

export const ProjectContainer: NextPageExtended = () => {
    const workspace = useWorkspace();
    return (
        <>
            <PageBody>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>Projects</SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                </SectionHeading>
            </PageBody>
            <div>
                <ButtonLink
                    variant="primary"
                    href={`/workspace/${workspace.id}/projects/create`}
                >
                    Create a Project
                </ButtonLink>
            </div>
        </>
    );
};

ProjectContainer.layout = "dashboard";
