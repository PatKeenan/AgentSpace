import * as React from "react";
import { CalendarIcon, MapPinIcon } from "@heroicons/react/20/solid";

import { Breadcrumb } from "components-layout/Breadcrumb";
import { PencilIcon, PlusIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { SectionHeading } from "components-layout/SectionHeading";
import { useRouter } from "next/router";

import type { FC } from "react";
import { PageBody } from "components-layout/PageBody";
import clsx from "clsx";
import {
    EmptyData,
    ShowingDetailList,
    ShowingDetailMap,
} from "./showing-detail-components";
import { Button } from "components-common/Button";
import { useShowingDetailUI } from "./useShowingDetailUI";

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

export const ShowingDetailContainer = () => {
    const router = useRouter();
    const breadCrumbItems = [
        { title: "Showings", href: "/showings", active: false },
        {
            title: router.query.id as string,
            href: ("/showings/" + router.query.id) as string,
            active: true,
        },
    ];

    return (
        <>
            <Breadcrumb items={breadCrumbItems} />
            <PageBody fullHeight>
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
                                <Button variant="outlined">
                                    <PencilIcon
                                        className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                                        aria-hidden="true"
                                    />
                                    Edit
                                </Button>
                            </span>
                        </div>
                    </SectionHeading.Actions>
                </SectionHeading>
                {/* <div className="relative mt-8">
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
                </div> */}

                <div className="mt-4 flex-grow lg:grid lg:grid-cols-12 lg:gap-x-4">
                    <div className="mt-4 h-full lg:col-span-7">
                        <ShowingDetailList />
                    </div>
                    <div className="relative mt-4 lg:col-start-8 lg:col-end-13">
                        <ShowingDetailMap />
                    </div>
                </div>
                {/* <div className="mt-8">
                    <EmptyData />
                </div> */}
            </PageBody>
        </>
    );
};

ShowingDetailContainer.layout = "dashboard";
