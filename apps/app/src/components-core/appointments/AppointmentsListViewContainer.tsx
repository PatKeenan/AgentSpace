import {
    NextLink,
    Button,
    TextDropDownMenu,
    Tag,
    NoData,
    Loading,
} from "components-common";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { useAppointments } from "hooks/useAppointments";
import { useDebounceState } from "hooks/useDebounce";
import { AppointmentStatus } from "@prisma/client";
import { useWorkspace } from "hooks/useWorkspace";
import { Pagination } from "components-common";
import { timeDisplay } from "utils/formatTime";
import { formatDate, formatStringToDate } from "utils/formatDate";
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
    ChevronRightIcon,
    MagnifyingGlassIcon,
    TruckIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";

import type { NextPageExtended } from "types/index";
import { statusColorsLight, statusDisplay } from "./appointments-utils";
import { format } from "date-fns";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { ColumnHeader, Table } from "components-common/Table";
import { trpc } from "utils/trpc";
import { useAppointmentFormStore } from "./appointments-components";
import Link from "next/link";
import { isEmpty } from "utils/isEmpty";

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
    const { setCallback } = useAppointmentFormStore();
    const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

    const searchQuery = useDebounceState("", 500);
    const utils = trpc.useContext();
    const { getAll } = useAppointments();
    const { id } = useWorkspace();

    const { data, isLoading } = getAll(
        {
            workspaceId: id as string,
            ...queryParamsState,
            searchQuery: searchQuery.debounced,
        },
        {
            enabled: typeof id == "string",
            refetchOnWindowFocus: false,
        }
    );

    const invalidate = React.useCallback(() => {
        utils.appointment.getAll.invalidate({
            workspaceId: id as string,
            ...queryParamsState,
            searchQuery: searchQuery.debounced,
        });
    }, [id, queryParamsState, searchQuery.debounced]);

    // Update the callback function that runs in the form to invalidate the query based on the current query params
    React.useEffect(() => {
        setCallback(invalidate);
        return () => setCallback(undefined);
    }, [id, queryParamsState, searchQuery.debounced]);

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
            label: "Sort Order",
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

    const tableColumnHeaders: ColumnHeader[] = [
        { value: "Date" },
        { value: "Status" },
        { value: "Address" },
        { value: "Time" },
        { value: "Contacts" },
        { value: "View", className: "sr-only" },
    ];

    return (
        <AppointmentsNestedLayout activeTab="View All">
            <Transition.Root show={mobileFiltersOpen} as={React.Fragment}>
                <Dialog
                    as="div"
                    className="relative z-40"
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
                            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl md:max-w-lg">
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
                                            defaultOpen={true}
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
                                                                            className="ml-3 text-sm capitalize text-gray-700"
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
            <div className="px-2">
                {/* Search */}
                <div className="my-4 flex w-full items-center">
                    <div className="flex flex-grow">
                        <label htmlFor="search" className="sr-only">
                            Search
                        </label>
                        <div className=" relative flex w-full max-w-md flex-grow items-center rounded-md border border-gray-300 text-gray-700 shadow focus-within:text-gray-600">
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
                        <div className="ml-4 flex items-center">
                            <button
                                className="inline-flex items-center justify-center rounded-md border border-transparent px-2 py-1 text-sm text-gray-700  hover:border-gray-300"
                                onClick={() =>
                                    setMobileFiltersOpen(!mobileFiltersOpen)
                                }
                            >
                                <span>Filter</span>
                                <FunnelIcon
                                    className="ml-2 h-5 w-5 "
                                    aria-hidden="true"
                                />
                            </button>
                            <div className="ml-4 flex">
                                {showResetButton && (
                                    <Button
                                        variant="text"
                                        className="my-auto text-xs"
                                        onClick={handleResetSort}
                                    >
                                        (Reset)
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {isLoading ? (
                    <div className="h-[70vh] flex-grow">
                        <Loading />
                    </div>
                ) : isEmpty(appointments) ? (
                    <NoData
                        icon={TruckIcon}
                        height="h-[60vh]"
                        title="No Appointments"
                        message="Start by adding an appointment."
                    />
                ) : (
                    <>
                        <ul className="block w-full space-y-2 pb-4 md:hidden">
                            {appointments?.map((i) => (
                                <li key={i.id} className="">
                                    <Link
                                        href={`/workspace/${i.workspaceId}/appointments/${i.id}`}
                                        passHref
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
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="hidden flex-col md:flex">
                            <Table>
                                <Table.Header
                                    columnHeaders={tableColumnHeaders}
                                />
                                <Table.Body isLoading={isLoading}>
                                    {appointments.map((appointment) => (
                                        <Table.Row key={appointment.id}>
                                            <Table.Data className="px-3 py-4 pl-4">
                                                <Link
                                                    href={`/workspace/${appointment.workspaceId}/appointments/${appointment.id}`}
                                                    className="hover:text-indigo-600"
                                                >
                                                    {appointment.date
                                                        ? format(
                                                              formatStringToDate(
                                                                  appointment.date
                                                              ) || new Date(),
                                                              "MM/dd/yyyy"
                                                          )
                                                        : "--"}
                                                </Link>
                                            </Table.Data>
                                            <Table.Data>
                                                <p
                                                    className={clsx(
                                                        appointment.status &&
                                                            statusColorsLight[
                                                                appointment
                                                                    .status
                                                            ],
                                                        "order-1 inline-flex items-center truncate rounded-md px-2 py-1 text-xs font-medium capitalize md:-ml-2"
                                                    )}
                                                >
                                                    {statusDisplay(
                                                        appointment.status
                                                    )}
                                                </p>
                                            </Table.Data>
                                            <Table.Data>
                                                <div className="max-w-sm">
                                                    <Link
                                                        href={`/workspace/${appointment.workspaceId}/appointments/${appointment.id}`}
                                                        className="hover:text-indigo-600"
                                                    >
                                                        {appointment.address ||
                                                            "--"}
                                                    </Link>
                                                </div>
                                            </Table.Data>
                                            <Table.Data>
                                                {timeDisplay(
                                                    appointment.startTime,
                                                    appointment.endTime
                                                ) || "--"}
                                            </Table.Data>
                                            <Table.Data>
                                                <div className="flex flex-wrap gap-y-1">
                                                    {appointment?.contacts?.map(
                                                        (p, pIndex) => (
                                                            <Tag
                                                                size="sm"
                                                                href={`/workspace/${appointment.workspaceId}/contacts/${p.contact.id}/profiles`}
                                                                className="mr-1.5"
                                                                key={
                                                                    p.contact
                                                                        .id +
                                                                    pIndex
                                                                }
                                                            >
                                                                {p.profile
                                                                    ? ` ${p.contact.name} - ${p.profile.name}`
                                                                    : p.contact
                                                                          .name}
                                                            </Tag>
                                                        )
                                                    )}
                                                </div>
                                            </Table.Data>
                                            <Table.Data className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right sm:pr-6">
                                                <Link
                                                    href={`/workspace/${appointment.workspaceId}/appointments/${appointment.id}`}
                                                    className="flex items-center justify-end text-sm font-medium text-indigo-400 hover:text-indigo-600"
                                                >
                                                    <span>View</span>
                                                    <ChevronRightIcon className="ml-1 h-4 w-4" />
                                                </Link>
                                            </Table.Data>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                        <Pagination
                            onPaginate={(page) => setQueryParamsState({ page })}
                            totalItems={totalAppointments}
                            currentPage={queryParamsState.page || 1}
                            itemsPerPage={queryParamsState.take || 10}
                            currentResultsLength={appointments.length}
                        />
                    </>
                )}
            </div>
        </AppointmentsNestedLayout>
    );
};

AppointmentsListViewContainer.layout = "dashboard";
AppointmentsListViewContainer.subLayout = "appointments";
