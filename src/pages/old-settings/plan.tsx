import type { NextPageExtended } from "types/index";

import {
    getSettingsBreadCrumb,
    SettingsLayout,
} from "components-layout/SettingsLayout";

const PlanSettings: NextPageExtended = () => {
    return (
        <SettingsLayout breadcrumbItems={[getSettingsBreadCrumb("plan")]}>
            <h2> Settings Plan section</h2>
        </SettingsLayout>
    );
};

PlanSettings.layout = "dashboard";
export default PlanSettings;
