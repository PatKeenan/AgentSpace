import { Breadcrumb, PageBody, SectionHeading } from "components-layout";
import { Loading } from "components-common/Loading";
import { useContacts, useWorkspace } from "hooks";
import { useRouter } from "next/router";
import { exists } from "utils/helpers";

import type { NextPageExtended } from "types/index";

export const ContactDetailContainer: NextPageExtended = () => {
    const workspace = useWorkspace();
    const router = useRouter();
    const contacts = useContacts();

    const id = router.query.contactId;

    const {
        data: contact,
        isLoading: loadingPerson,
        isError: contactError,
    } = contacts.getOne(
        { id: id as string, workspaceId: workspace.id as string },
        { enabled: exists(id) && exists(workspace.id) }
    );
    return !contact && loadingPerson ? (
        <Loading />
    ) : (
        <>
            <Breadcrumb
                items={[
                    {
                        title: "Contacts",
                        href: `/workspace/${workspace.id}/contacts`,
                    },
                    {
                        title: contact?.name ?? "Person Detail",
                        href: `/workspace/${workspace.id}/contacts/${contact?.id}`,
                    },
                ]}
            />
            <PageBody>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>
                            {contact?.name}
                        </SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                </SectionHeading>
                {contact?.contactMeta.map((i) => (
                    <div key={i.id}>
                        <p>First: {i.firstName}</p> <p>Last: {i.lastName}</p>
                    </div>
                ))}
            </PageBody>
        </>
    );
};
ContactDetailContainer.layout = "dashboard";
