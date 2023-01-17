import { ListViewAppointmentCard } from "./ListViewAppointmentCard";
import {
    CheckIcon,
    ChevronDownIcon,
    EllipsisVerticalIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import { useAppointments } from "hooks/useAppointments";
import { NextLink } from "components-common/NextLink";
import { Button } from "components-common/Button";
import { useWorkspace } from "hooks/useWorkspace";
import { timeDisplay } from "utils/formatTime";
import { formatDate } from "utils/formatDate";
import { TextDropDownMenu } from "components-common/TextDropDownMenu";
import * as React from "react";
import { useDebounceState } from "hooks/useDebounce";
import { AppointmentStatus } from "@prisma/client";
import { useAppointmentsUI } from "../useAppointmentsUI";
import {
    AppointmentSingleton,
    AppointmentSingletonType,
} from "lib/AppointmentSingleton";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import clsx from "clsx";

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
    };

const queryParamReducer = (
    state: AppointmentSingletonType["appointmentSchemas"]["search"],
    newState: Partial<AppointmentSingletonType["appointmentSchemas"]["search"]>
) => ({ ...state, ...newState });

const AppointmentListView = () => {
    const [queryParamsState, setQueryParamsState] = React.useReducer(
        queryParamReducer,
        initialQueryParamsState
    );

    const searchQuery = useDebounceState("", 500);
    const { setModal } = useAppointmentsUI();

    const { getAll } = useAppointments();
    const { id } = useWorkspace();

    const { data: appointments } = getAll({
        workspaceId: id as string,
        ...queryParamsState,
        searchQuery: searchQuery.debounced,
    });

    const searchByOptions: {
        name: string;
        value: AppointmentSingletonType["appointmentSchemas"]["search"]["searchBy"];
        onClick: () => void;
        current: boolean;
    }[] = [
        {
            name: "Address",
            value: "address",
            onClick: () => setQueryParamsState({ searchBy: "address" }),
            current: queryParamsState.searchBy == "address",
        },
        {
            name: "Contacts",
            value: "contacts",
            onClick: () => setQueryParamsState({ searchBy: "contacts" }),
            current: queryParamsState.searchBy == "contacts",
        },
    ];
    /* const sortByOptions: {
        name: string;
        value: AppointmentSingletonType["appointmentSchemas"]["search"]["sortBy"];
        onClick: () => void;
        current: boolean;
    }[] = [
        {
            name: "Created",
            value: "createdAt",
            onClick: () => setQueryParamsState({ sortBy: "createdAt" }),
            current: queryParamsState.sortBy == "createdAt",
        },
        {
            name: "Date",
            value: "date",
            onClick: () => setQueryParamsState({ sortBy: "date" }),
            current: queryParamsState.sortBy == "date",
        },
        {
            name: "Updated",
            value: "updatedAt",
            onClick: () => setQueryParamsState({ sortBy: "updatedAt" }),
            current: queryParamsState.sortBy == "updatedAt",
        },
    ]; */
    /*     const sortOrderOptions: {
        name: string;
        value: AppointmentSingletonType["appointmentSchemas"]["search"]["sortOrder"];
        onClick: () => void;
        current: boolean;
    }[] = [
        {
            name: "Descending",
            value: "desc",
            onClick: () => setQueryParamsState({ sortOrder: "desc" }),
            current: queryParamsState.sortOrder == "desc",
        },
        {
            name: "Ascending",
            value: "asc",
            onClick: () => setQueryParamsState({ sortOrder: "asc" }),
            current: queryParamsState.sortOrder == "asc",
        },
    ]; */

    /*   const statusFilters = AppointmentSingleton.appointmentStatusOptions.map(
        (option) => ({
            label: option.display,
            value: option.value,
            current:
                queryParamsState.statusFilters[
                    option.value as AppointmentStatus
                ],
        })
    ); */

    const filters: {
        name: keyof Omit<typeof queryParamsState, "searchQuery" | "searchBy">;
        label: string;
        options: { label: string; value: string; current: boolean }[];
    }[] = [
        {
            name: "sortBy",
            label: "Sort By",
            options: [
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
            ],
        },
        {
            name: "sortOrder",
            label: "Order By",
            options: [
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
            ],
        },
        {
            name: "statusFilters",
            label: "Status",
            options: AppointmentSingleton.appointmentStatusOptions.map(
                (option) => ({
                    label: option.display,
                    value: option.value,
                    current:
                        queryParamsState.statusFilters[
                            option.value as AppointmentStatus
                        ],
                })
            ),
        },
    ];

    const handleResetSort = () => {
        setQueryParamsState({
            sortBy: initialQueryParamsState.sortBy,
            sortOrder: initialQueryParamsState.sortOrder,
        });
    };

    const sortOrderOptions = React.useCallback(() => {
        return filters.find((i) => i.name == "sortOrder")?.options;
    }, [queryParamsState.sortOrder]);

    const sortByOptions = React.useCallback(() => {
        return filters.find((i) => i.name == "sortBy")?.options;
    }, [queryParamsState.sortBy]);

    const showResetButton =
        queryParamsState.sortBy !== initialQueryParamsState.sortBy ||
        queryParamsState.sortOrder !== initialQueryParamsState.sortOrder;

    const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

    return (
        <>
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
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                                onChange={(e) =>
                                    searchQuery.setState(e.target.value)
                                }
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
                                options={sortByOptions() || []}
                                displayField="label"
                                menuPosition="left"
                                onOptionClick={(option) =>
                                    setQueryParamsState({
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
                                options={sortOrderOptions() || []}
                                displayField="label"
                                onOptionClick={(option) =>
                                    setQueryParamsState({
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
                        <nav
                            className="flex items-center justify-between border-t border-gray-200 bg-white py-3 "
                            aria-label="Pagination"
                        >
                            <div className="hidden sm:block">
                                <p className="text-sm text-gray-700">
                                    Showing{" "}
                                    <span className="font-medium">1</span> to{" "}
                                    <span className="font-medium">
                                        {appointments?.length}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-medium">
                                        {appointments?.length}
                                    </span>{" "}
                                    results
                                </p>
                            </div>
                            <div className="flex flex-1 justify-between space-x-2 sm:justify-end">
                                <Button variant="outlined">Previous</Button>
                                <Button variant="outlined">Next</Button>
                            </div>
                        </nav>
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
        </>
    );
};
export default AppointmentListView;
