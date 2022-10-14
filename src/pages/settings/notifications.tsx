import type { NextPageExtended } from "types/index";

import { SettingsLayout } from "components-layout/SettingsLayout";

const NotificationSettings: NextPageExtended = () => {
    return (
        <SettingsLayout
            breadcrumbItems={[
                { href: "/settings/notifications", title: "Notifications" },
            ]}
        >
            <h2> Settings Notification section</h2>
        </SettingsLayout>
    );
};

NotificationSettings.layout = "dashboard";
export default NotificationSettings;
