import { Tabs, PageBody, Breadcrumb, SectionHeading } from "components-common";
import { useSettingsUI } from "./useSettingsUI";
import { Suspense } from "react";

import type { NextPageExtended } from "types/index";
import { SubRouter } from "components-common/SubRouter";
import { SettingsGeneral } from "./settings-components";
import { ErrorBoundary } from "components-core/ErrorBoundary";

export const SettingsContainer: NextPageExtended = () => {
    const { activeTab, setActiveTab } = useSettingsUI();

    const settingsTabs: { title: typeof activeTab; count?: string }[] = [
        { title: "General" },
    ];

    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName as typeof activeTab);
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
                        <ErrorBoundary>
                            <Suspense fallback={"Loading..."}>
                                <SubRouter
                                    component={<SettingsGeneral />}
                                    active={true}
                                />
                            </Suspense>
                        </ErrorBoundary>
                    </div>
                </div>
            </PageBody>
        </div>
    );
};
