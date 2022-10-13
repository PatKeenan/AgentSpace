import * as React from "react";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { BarsArrowUpIcon } from "@heroicons/react/24/outline";

import { NextPageExtended } from "types/index";
import { Breadcrumb } from "components-layout/Breadcrumb";
import clsx from "clsx";
import { SectionHeading } from "components-layout/SectionHeading";
import { PageBody } from "components-layout/PageBody";

const tabs = [
  { name: "Upcoming", href: "#", count: "2", current: false },
  { name: "Past", href: "#", count: "4", current: false },
  { name: "Individual", href: "#", count: "4", current: false },
  { name: "Group", href: "#", count: "4", current: false },
  { name: "Canceled", href: "#", count: "6", current: true },
];
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

const Showings: NextPageExtended = () => {
  return (
    <>
      <Breadcrumb
        items={[{ title: "Settings", active: true, href: "/settings" }]}
      />
      <PageBody>
        <SectionHeading>
          <SectionHeading.TitleContainer>
            <SectionHeading.Title>Showings</SectionHeading.Title>
          </SectionHeading.TitleContainer>
          <SectionHeading.Actions>
            <>
              <label htmlFor="mobile-search-candidate" className="sr-only">
                Search
              </label>
              <label htmlFor="desktop-search-candidate" className="sr-only">
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
                    name="mobile-search-candidate"
                    id="mobile-search-candidate"
                    className="block w-full rounded-none rounded-l-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:hidden"
                    placeholder="Search"
                  />
                  <input
                    type="text"
                    name="desktop-search-candidate"
                    id="desktop-search-candidate"
                    className="hidden w-full rounded-none rounded-l-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:block sm:text-sm"
                    placeholder="Search candidates"
                  />
                </div>
                <button
                  type="button"
                  className="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <BarsArrowUpIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="ml-2">Sort</span>
                  <ChevronDownIcon
                    className="ml-2.5 -mr-1.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </>
          </SectionHeading.Actions>
        </SectionHeading>

        <div className="px-4 sm:px-0">
          {/* Tabs */}
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
            <select
              id="tabs"
              name="tabs"
              className="mt-4 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
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
            <div className="border-gray-200s flex items-center justify-between border-b">
              <nav className="mt-2 -mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                  <a
                    key={tab.name}
                    href={tab.href}
                    className={clsx(
                      tab.current
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700",
                      "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                    )}
                  >
                    {tab.name}
                    {tab.count ? (
                      <span
                        className={clsx(
                          tab.current
                            ? "bg-purple-100 text-purple-600"
                            : "bg-gray-100 text-gray-900",
                          "ml-2 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block"
                        )}
                      >
                        {tab.count}
                      </span>
                    ) : null}
                  </a>
                ))}
              </nav>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <button
                  type="button"
                  className="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Create Showing
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stacked list */}
        <ul
          role="list"
          className="mt-5 divide-y divide-gray-200 border-t border-gray-200 sm:mt-0 sm:border-t-0"
        >
          {candidates.map((candidate) => (
            <li key={candidate.email}>
              <a href="#" className="group block">
                <div className="flex items-center py-5 px-4 sm:py-6 sm:px-0">
                  <div className="flex min-w-0 flex-1 items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-full group-hover:opacity-75"
                        src={candidate.imageUrl}
                        alt=""
                      />
                    </div>
                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <div>
                        <p className="truncate text-sm font-medium text-purple-600">
                          {candidate.name}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500">
                          <EnvelopeIcon
                            className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="truncate">{candidate.email}</span>
                        </p>
                      </div>
                      <div className="hidden md:block">
                        <div>
                          <p className="text-sm text-gray-900">
                            Applied on{" "}
                            <time dateTime={candidate.appliedDatetime}>
                              {candidate.applied}
                            </time>
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500">
                            <CheckCircleIcon
                              className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400"
                              aria-hidden="true"
                            />
                            {candidate.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <ChevronRightIcon
                      className="h-5 w-5 text-gray-400 group-hover:text-gray-700"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </a>
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
            <a
              href="#"
              className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-200 hover:text-gray-700"
            >
              3
            </a>
            <a
              href="#"
              className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-200 hover:text-gray-700"
            >
              4
            </a>
            <a
              href="#"
              className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-200 hover:text-gray-700"
            >
              5
            </a>
            <a
              href="#"
              className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-200 hover:text-gray-700"
            >
              6
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
      </PageBody>
    </>
  );
};

export default Showings;
Showings.layout = "dashboard";
