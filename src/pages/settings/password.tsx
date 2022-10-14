import type { NextPageExtended } from "types/index";

import {
    getSettingsBreadCrumb,
    SettingsLayout,
} from "components-layout/SettingsLayout";

const PasswordSettings: NextPageExtended = () => {
    return (
        <SettingsLayout breadcrumbItems={[getSettingsBreadCrumb("password")]}>
            <h2> Settings Password section</h2>
        </SettingsLayout>
    );
};

PasswordSettings.layout = "dashboard";
export default PasswordSettings;
