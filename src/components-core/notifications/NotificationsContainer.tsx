import { PageBody, Breadcrumb, SectionHeading } from "components-common";
import { NextPageExtended } from "types/index";

export const NotificationsContainer: NextPageExtended = () => {
    return (
        <>
            <Breadcrumb
                items={[{ title: "Notifications", href: "/notifications" }]}
            />

            <PageBody>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>
                            Notifications
                        </SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                </SectionHeading>
            </PageBody>
        </>
    );
};

NotificationsContainer.layout = "dashboard";
