import { NextLink, Button, TextDropDownMenu } from "components-common";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { useAppointments } from "hooks/useAppointments";
import { useDebounceState } from "hooks/useDebounce";
import { AppointmentStatus } from "@prisma/client";
import { useWorkspace } from "hooks/useWorkspace";
import { Pagination } from "components-common";
import { timeDisplay } from "utils/formatTime";
import { formatDate } from "utils/formatDate";
import * as React from "react";
import clsx from "clsx";
import {
    AppointmentSingleton,
    AppointmentSingletonType,
} from "lib/AppointmentSingleton";
import {
    ListViewAppointmentCard,
    AppointmentsNestedLayout,
} from "./appointments-components";
import {
    ChevronDownIcon,
    EllipsisVerticalIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";

import type { NextPageExtended } from "types/index";

type FiltersType = {
    name: keyof Omit<
        AppointmentSingletonType["appointmentSchemas"]["search"],
        "searchQuery" | "searchBy"
    >;
    label: string;
    options: { label: string; value: string; current: boolean }[];
}[];

const initialQueryParamsState: AppointmentSingletonType["appointmentSchemas"]["search"] =
    {
        searchBy: "address",
        searchQuery: undefined,
        statusFilters: {
            CONFIRMED: true,
            CANCELED: true,
            NO_STATUS: true,
            PENDING: true,
            DENIED: true,
        },
        sortBy: "createdAt",
        sortOrder: "desc",
        take: 10,
        page: 1,
    };

const queryParamReducer = (
    state: AppointmentSingletonType["appointmentSchemas"]["search"],
    newState: Partial<AppointmentSingletonType["appointmentSchemas"]["search"]>
) => ({ ...state, ...newState });

export const AppointmentsListViewContainer: NextPageExtended = () => {
    const [queryParamsState, setQueryParamsState] = React.useReducer(
        queryParamReducer,
        initialQueryParamsState
    );

    const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

    const searchQuery = useDebounceState("", 500);

    const { getAll } = useAppointments();
    const { id } = useWorkspace();

    const { data } = getAll({
        workspaceId: id as string,
        ...queryParamsState,
        searchQuery: searchQuery.debounced,
    });

    const appointments = data && data.length == 2 ? data[0] : [];
    const totalAppointments = data && data.length == 2 ? data[1] : 0;

    const searchByOptions: {
        name: string;
        value: AppointmentSingletonType["appointmentSchemas"]["search"]["searchBy"];
        onClick: () => void;
        current: boolean;
    }[] = [
        {
            name: "Address",
            value: "address",
            onClick: () =>
                setQueryParamsState({ searchBy: "address", page: 1 }),
            current: queryParamsState.searchBy == "address",
        },
        {
            name: "Contacts",
            value: "contacts",
            onClick: () =>
                setQueryParamsState({ searchBy: "contacts", page: 1 }),
            current: queryParamsState.searchBy == "contacts",
        },
    ];

    const sortByOptions = [
        {
            label: "Created",
            value: "createdAt",
            current: queryParamsState.sortBy == "createdAt",
        },
        {
            label: "Date",
            value: "date",
            current: queryParamsState.sortBy == "date",
        },
        {
            label: "Updated",
            value: "updatedAt",
            current: queryParamsState.sortBy == "updatedAt",
        },
    ];
    const sortOrderOptions = [
        {
            label: "Descending",
            value: "desc",
            current: queryParamsState.sortOrder == "desc",
        },
        {
            label: "Ascending",
            value: "asc",
            current: queryParamsState.sortOrder == "asc",
        },
    ];

    const statusFilterOptions = React.useMemo(
        () =>
            AppointmentSingleton.appointmentStatusOptions.map((option) => ({
                label: option.display,
                value: option.value,
                current:
                    queryParamsState.statusFilters[
                        option.value as AppointmentStatus
                    ],
            })),
        [queryParamsState.statusFilters]
    );

    const filters: FiltersType = [
        {
            name: "sortBy",
            label: "Sort By",
            options: sortByOptions,
        },
        {
            name: "sortOrder",
            label: "Order By",
            options: sortOrderOptions,
        },
        {
            name: "statusFilters",
            label: "Status",
            options: statusFilterOptions,
        },
    ];

    const handleResetSort = () => {
        setQueryParamsState({
            sortBy: initialQueryParamsState.sortBy,
            sortOrder: initialQueryParamsState.sortOrder,
            page: 1,
        });
    };

    const showResetButton =
        queryParamsState.sortBy !== initialQueryParamsState.sortBy ||
        queryParamsState.sortOrder !== initialQueryParamsState.sortOrder;

    React.useEffect(() => {
        window.scrollTo({
            top: 0,
        });
    }, [queryParamsState.page]);

    return (
        <AppointmentsNestedLayout activeTab="View All">
            {/* Mobile Filters */}
            <Transition.Root show={mobileFiltersOpen} as={React.Fragment}>
                <Dialog
                    as="div"
                    className="relative z-40 lg:hidden"
                    onClose={setMobileFiltersOpen}
                >
                    <Transition.Child
                        as={React.Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className=" fixed inset-0 top-0 bg-black bg-opacity-25" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-40 flex">
                        <Transition.Child
                            as={React.Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                                <div className="flex items-center justify-between px-4">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Sort & Filter Options
                                    </h2>
                                    <button
                                        type="button"
                                        className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                                        onClick={() =>
                                            setMobileFiltersOpen(false)
                                        }
                                    >
                                        <span className="sr-only">
                                            Close menu
                                        </span>
                                        <XMarkIcon
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                                {/* Filters */}
                                <div>
                                    {filters.map((section) => (
                                        <Disclosure
                                            as="div"
                                            className="border-t border-gray-200 pt-4 pb-4"
                                            key={section.name}
                                        >
                                            {({ open }) => (
                                                <fieldset>
                                                    <legend className="w-full px-2">
                                                        <Disclosure.Button className="flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {section.label}
                                                            </span>
                                                            <span className="ml-6 flex h-7 items-center">
                                                                <ChevronDownIcon
                                                                    className={clsx(
                                                                        open
                                                                            ? "-rotate-180"
                                                                            : "rotate-0",
                                                                        "h-5 w-5 transform"
                                                                    )}
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        </Disclosure.Button>
                                                    </legend>
                                                    <Disclosure.Panel className="px-4 pt-4 pb-2">
                                                        <div className="space-y-6">
                                                            {section.options.map(
                                                                (
                                                                    option,
                                                                    optionIdx
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            option.value
                                                                        }
                                                                        className="flex items-center"
                                                                    >
                                                                        <input
                                                                            id={`${section.name}-${optionIdx}-mobile`}
                                                                            name={
                                                                                section.name
                                                                            }
                                                                            onChange={() =>
                                                                                setQueryParamsState(
                                                                                    section.name ==
                                                                                        "statusFilters"
                                                                                        ? {
                                                                                              page: 1,
                                                                                              statusFilters:
                                                                                                  {
                                                                                                      ...queryParamsState.statusFilters,
                                                                                                      [option.value]:
                                                                                                          !queryParamsState
                                                                                                              .statusFilters[
                                                                                                              option.value as AppointmentStatus
                                                                                                          ],
                                                                                                  },
                                                                                          }
                                                                                        : {
                                                                                              page: 1,
                                                                                              [section.name]:
                                                                                                  option.value,
                                                                                          }
                                                                                )
                                                                            }
                                                                            checked={
                                                                                option.current
                                                                            }
                                                                            type="checkbox"
                                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                        />
                                                                        <label
                                                                            htmlFor={`${section.name}-${optionIdx}-mobile`}
                                                                            className="ml-3 text-sm capitalize text-gray-500"
                                                                        >
                                                                            {
                                                                                option.label
                                                                            }
                                                                        </label>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </Disclosure.Panel>
                                                </fieldset>
                                            )}
                                        </Disclosure>
                                    ))}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* End Mobile FIlters */}
            <div className="px-2">
                {/* Search */}
                <div className="my-4 w-full grid-cols-12 flex-col gap-4 md:grid">
                    <div className="col-span-4 flex flex-grow md:max-w-md ">
                        <label htmlFor="search" className="sr-only">
                            Search
                        </label>
                        <div className="relative flex w-full flex-grow items-center rounded-md border border-gray-300 text-gray-700 shadow focus-within:text-gray-600">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <MagnifyingGlassIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </div>
                            <input
                                id="search"
                                className="flex flex-grow rounded-md border border-transparent bg-white bg-opacity-20 py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-400 focus:border-transparent focus:bg-opacity-100 focus:placeholder-gray-500 focus:outline-none focus:ring-0 sm:text-sm"
                                placeholder="Search"
                                name="search"
                                autoComplete="off"
                                value={searchQuery.state}
                                onChange={(e) => {
                                    setQueryParamsState({ page: 1 });
                                    searchQuery.setState(e.target.value);
                                }}
                            />
                            <div className="absolute right-3">
                                <TextDropDownMenu
                                    title={queryParamsState.searchBy}
                                    options={searchByOptions}
                                    displayField="name"
                                    menuPosition="left"
                                />
                            </div>
                        </div>
                        <div className="my-auto block h-full md:hidden">
                            <button
                                className="flex items-center justify-center rounded-full p-2 hover:bg-gray-100"
                                onClick={() =>
                                    setMobileFiltersOpen(!mobileFiltersOpen)
                                }
                            >
                                <span className="sr-only">Options</span>
                                <EllipsisVerticalIcon
                                    className="h-5 w-5 text-gray-500"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </div>
                    <div className="col-span-5 mr-3 hidden space-x-8 md:flex md:justify-end">
                        <div className="flex w-8">
                            {showResetButton ? (
                                <div className="mt-auto">
                                    <Button
                                        variant="text"
                                        className="text-xs"
                                        onClick={handleResetSort}
                                    >
                                        (Rest)
                                    </Button>
                                </div>
                            ) : null}
                        </div>
                        <div className=" mt-auto ">
                            <TextDropDownMenu
                                title={"Sort"}
                                options={sortByOptions || []}
                                displayField="label"
                                menuPosition="left"
                                onOptionClick={(option) =>
                                    setQueryParamsState({
                                        page: 1,
                                        sortBy:
                                            (option?.value as typeof queryParamsState.sortBy) ??
                                            "createdAt",
                                    })
                                }
                            />
                        </div>
                        <div className="mt-auto ">
                            <TextDropDownMenu
                                title={"Order"}
                                options={sortOrderOptions || []}
                                displayField="label"
                                onOptionClick={(option) =>
                                    setQueryParamsState({
                                        page: 1,
                                        sortOrder:
                                            (option?.value as typeof queryParamsState.sortOrder) ??
                                            "desc",
                                    })
                                }
                                menuPosition="left"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-2 block grid-cols-12 gap-4 lg:grid">
                    <div className="col-span-9 overflow-hidden  bg-white sm:rounded-md">
                        <ul className="w-full space-y-2 pb-4">
                            {appointments?.map((i) => (
                                <li key={i.id} className="">
                                    <NextLink
                                        href={"/"}
                                        className="block rounded-md border border-gray-200  hover:bg-gray-50"
                                    >
                                        <ListViewAppointmentCard
                                            key={i.id}
                                            address={i.address}
                                            date={i.date}
                                            time={timeDisplay(
                                                i.startTime,
                                                i.endTime
                                            )}
                                            status={i.status}
                                            contacts={i.contacts
                                                .flatMap((p) =>
                                                    p.profile
                                                        ? `${p.contact.name} - ${p.profile.name}`
                                                        : `${p.contact.name}`
                                                )
                                                .join(", ")}
                                            notes={i.note || ""}
                                            address_2={i.address_2 || ""}
                                            createdAt={formatDate(
                                                i.createdAt,
                                                "MM/DD/YYYY"
                                            )}
                                        />
                                    </NextLink>
                                </li>
                            ))}
                        </ul>
                        <Pagination
                            onPaginate={(page) => setQueryParamsState({ page })}
                            totalItems={totalAppointments}
                            currentPage={queryParamsState.page || 1}
                            itemsPerPage={queryParamsState.take || 10}
                            currentResultsLength={appointments.length}
                        />
                    </div>
                    <div className="hidden md:col-span-3 lg:block">
                        <div>
                            <h5 className="border-b pb-1 text-gray-700">
                                Status
                            </h5>
                            {Object.keys(queryParamsState.statusFilters).map(
                                (i, idx) => {
                                    const status =
                                        queryParamsState.statusFilters[
                                            i as AppointmentStatus
                                        ];
                                    return (
                                        <div
                                            className="mt-4 flex items-center space-x-2 text-sm text-gray-600"
                                            key={idx}
                                        >
                                            <input
                                                type="checkbox"
                                                name={i
                                                    .toLowerCase()
                                                    .replace("_", "-")}
                                                defaultChecked={status}
                                                onChange={() =>
                                                    setQueryParamsState({
                                                        statusFilters: {
                                                            ...queryParamsState.statusFilters,
                                                            [i]: !status,
                                                        },
                                                    })
                                                }
                                            />
                                            <label
                                                htmlFor={i
                                                    .toLowerCase()
                                                    .replace("_", "-")}
                                                className="capitalize"
                                            >
                                                {i
                                                    .toLowerCase()
                                                    .replace("_", " ")}
                                            </label>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppointmentsNestedLayout>
    );
};

AppointmentsListViewContainer.layout = "dashboard";
AppointmentsListViewContainer.subLayout = "appointments";
