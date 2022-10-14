import type { NextPageExtended } from "types/index";

import { SettingsLayout } from "components-layout/SettingsLayout";

const BillingSettings: NextPageExtended = () => {
    return (
        <SettingsLayout
            breadcrumbItems={[{ href: "/settings/billing", title: "Billing" }]}
        >
            <h2> Settings Billing section</h2>
        </SettingsLayout>
    );
};

BillingSettings.layout = "dashboard";
export default BillingSettings;
