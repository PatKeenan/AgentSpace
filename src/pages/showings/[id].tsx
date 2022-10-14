import { NextPageExtended } from "types/index";
import * as React from "react";
import { CalendarIcon, MapPinIcon } from "@heroicons/react/20/solid";

import { Breadcrumb } from "components-layout/Breadcrumb";
import {
    HomeModernIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { SectionHeading } from "components-layout/SectionHeading";
import { useRouter } from "next/router";

import type { FC } from "react";
import { PageBody } from "components-layout/PageBody";
import { Badge } from "components-common/Badge";
import clsx from "clsx";

type SubHeadingProps = {
    text: string;
    icon: FC<React.ComponentProps<"svg">>;
};

const SubHeadingItem = (props: SubHeadingProps) => {
    const { text, icon: Icon } = props;
    return (
        <div className="mt-2 flex items-center text-sm">
            <Icon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden={true}
            />
            <span className="text-gray-500">{text}</span>
        </div>
    );
};

const ShowingDetail: NextPageExtended = () => {
    const router = useRouter();
    const breadCrumbItems = [
        { title: "Showings", href: "/showings", active: false },
        {
            title: router.query.id as string,
            href: ("/showings/" + router.query.id) as string,
            active: true,
        },
    ];

    const tabs = [
        { name: "ListView", href: "#", current: false },
        { name: "MapView", href: "#", current: true },
    ];
    return (
        <>
            <Breadcrumb items={breadCrumbItems} />
            <PageBody>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>
                            Showing Details
                        </SectionHeading.Title>

                        <SectionHeading.Subtitle>
                            <div className="flex items-center space-x-6">
                                <SubHeadingItem
                                    icon={CalendarIcon}
                                    text="Saturday January 9, 2020"
                                />
                                <SubHeadingItem
                                    icon={MapPinIcon}
                                    text="Group"
                                />
                            </div>
                        </SectionHeading.Subtitle>
                    </SectionHeading.TitleContainer>
                    <SectionHeading.Actions>
                        <div className="flex">
                            <span className="hidden sm:block">
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <PencilIcon
                                        className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                                        aria-hidden="true"
                                    />
                                    Edit
                                </button>
                            </span>
                            <span className="hidden sm:ml-3 sm:block">
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <PlusIcon
                                        className="-ml-1 mr-2 h-5 w-5"
                                        aria-hidden="true"
                                    />
                                    Add New
                                </button>
                            </span>
                        </div>
                    </SectionHeading.Actions>
                </SectionHeading>
                <div className="relative mt-8">
                    <div className="sm:hidden">
                        <label htmlFor="current-tab" className="sr-only">
                            Select a tab
                        </label>
                        <select
                            id="current-tab"
                            name="current-tab"
                            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-ignore
                            defaultValue={tabs.find((tab) => tab.current).name}
                        >
                            {tabs.map((tab) => (
                                <option key={tab.name}>{tab.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="hidden sm:block">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => (
                                <a
                                    key={tab.name}
                                    href={tab.href}
                                    className={clsx(
                                        tab.current
                                            ? "border-indigo-500 text-indigo-600"
                                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                        "whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium"
                                    )}
                                    aria-current={
                                        tab.current ? "page" : undefined
                                    }
                                >
                                    {tab.name}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
                <div className="mt-8">
                    <EmptyData />
                </div>
            </PageBody>
        </>
    );
};

export default ShowingDetail;
ShowingDetail.layout = "dashboard";

const EmptyData = () => {
    return (
        <div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 ">
            <HomeModernIcon className="mx-auto h-10 w-10 text-gray-700" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No stops</h3>
            <p className="mt-1 text-sm text-gray-500">
                Get started by adding a stop.
            </p>
            <button
                type="button"
                className="mt-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Add Stop
            </button>
        </div>
    );
};
