import { SectionHeading } from "components-layout/SectionHeading";
import { Breadcrumb } from "components-layout/Breadcrumb";
import { PageBody } from "components-layout/PageBody";
import { Tabs } from "components-common/Tabs";
import { useSettingsUI } from "./useSettingsUI";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import type { NextPageExtended } from "types/index";
import { SubRouter } from "components-common/SubRouter";

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

    const settingsTabs: { title: typeof activeTab; count?: string }[] = [
        /*         { title: "General" },
                { title: "Password" },
        { title: "Notifications" },
        { title: "Billing" },
        { title: "Plan" }, */
        { title: "Workspaces" },
    ];

    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName as typeof activeTab);
    };

    const isActive = (tab: typeof activeTab) => {
        return activeTab == tab;
    };

    return (
        <div className="relative h-full">
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
                            <SubRouter
                                component={<SettingsWorkspaces />}
                                active={isActive("Workspaces")}
                            />
                            <SubRouter
                                component={<SettingsGeneral />}
                                active={isActive("General")}
                            />
                            <SubRouter
                                component={<SettingsPassword />}
                                active={isActive("Password")}
                            />
                            <SubRouter
                                component={<SettingsNotifications />}
                                active={isActive("Notifications")}
                            />
                            <SubRouter
                                component={<SettingsNotifications />}
                                active={isActive("Plan")}
                            />
                        </Suspense>
                    </div>
                </div>
            </PageBody>
        </div>
    );
};
