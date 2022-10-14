import type { NextPageExtended } from "types/index";

import { SettingsLayout } from "components-layout/SettingsLayout";

const WorkspaceSettings: NextPageExtended = () => {
    return (
        <SettingsLayout
            breadcrumbItems={[
                { href: "/settings/workspaces", title: "Workspaces" },
            ]}
        >
            <h2> Settings Workspace section</h2>
        </SettingsLayout>
    );
};

WorkspaceSettings.layout = "dashboard";
export default WorkspaceSettings;
