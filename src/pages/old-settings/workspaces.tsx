import type { NextPageExtended } from "types/index";

import {
    getSettingsBreadCrumb,
    SettingsLayout,
} from "components-layout/SettingsLayout";

const WorkspaceSettings: NextPageExtended = () => {
    return (
        <SettingsLayout breadcrumbItems={[getSettingsBreadCrumb("workspaces")]}>
            <h2> Settings Workspace section</h2>
        </SettingsLayout>
    );
};

WorkspaceSettings.layout = "dashboard";
export default WorkspaceSettings;
