import { SectionHeading } from "components-layout/SectionHeading";
import {
    BarsArrowUpIcon,
    CheckIcon,
    MapPinIcon,
    UserGroupIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Breadcrumb } from "components-layout/Breadcrumb";
import { PageBody } from "components-layout/PageBody";
import { useShowingsUI } from "./useShowingsUI";
import { Tabs } from "components-common/Tabs";
import {
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
    ChevronRightIcon,
    MagnifyingGlassIcon,
    QuestionMarkCircleIcon,
} from "@heroicons/react/20/solid";
import { Suspense } from "react";

import type { NextPageExtended } from "types/index";

import dynamic from "next/dynamic";
import { ShowingCard } from "components-core/settings/settings-components";
import { Button, ButtonLink } from "components-common/Button";
import { ShowingsModal } from "./showings-components/ShowingsModal";
import { useGlobalStore } from "global-store/useGlobalStore";

const ShowingsAll = dynamic(() => import("./showings-components/ShowingsAll"), {
    suspense: true,
});
const ShowingsPast = dynamic(
    () => import("./showings-components/ShowingsPast"),
    {
        suspense: true,
    }
);
const ShowingsUpcoming = dynamic(
    () => import("./showings-components/ShowingsUpcoming"),
    {
        suspense: true,
    }
);

const candidates = [
    {
        name: "Emily Selman",
        email: "emily.selman@example.com",
        imageUrl:
            "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        applied: "January 7, 2020",
        appliedDatetime: "2020-07-01T15:34:56",
        status: "Completed phone screening",
    },
    // More candidates...
];

export const ShowingsContainer: NextPageExtended = () => {
    const { activeTab, setActiveTab, setModalOpen } = useShowingsUI();

    const handleChangeTab = (tab: string) => {
        setActiveTab(tab as typeof activeTab);
    };
    const tabs: { title: typeof activeTab; count?: string }[] = [
        { title: "Upcoming" },
        { title: "All Showings" },
    ];

    const { activeWorkspaceId } = useGlobalStore();
    return (
        <>
            <Breadcrumb
                items={[
                    {
                        title: "Showings",
                        href: `/workspace/${activeWorkspaceId}/showings`,
                    },
                ]}
            />
            <ShowingsModal />
            <PageBody>
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
            </PageBody>
        </>
    );
};
ShowingsContainer.layout = "dashboard";

const ListView = () => {
    return (
        <>
            <ul
                role="list"
                className="mt-5 divide-y divide-gray-200 border-t border-gray-200 sm:mt-0 sm:border-t-0"
            >
                {candidates.map((candidate) => (
                    <li key={candidate.email}>
                        <ShowingCard
                            candidate={candidate}
                            key={candidate.name}
                        />
                    </li>
                ))}
            </ul>

            {/* Pagination */}
            <nav
                className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0"
                aria-label="Pagination"
            >
                <div className="-mt-px flex w-0 flex-1">
                    <a
                        href="#"
                        className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-200 hover:text-gray-700"
                    >
                        <ArrowLongLeftIcon
                            className="mr-3 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                        Previous
                    </a>
                </div>
                <div className="hidden md:-mt-px md:flex">
                    <a
                        href="#"
                        className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-200 hover:text-gray-700"
                    >
                        1
                    </a>
                    {/* Current: "border-purple-500 text-purple-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200" */}

                    <a
                        href="#"
                        className="inline-flex items-center border-t-2 border-purple-500 px-4 pt-4 text-sm font-medium text-purple-600"
                        aria-current="page"
                    >
                        2
                    </a>
                </div>
                <div className="-mt-px flex w-0 flex-1 justify-end">
                    <a
                        href="#"
                        className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-200 hover:text-gray-700"
                    >
                        Next
                        <ArrowLongRightIcon
                            className="ml-3 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </a>
                </div>
            </nav>
        </>
    );
};
