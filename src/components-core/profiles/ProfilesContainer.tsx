import { Button, ButtonLink } from "components-common/Button";
import { Breadcrumb } from "components-layout/Breadcrumb";
import { PageBody } from "components-layout/PageBody";
import { SectionHeading } from "components-layout/SectionHeading";
import { useWorkspace } from "hooks/useWorkspace";
import { NextPageExtended } from "types/index";

export const ProfilesContainer: NextPageExtended = () => {
    const { id } = useWorkspace();
    return (
        <>
            <Breadcrumb
                items={[
                    { title: "Profiles", href: `/workspace/${id}/profiles` },
                ]}
            />
            <PageBody>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>Profiles</SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                    <SectionHeading.Actions>
                        <ButtonLink
                            variant="primary"
                            href={`/workspace/${id}/profiles/create`}
                        >
                            Add New
                        </ButtonLink>
                    </SectionHeading.Actions>
                </SectionHeading>
                {/* List of Profiles */}
                <ul>
                    <li>Buyer</li>
                    <li>Seller</li>
                    <li>Renter</li>
                    <li>Landlord</li>
                    <li>Vendor</li>
                    <li>Other</li>
                </ul>
            </PageBody>
        </>
    );
};

ProfilesContainer.layout = "dashboard";
