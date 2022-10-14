import type { NextPageExtended } from "types/index";

import { SettingsLayout } from "components-layout/SettingsLayout";

const PasswordSettings: NextPageExtended = () => {
    return (
        <SettingsLayout
            breadcrumbItems={[
                { href: "/settings/password", title: "Password" },
            ]}
        >
            <h2> Settings Password section</h2>
        </SettingsLayout>
    );
};

PasswordSettings.layout = "dashboard";
export default PasswordSettings;
