import { ShowingsModal } from "./showings-components/ShowingsModal";
import { SectionHeading } from "components-layout/SectionHeading";
import { Button, ButtonLink } from "components-common/Button";
import { useGlobalStore } from "global-store/useGlobalStore";
import { Breadcrumb } from "components-layout/Breadcrumb";
import { PageBody } from "components-layout/PageBody";
import { NextLink } from "components-common/NextLink";
import { useShowingsUI } from "./useShowingsUI";
import { Tabs } from "components-common/Tabs";
import { trpc } from "utils/trpc";
import {
    CalendarIcon,
    ChevronRightIcon,
    MagnifyingGlassIcon,
    TruckIcon,
} from "@heroicons/react/20/solid";

import type { NextPageExtended } from "types/index";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { formatDate } from "utils/formatDate";
import * as React from "react";

export const ShowingsContainer: NextPageExtended = () => {
    const { activeTab, setActiveTab, setModalOpen } = useShowingsUI();
    const { activeWorkspace } = useGlobalStore();
    const handleChangeTab = (tab: string) => {
        setActiveTab(tab as typeof activeTab);
    };
    const tabs: { title: typeof activeTab; count?: string }[] = [
        { title: "Upcoming" },
        { title: "All Showings" },
    ];

    return (
        <>
            <Breadcrumb
                items={[
                    {
                        title: "Showings",
                        href: `/workspace/${activeWorkspace?.id}/showings`,
                    },
                ]}
            />
            <ShowingsModal />
            <PageBody fullHeight>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>Showings</SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                    <SectionHeading.Actions>
                        <>
                            <label
                                htmlFor="mobile-search-candidate"
                                className="sr-only"
                            >
                                Search
                            </label>
                            <label
                                htmlFor="desktop-search-candidate"
                                className="sr-only"
                            >
                                Search
                            </label>
                            <div className="flex rounded-md shadow-sm">
                                <div className="relative flex-grow focus-within:z-10">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <MagnifyingGlassIcon
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:hidden"
                                        placeholder="Search Showings"
                                    />
                                    <input
                                        type="text"
                                        className="hidden w-full  rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:block sm:text-sm"
                                        placeholder="Search showings"
                                    />
                                </div>
                            </div>
                        </>
                    </SectionHeading.Actions>
                </SectionHeading>

                <>
                    <div className="px-4 sm:px-0">
                        <Tabs
                            tabs={tabs}
                            id="showing-tabs"
                            onTabClick={handleChangeTab}
                            activeTab={activeTab}
                            actions={
                                <Button
                                    variant="primary"
                                    onClick={() => setModalOpen(true)}
                                >
                                    Add Showing
                                </Button>
                            }
                        />
                    </div>
                    <ListView />
                </>
            </PageBody>
        </>
    );
};
ShowingsContainer.layout = "dashboard";

const ListView = () => {
    const { activeWorkspace } = useGlobalStore();
    const { setModalOpen } = useShowingsUI();
    const { data: showingGroups, isLoading } =
        trpc.showing.getAllGroups.useQuery(
            { workspaceId: activeWorkspace?.id as string },
            { enabled: activeWorkspace !== undefined }
        );

    return isLoading ? (
        <div>Loading...</div>
    ) : (
        <>
            {showingGroups && !showingGroups.length ? (
                <div className=" mt-2 grid h-full place-items-center rounded-lg border-2 border-dashed border-gray-300 p-2 hover:border-gray-400">
                    <div className="text-center">
                        <TruckIcon className="mx-auto h-24 w-24 text-gray-300" />
                        <p className="text-sm text-gray-400">No Showings</p>
                        <Button
                            variant="primary"
                            className="mt-8"
                            onClick={() => setModalOpen(true)}
                        >
                            Add First Showing
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="overflow-hidden bg-white shadow sm:rounded-md">
                    <ul role="list" className="divide-y divide-gray-200">
                        {showingGroups?.map((showingGroup) => (
                            <li key={showingGroup.id}>
                                <NextLink
                                    href={`/workspace/${showingGroup.workspaceId}/showings/${showingGroup.id}`}
                                    className="group block hover:bg-gray-50"
                                >
                                    <div className="flex items-center px-4 py-4 sm:px-6">
                                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div className="truncate">
                                                <p className="truncate font-medium text-gray-600 group-hover:text-purple-600">
                                                    {showingGroup.title}
                                                </p>
                                                <div className="mt-2 flex">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <CalendarIcon
                                                            className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                            aria-hidden="true"
                                                        />

                                                        <time
                                                            dateTime={formatDate(
                                                                showingGroup.date
                                                            )}
                                                        >
                                                            {formatDate(
                                                                showingGroup.date
                                                            )}
                                                        </time>
                                                    </div>
                                                    <div className="ml-4 flex items-center text-sm text-gray-500">
                                                        <MapPinIcon
                                                            className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                            aria-hidden="true"
                                                        />
                                                        <p>
                                                            {
                                                                showingGroup
                                                                    .showings
                                                                    .length
                                                            }{" "}
                                                            showing
                                                            {showingGroup
                                                                .showings
                                                                .length !== 1 &&
                                                                "s"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-5 flex-shrink-0">
                                            <ChevronRightIcon
                                                className="h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>
                                </NextLink>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};
