import { SectionHeading } from "components-layout/SectionHeading";
import { Breadcrumb } from "components-layout/Breadcrumb";
import { PageBody } from "components-layout/PageBody";
import { Tabs } from "components-common/Tabs";
import { assert, curryPath } from "utils/helpers";

import type { BreadcrumbItem } from "components-layout/Breadcrumb";
import type { ChildrenProps } from "types/index";

const curriedPath = curryPath("settings");

export enum SettingsTabNames {
    password = "Password",
    notifications = "Notifications",
    plan = "Plan",
    billing = "Billing",
    workspaces = "Workspaces",
}

export const settingsTabs = [
    { title: "General" as string, href: "/settings" },
    {
        title: SettingsTabNames.password as string,
        href: curriedPath("password"),
    },
    {
        title: SettingsTabNames.notifications as string,
        href: curriedPath("notifications"),
    },
    { title: SettingsTabNames.plan as string, href: curriedPath("plan") },
    { title: SettingsTabNames.billing as string, href: curriedPath("billing") },
    {
        title: SettingsTabNames.workspaces as string,
        href: curriedPath("workspaces"),
    },
];

export const getSettingsBreadCrumb = (key: keyof typeof SettingsTabNames) => {
    return assert(settingsTabs.find((i) => i.title == SettingsTabNames[key]));
};

type SettingsLayoutType = {
    children: ChildrenProps;
    breadcrumbItems?: BreadcrumbItem[];
};

export const SettingsLayout = (props: SettingsLayoutType) => {
    const { children, breadcrumbItems } = props;

    const items = [{ title: "Settings", href: "/settings" }].concat(
        breadcrumbItems ?? []
    );

    return (
        <>
            <Breadcrumb items={items} />
            <PageBody>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>Settings</SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                </SectionHeading>
                <div className="px-4 sm:px-6 md:px-0">
                    <Tabs tabs={settingsTabs} id="settings-tabs" />

                    <div className="mt-10 divide-y divide-gray-200">
                        {children}
                    </div>
                </div>
            </PageBody>
        </>
    );
};
