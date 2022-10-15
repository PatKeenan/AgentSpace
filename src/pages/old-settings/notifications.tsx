import type { NextPageExtended } from "types/index";

import {
    getSettingsBreadCrumb,
    SettingsLayout,
} from "components-layout/SettingsLayout";

const NotificationSettings: NextPageExtended = () => {
    return (
        <SettingsLayout
            breadcrumbItems={[getSettingsBreadCrumb("notifications")]}
        >
            <h2> Settings Notification section</h2>
        </SettingsLayout>
    );
};

NotificationSettings.layout = "dashboard";
export default NotificationSettings;
