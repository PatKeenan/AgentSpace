import { Switch } from "@headlessui/react";
import { PageBody } from "components-layout/PageBody";
import { SectionHeading } from "components-layout/SectionHeading";
import { useState } from "react";
import clsx from "clsx";

import type { NextPageExtended } from "types/index";
import { Breadcrumb } from "components-layout/Breadcrumb";
import { Button } from "components-common/Button";
import { Tabs } from "components-common/Tabs";
import { curryPath } from "utils/helpers";
import { SettingsLayout } from "components-layout/SettingsLayout";

const curriedPath = curryPath("settings");

const tabs = [
    { name: "General", href: "/settings" },
    { name: "Password", href: curriedPath("password") },
    { name: "Notifications", href: curriedPath("notifications") },
    { name: "Plan", href: curriedPath("plan") },
    { name: "Billing", href: curriedPath("billing") },
    { name: "Workspaces", href: "workspaces" },
];

const Settings: NextPageExtended = () => {
    const [automaticTimezoneEnabled, setAutomaticTimezoneEnabled] =
        useState(true);
    const [autoUpdateApplicantDataEnabled, setAutoUpdateApplicantDataEnabled] =
        useState(false);

    return (
        <SettingsLayout>
            <div className="space-y-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Account
                </h3>
                <p className="max-w-2xl text-sm text-gray-500">
                    Manage how information is displayed on your account.
                </p>
            </div>
            <div className="mt-6">
                <dl className="divide-y divide-gray-200">
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500">
                            Language
                        </dt>
                        <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <span className="flex-grow">English</span>
                            <span className="ml-4 flex-shrink-0">
                                <Button variant="text">Update</Button>
                            </span>
                        </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5">
                        <dt className="text-sm font-medium text-gray-500">
                            Date format
                        </dt>
                        <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <span className="flex-grow">DD-MM-YYYY</span>
                            <span className="ml-4 flex flex-shrink-0 items-start space-x-4">
                                <Button variant="text">Update</Button>
                                <span
                                    className="text-gray-300"
                                    aria-hidden="true"
                                >
                                    |
                                </span>
                                <Button variant="text">Remove</Button>
                            </span>
                        </dd>
                    </div>
                    <Switch.Group
                        as="div"
                        className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5"
                    >
                        <Switch.Label
                            as="dt"
                            className="text-sm font-medium text-gray-500"
                            passive
                        >
                            Automatic timezone
                        </Switch.Label>
                        <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <Switch
                                checked={automaticTimezoneEnabled}
                                onChange={setAutomaticTimezoneEnabled}
                                className={clsx(
                                    automaticTimezoneEnabled
                                        ? "bg-purple-600"
                                        : "bg-gray-200",
                                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:ml-auto"
                                )}
                            >
                                <span
                                    aria-hidden="true"
                                    className={clsx(
                                        automaticTimezoneEnabled
                                            ? "translate-x-5"
                                            : "translate-x-0",
                                        "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                    )}
                                />
                            </Switch>
                        </dd>
                    </Switch.Group>
                    <Switch.Group
                        as="div"
                        className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-b sm:border-gray-200 sm:py-5"
                    >
                        <Switch.Label
                            as="dt"
                            className="text-sm font-medium text-gray-500"
                            passive
                        >
                            Auto-update applicant data
                        </Switch.Label>
                        <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <Switch
                                checked={autoUpdateApplicantDataEnabled}
                                onChange={setAutoUpdateApplicantDataEnabled}
                                className={clsx(
                                    autoUpdateApplicantDataEnabled
                                        ? "bg-purple-600"
                                        : "bg-gray-200",
                                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:ml-auto"
                                )}
                            >
                                <span
                                    aria-hidden="true"
                                    className={clsx(
                                        autoUpdateApplicantDataEnabled
                                            ? "translate-x-5"
                                            : "translate-x-0",
                                        "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                    )}
                                />
                            </Switch>
                        </dd>
                    </Switch.Group>
                </dl>
            </div>
        </SettingsLayout>
    );
};

Settings.layout = "dashboard";

export default Settings;
