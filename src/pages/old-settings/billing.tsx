import type { NextPageExtended } from "types/index";
import {
    getSettingsBreadCrumb,
    SettingsLayout,
} from "components-layout/SettingsLayout";

const BillingSettings: NextPageExtended = () => {
    return (
        <SettingsLayout breadcrumbItems={[getSettingsBreadCrumb("billing")]}>
            <h2> Settings Billing section</h2>
        </SettingsLayout>
    );
};

BillingSettings.layout = "dashboard";
export default BillingSettings;
