import { Breadcrumb } from "components-layout/Breadcrumb";
import { PageBody } from "components-layout/PageBody";
import { SectionHeading } from "components-layout/SectionHeading";
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
