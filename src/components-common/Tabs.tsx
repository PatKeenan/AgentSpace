import { useRouter } from "next/router";
import { assert } from "utils/helpers";
import Link from "next/link";
import React from "react";
import clsx from "clsx";

type Tab = {
    title: string;
    href: string;
    count?: string;
};

type TabProps = {
    tabs: Tab[];
    id: string;
    actions?: React.ReactNode | React.ReactNode[];
};

export const Tabs = (props: TabProps) => {
    const { tabs, id, actions } = props;
    const router = useRouter();

    const getActiveTabName = () => {
        if (router.pathname == "/settings") {
            return assert(tabs[0]).title;
        }
        const activePath = tabs.find((i) => i.href == router.pathname);
        if (activePath) {
            return activePath.title;
        }
        return "";
    };

    const handleChange = (tabName: string) => {
        const selectedTab = tabs.find((t) => t.title == tabName);
        if (selectedTab) {
            return router.push(selectedTab.href);
        }
        return;
    };

    const isActive = (tabHref: string) => {
        return router.pathname == tabHref;
    };

    return (
        <>
            <div className="sm:hidden">
                <label htmlFor={id} className="sr-only">
                    Select a tab
                </label>
                <select
                    id={id}
                    name={id}
                    className={clsx(
                        "mt-4 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                    )}
                    defaultValue={getActiveTabName()}
                    onChange={(e) => handleChange(e.target.value)}
                >
                    {tabs.map((tab) => (
                        <option key={tab.title}>{tab.title}</option>
                    ))}
                </select>
            </div>

            <div className="hidden sm:block">
                <div className="flex items-center justify-between border-b border-gray-200">
                    <nav
                        className={clsx("mt-2 -mb-px flex space-x-8")}
                        aria-label="Tabs"
                    >
                        {tabs.map((tab) => (
                            <Link key={tab.title} href={tab.href}>
                                <a
                                    className={clsx(
                                        isActive(tab.href)
                                            ? "border-purple-500 text-purple-600"
                                            : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700",
                                        "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                                    )}
                                >
                                    {tab.title}
                                    {tab.count ? (
                                        <span
                                            className={clsx(
                                                isActive(tab.href)
                                                    ? "bg-purple-100 text-purple-600"
                                                    : "bg-gray-100 text-gray-900",
                                                "ml-2 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block"
                                            )}
                                        >
                                            {tab.count}
                                        </span>
                                    ) : null}
                                </a>
                            </Link>
                        ))}
                    </nav>
                    {actions && (
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            {actions}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
