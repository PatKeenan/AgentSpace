import { PageBody } from "components-layout/PageBody";
import { SectionHeading } from "components-layout/SectionHeading";
import { NextPageExtended } from "types/index";
const Dashboard: NextPageExtended = () => {
    return (
        <PageBody>
            <SectionHeading>
                <SectionHeading.TitleContainer>
                    <SectionHeading.Title>Dashboard</SectionHeading.Title>
                </SectionHeading.TitleContainer>
            </SectionHeading>
        </PageBody>
    );
};

Dashboard.layout = "dashboard";
export default Dashboard;
