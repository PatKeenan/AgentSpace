import { PageBody } from "components-layout/PageBody";
import { SectionHeading } from "components-layout/SectionHeading";
import { Loading } from "components-common/Loading";
import { useWorkspace } from "hooks/useWorkspace";

import type { NextPageExtended } from "types/index";

const Dashboard: NextPageExtended = () => {
    const workspace = useWorkspace();

    const { data: workspaces, isLoading } = workspace.getAll();

    return (
        <PageBody>
            <SectionHeading>
                <SectionHeading.TitleContainer>
                    <SectionHeading.Title>
                        Dashboard {workspace.id}
                    </SectionHeading.Title>
                </SectionHeading.TitleContainer>
            </SectionHeading>
            {isLoading && !workspaces ? (
                <Loading />
            ) : (
                workspaces?.map((i) => <p key={i.id}>{i.workspace.title}</p>)
            )}
        </PageBody>
    );
};

Dashboard.layout = "dashboard";
export default Dashboard;
