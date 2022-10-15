import React from "react";
import clsx from "clsx";

type Tab = {
    title: string;
    count?: string;
};

type TabProps = {
    tabs: Tab[];
    id: string;
    activeTab: string;
    actions?: React.ReactNode | React.ReactNode[];
    onTabClick: (tab: string) => void;
};

export const Tabs = (props: TabProps) => {
    const { tabs, id, actions, onTabClick, activeTab } = props;

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
                    value={tabs.find((tab) => tab.title == activeTab)?.title}
                    onChange={(e) =>
                        onTabClick(
                            tabs.find((tab) => tab.title == e.target.value)
                                ?.title as string
                        )
                    }
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
                            <button
                                key={tab.title}
                                className={clsx(
                                    activeTab == tab.title
                                        ? "border-purple-500 text-purple-600"
                                        : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700",
                                    "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                                )}
                                onClick={() => onTabClick(tab.title)}
                            >
                                {tab.title}
                                {tab.count ? (
                                    <span
                                        className={clsx(
                                            activeTab == tab.title
                                                ? "bg-purple-100 text-purple-600"
                                                : "bg-gray-100 text-gray-900",
                                            "ml-2 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block"
                                        )}
                                    >
                                        {tab.count}
                                    </span>
                                ) : null}
                            </button>
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
