import type { NextPageExtended } from "types/index";

import { SettingsLayout } from "components-layout/SettingsLayout";

const PlanSettings: NextPageExtended = () => {
    return (
        <SettingsLayout
            breadcrumbItems={[{ href: "/settings/plan", title: "Plan" }]}
        >
            <h2> Settings Plan section</h2>
        </SettingsLayout>
    );
};

PlanSettings.layout = "dashboard";
export default PlanSettings;
