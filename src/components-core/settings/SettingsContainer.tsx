import { SectionHeading } from "components-layout/SectionHeading";
import { Breadcrumb } from "components-layout/Breadcrumb";
import { PageBody } from "components-layout/PageBody";
import { Tabs } from "components-common/Tabs";
import { useSettingsUI } from "./useSettingsUI";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import type { NextPageExtended } from "types/index";

const SettingsGeneral = dynamic(
    () => import("./settings-components/SettingsGeneral"),
    {
        suspense: true,
    }
);
const SettingsBilling = dynamic(
    () => import("./settings-components/SettingsBilling"),
    {
        suspense: true,
    }
);
const SettingsNotifications = dynamic(
    () => import("./settings-components/SettingsNotifications"),
    {
        suspense: true,
    }
);
const SettingsPassword = dynamic(
    () => import("./settings-components/SettingsPassword"),
    {
        suspense: true,
    }
);
const SettingsPlan = dynamic(
    () => import("./settings-components/SettingsPlan"),
    {
        suspense: true,
    }
);
const SettingsWorkspaces = dynamic(
    () => import("./settings-components/SettingsWorkspaces"),
    {
        suspense: true,
    }
);

export const SettingsContainer: NextPageExtended = () => {
    const { activeTab, setActiveTab } = useSettingsUI();

    const activeSettingsView: { [key in typeof activeTab]: JSX.Element } = {
        General: <SettingsGeneral />,
        Billing: <SettingsBilling />,
        Notifications: <SettingsNotifications />,
        Password: <SettingsPassword />,
        Plan: <SettingsPlan />,
        Workspaces: <SettingsWorkspaces />,
    };

    const settingsTabs: { title: typeof activeTab; count?: string }[] = [
        { title: "General" },
        { title: "Password" },
        { title: "Notifications" },
        { title: "Billing" },
        { title: "Plan" },
        { title: "Workspaces" },
    ];

    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName as typeof activeTab);
    };

    return (
        <>
            <Breadcrumb items={[{ title: "Settings", href: "/settings" }]} />
            <PageBody>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>Settings</SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                </SectionHeading>
                <div className="px-4 sm:px-6 md:px-0">
                    <Tabs
                        id="settings-tabs"
                        tabs={settingsTabs}
                        onTabClick={handleTabClick}
                        activeTab={activeTab}
                    />

                    <div className="mt-10 divide-y divide-gray-200">
                        <Suspense fallback={"Loading..."}>
                            {activeSettingsView[activeTab]}
                        </Suspense>
                    </div>
                </div>
            </PageBody>
        </>
    );
};

SettingsContainer.layout = "dashboard";
