import { Breadcrumb } from "components-layout/Breadcrumb";
import { PageBody } from "components-layout/PageBody";
import { SectionHeading } from "components-layout/SectionHeading";
import { useWorkspace } from "hooks/useWorkspace";
import React from "react";
import { NextPageExtended } from "types/index";
import { CreateProfileForm } from "./components/CreateProfileForm";

export const CreateProfileContainer: NextPageExtended = () => {
    const { id } = useWorkspace();
    return (
        <>
            <Breadcrumb
                items={[
                    { title: "Profiles", href: `/workspace/${id}/profiles` },
                    {
                        title: "Create Profile",
                        href: `/workspace/${id}/profiles/create`,
                    },
                ]}
            />
            <PageBody>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>
                            Create Profile
                        </SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                </SectionHeading>
                <CreateProfileForm workspaceId={id} />
            </PageBody>
        </>
    );
};

CreateProfileContainer.layout = "dashboard";
