import { Breadcrumb, PageBody, SectionHeading } from "components-layout";
import { Loading } from "components-common/Loading";
import { usePeople, useWorkspace } from "hooks";
import { useRouter } from "next/router";
import { exists } from "utils/helpers";

import type { NextPageExtended } from "types/index";

export const PeopleDetailContainer: NextPageExtended = () => {
    const workspace = useWorkspace();
    const router = useRouter();
    const people = usePeople();

    const id = router.query.personId;

    const {
        data: person,
        isLoading: loadingPerson,
        isError: personError,
    } = people.getOne(
        { id: id as string, workspaceId: workspace.id as string },
        { enabled: exists(id) && exists(workspace.id) }
    );
    return !person && loadingPerson ? (
        <Loading />
    ) : (
        <>
            <Breadcrumb
                items={[
                    {
                        title: "People",
                        href: `/workspace/${workspace.id}/people`,
                    },
                    {
                        title: person?.name ?? "Person Detail",
                        href: `/workspace/${workspace.id}/people/${person?.id}`,
                    },
                ]}
            />
            <PageBody>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>
                            {person?.name}
                        </SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                </SectionHeading>
            </PageBody>
        </>
    );
};
PeopleDetailContainer.layout = "dashboard";
