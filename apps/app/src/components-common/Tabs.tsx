import React from "react";
import clsx from "clsx";
import { NextLink } from "./NextLink";

type Tab = {
    title: string;
    count?: string;
    href?: string;
};

type TabProps = {
    tabs: Tab[];
    id: string;
    activeTab?: string;
    actions?: React.ReactNode | React.ReactNode[];
    onTabClick?: (tab: string) => void;
    asSelectOnMobile?: boolean;
};

export const Tabs = (props: TabProps) => {
    const {
        tabs,
        id,
        asSelectOnMobile = false,
        actions,
        onTabClick,
        activeTab: activeTabTitle,
    } = props;

    const [active, setActive] = React.useState(() =>
        activeTabTitle ? tabs.map((i) => i.title).indexOf(activeTabTitle) : 0
    );

    const handleSetActive = (idx: number) => {
        const selectedTab = tabs[idx];
        setActive(idx);
        if (onTabClick && selectedTab && selectedTab.title) {
            onTabClick(selectedTab.title);
        }
    };

    return (
        <>
            {asSelectOnMobile ? (
                <div className={clsx("sm:hidden")}>
                    <label htmlFor={id} className="sr-only">
                        Select a tab
                    </label>
                    <select
                        id={id}
                        name={id}
                        className={clsx(
                            "mt-4 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                        )}
                        value={tabs[active]?.title}
                        onChange={(e) =>
                            handleSetActive(
                                tabs.map((i) => i.title).indexOf(e.target.value)
                            )
                        }
                    >
                        {tabs.map((tab) => (
                            <option key={tab.title}>{tab.title}</option>
                        ))}
                    </select>
                </div>
            ) : null}
            <div
                className={clsx(asSelectOnMobile ? "hidden sm:block" : "block")}
            >
                <div className="flex items-center justify-between border-b border-gray-200">
                    <nav
                        className={clsx("mt-2 -mb-px flex space-x-8")}
                        aria-label="Tabs"
                    >
                        {tabs.map((tab, idx) => {
                            const sharedContainerStyles = clsx(
                                idx == active
                                    ? "border-indigo-500 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700",
                                "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                            );

                            return tab.href ? (
                                <NextLink
                                    key={tab.title}
                                    href={tab.href}
                                    className={sharedContainerStyles}
                                    onClick={() => handleSetActive(idx)}
                                >
                                    {tab.title}
                                    {tab.count ? (
                                        <span
                                            className={clsx(
                                                idx == active
                                                    ? "bg-indigo-100 text-indigo-600"
                                                    : "bg-gray-100 text-gray-900",
                                                "ml-2 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block"
                                            )}
                                        >
                                            {tab.count}
                                        </span>
                                    ) : null}
                                </NextLink>
                            ) : (
                                <button
                                    key={tab.title}
                                    className={sharedContainerStyles}
                                    onClick={() => handleSetActive(idx)}
                                >
                                    {tab.title}
                                    {tab.count ? (
                                        <span
                                            className={clsx(
                                                idx == active
                                                    ? "bg-indigo-100 text-indigo-600"
                                                    : "bg-gray-100 text-gray-900",
                                                "ml-2 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block"
                                            )}
                                        >
                                            {tab.count}
                                        </span>
                                    ) : null}
                                </button>
                            );
                        })}
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
