import {
    ChevronDownIcon,
    ChevronRightIcon,
    EnvelopeIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    PhoneIcon,
    UserGroupIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";

import { NextLink } from "components-common/NextLink";
import { useWorkspace } from "hooks/useWorkspace";
import { useContacts } from "hooks/useContacts";
import {
    ButtonLink,
    Breadcrumb,
    SectionHeading,
    PageBody,
    TextDropDownMenu,
    Pagination,
    Button,
    Card,
    NoData,
} from "components-common";

import type { NextPageExtended } from "types/index";
import { ColumnHeader, Table } from "components-common/Table";
import { Suspense } from "react";
import { ErrorBoundary } from "components-core/ErrorBoundary";
import { ContactSingletonType } from "lib";
import * as React from "react";
import { useDebounceState } from "hooks/useDebounce";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import clsx from "clsx";
import { PROFILE_TYPES } from "@prisma/client";
import Link from "next/link";
import { isEmpty } from "utils/isEmpty";

type FiltersType = {
    name: keyof Omit<
        ContactSingletonType["contactSchemas"]["search"],
        "searchQuery" | "searchBy"
    >;
    label: string;
    options: { label: string; value: string; current: boolean }[];
}[];

const initialQueryParamsState: ContactSingletonType["contactSchemas"]["search"] =
    {
        searchBy: "name",
        searchQuery: undefined,
        profileFilters: {
            AGENT: false,
            BUYER: false,
            SELLER: false,
            RENTER: false,
            RENTEE: false,
            VENDOR: false,
            OTHER: false,
        },
        sortBy: "name",
        sortOrder: "asc",
        take: 15,
        page: 1,
    };

const queryParamReducer = (
    state: ContactSingletonType["contactSchemas"]["search"],
    newState: Partial<ContactSingletonType["contactSchemas"]["search"]>
) => ({ ...state, ...newState });

export const ContactsContainer: NextPageExtended = () => {
    const workspace = useWorkspace();
    const { getAll } = useContacts();

    const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
    const [queryParamsState, setQueryParamsState] = React.useReducer(
        queryParamReducer,
        initialQueryParamsState
    );

    const searchQuery = useDebounceState("", 500);

    const { data, isLoading } = getAll(
        {
            workspaceId: workspace.id as string,
            ...queryParamsState,
            searchQuery: searchQuery.debounced,
        },
        { enabled: typeof workspace.id == "string" }
    );
    const contactsQuery = data && data.length == 2 ? data[0] : [];
    const totalContacts = data && data.length == 2 ? data[1] : 0;
    const searchByOptions: {
        name: string;
        value: ContactSingletonType["contactSchemas"]["search"]["searchBy"];
        onClick: () => void;
        current: boolean;
    }[] = [
        {
            name: "Name",
            value: "name",
            onClick: () => setQueryParamsState({ searchBy: "name", page: 1 }),
            current: queryParamsState.searchBy === "name",
        },
        {
            name: "Email",
            value: "email",
            onClick: () => setQueryParamsState({ searchBy: "email", page: 1 }),
            current: queryParamsState.searchBy === "email",
        },

        {
            name: "Phone",
            value: "phoneNumber",
            onClick: () => setQueryParamsState({ searchBy: "email", page: 1 }),
            current: queryParamsState.searchBy === "phoneNumber",
        },
        {
            name: "Sub Contacts",
            value: "subContacts",
            onClick: () =>
                setQueryParamsState({ searchBy: "subContacts", page: 1 }),
            current: queryParamsState.searchBy === "subContacts",
        },
        {
            name: "First Name",
            value: "firstName",
            onClick: () =>
                setQueryParamsState({ searchBy: "firstName", page: 1 }),
            current: queryParamsState.searchBy === "firstName",
        },
        {
            name: "Last Name",
            value: "lastName",
            onClick: () =>
                setQueryParamsState({ searchBy: "lastName", page: 1 }),
            current: queryParamsState.searchBy === "lastName",
        },
    ];

    const sortByOptions: { label: string; value: string; current: boolean }[] =
        [
            {
                label: "Name",
                value: "name",
                current: queryParamsState.sortBy === "name",
            },
            {
                label: "Created",
                value: "createdAt",
                current: queryParamsState.sortBy === "createdAt",
            },
            {
                label: "Appointments",
                value: "appointmentsMeta",
                current: queryParamsState.sortBy === "appointmentsMeta",
            },
            {
                label: "Profiles",
                value: "profiles",
                current: queryParamsState.sortBy === "profiles",
            },

            {
                label: "Updated",
                value: "updatedAt",
                current: queryParamsState.sortBy === "updatedAt",
            },
        ];
    const sortOrderOptions: {
        label: string;
        value: string;
        current: boolean;
    }[] = [
        {
            label: "Ascending",
            value: "asc",
            current: queryParamsState.sortOrder === "asc",
        },
        {
            label: "Descending",
            value: "desc",
            current: queryParamsState.sortOrder === "desc",
        },
    ];

    const profileFilters: {
        label: string;
        value: PROFILE_TYPES;
        current: boolean;
    }[] = [
        {
            label: "Agent",
            value: "AGENT",
            current: queryParamsState.profileFilters.AGENT,
        },
        {
            label: "Buyer",
            value: "BUYER",
            current: queryParamsState.profileFilters.BUYER,
        },
        {
            label: "Seller",
            value: "SELLER",
            current: queryParamsState.profileFilters.SELLER,
        },
        {
            label: "Renter",
            value: "RENTER",
            current: queryParamsState.profileFilters.RENTER,
        },
        {
            label: "Rentee",
            value: "RENTEE",
            current: queryParamsState.profileFilters.RENTEE,
        },
        {
            label: "Vendor",
            value: "VENDOR",
            current: queryParamsState.profileFilters.VENDOR,
        },
        {
            label: "Other",
            value: "OTHER",
            current: queryParamsState.profileFilters.OTHER,
        },
    ];

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
            name: "profileFilters",
            label: "Profiles",
            options: profileFilters,
        },
    ];

    const handleResetSort = () => {
        setQueryParamsState({
            sortBy: initialQueryParamsState.sortBy,
            sortOrder: initialQueryParamsState.sortOrder,
            page: 1,
        });
    };

    const tableColumnHeaders: ColumnHeader[] = [
        { value: "Name" },
        { value: "Email" },
        { value: "Phone" },
        { value: "Appointments" },
        { value: "Sub Contacts" },
        { value: "Profiles" },
        { value: "View", className: "sr-only" },
    ];

    const showResetButton =
        queryParamsState.sortBy !== initialQueryParamsState.sortBy ||
        queryParamsState.sortOrder !== initialQueryParamsState.sortOrder;

    return (
        <>
            <Breadcrumb
                items={[
                    {
                        title: "Contacts",
                        href: `/workspace/${workspace.id}/contacts`,
                    },
                ]}
            />
            <PageBody>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>Contacts</SectionHeading.Title>
                        <p className="mt-2 hidden text-sm text-gray-700 md:flex">
                            A list of all the contacts in your workspace
                            including their name, email and phone number.
                        </p>
                    </SectionHeading.TitleContainer>
                    <SectionHeading.Actions>
                        <ButtonLink
                            variant="primary"
                            href={`/workspace/${workspace.id}/contacts/create`}
                            actionIcon="add"
                        >
                            Add New
                        </ButtonLink>
                    </SectionHeading.Actions>
                </SectionHeading>
                {!isLoading && isEmpty(contactsQuery) ? (
                    <NoData
                        className="h-[70vh] flex-grow"
                        title="No Contacts"
                        icon={UserGroupIcon}
                        message="Start by adding a new contact."
                    />
                ) : (
                    <>
                        <Transition.Root
                            show={mobileFiltersOpen}
                            as={React.Fragment}
                        >
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
                                                        setMobileFiltersOpen(
                                                            false
                                                        )
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
                                                                            {
                                                                                section.label
                                                                            }
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
                                                                                        checked={
                                                                                            option.current
                                                                                        }
                                                                                        onChange={() =>
                                                                                            setQueryParamsState(
                                                                                                section.name ==
                                                                                                    "profileFilters"
                                                                                                    ? {
                                                                                                          page: 1,
                                                                                                          profileFilters:
                                                                                                              {
                                                                                                                  ...queryParamsState.profileFilters,
                                                                                                                  [option.value]:
                                                                                                                      !queryParamsState
                                                                                                                          .profileFilters[
                                                                                                                          option.value as keyof typeof queryParamsState.profileFilters
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
                        <div className="my-4 flex w-full items-center">
                            <div className="flex flex-grow">
                                <label htmlFor="search" className="sr-only">
                                    Search
                                </label>
                                <div className="relative flex w-full max-w-md flex-grow items-center rounded-md border border-gray-300 text-gray-700 shadow ring-1 ring-transparent focus-within:border-indigo-500  focus-within:text-gray-600 focus-within:outline-none focus-within:ring-indigo-500">
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
                                            searchQuery.setState(
                                                e.target.value
                                            );
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
                                            setMobileFiltersOpen(true)
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
                        <div>
                            <ul className="block w-full space-y-2 pb-4 md:hidden">
                                <ErrorBoundary>
                                    <Suspense fallback={<p>Loading...</p>}>
                                        {contactsQuery?.map((contact) => {
                                            return (
                                                <li key={contact.id}>
                                                    <Link
                                                        href={`/workspace/${contact.workspaceId}/contacts/${contact.id}`}
                                                        passHref
                                                    >
                                                        <a>
                                                            <Card className=" pl-6 pt-4 pb-4 text-sm">
                                                                <div className="flex flex-auto">
                                                                    <div className="flex-grow space-y-1">
                                                                        <h3 className="text-md font-semibold text-gray-600">
                                                                            {
                                                                                contact.name
                                                                            }
                                                                        </h3>
                                                                        {contact.email && (
                                                                            <div className="flex items-center text-gray-500">
                                                                                <EnvelopeIcon className="mr-2 h-4 w-4 text-gray-400" />
                                                                                {
                                                                                    contact.email
                                                                                }
                                                                            </div>
                                                                        )}
                                                                        {contact.phoneNumber && (
                                                                            <div className="flex items-center text-gray-500">
                                                                                <PhoneIcon className="mr-2 h-4 w-4 text-gray-400" />
                                                                                {
                                                                                    contact.phoneNumber
                                                                                }
                                                                            </div>
                                                                        )}
                                                                        {contact.subContacts &&
                                                                            contact
                                                                                .subContacts
                                                                                .length >
                                                                                0 && (
                                                                                <div className="flex items-center text-gray-500">
                                                                                    <UserGroupIcon className="mr-2 h-4 w-4 text-gray-400" />
                                                                                    {contact.subContacts
                                                                                        .map(
                                                                                            (
                                                                                                i
                                                                                            ) =>
                                                                                                i.firstName
                                                                                        )
                                                                                        .join(
                                                                                            ", "
                                                                                        )}
                                                                                </div>
                                                                            )}
                                                                        {contact
                                                                            ._count
                                                                            .appointmentsMeta >
                                                                            0 && (
                                                                            <div className="flex items-center text-gray-500">
                                                                                <HomeIcon className="mr-2 h-4 w-4 text-gray-400" />
                                                                                {
                                                                                    contact
                                                                                        ._count
                                                                                        .appointmentsMeta
                                                                                }
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex  flex-shrink-0 items-center">
                                                                        <button>
                                                                            <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        </a>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </Suspense>
                                </ErrorBoundary>
                            </ul>
                        </div>
                        <div className="hidden  md:flex">
                            <Table>
                                <Table.Header
                                    columnHeaders={tableColumnHeaders}
                                />
                                <Table.Body>
                                    <ErrorBoundary>
                                        <Suspense fallback={<p>Loading...</p>}>
                                            {contactsQuery?.map((contact) => (
                                                <Table.Row key={contact.id}>
                                                    <Table.Data padding="py-4 pl-6">
                                                        <NextLink
                                                            href={`/workspace/${contact.workspaceId}/contacts/${contact.id}`}
                                                            className="flex items-center justify-start text-sm font-semibold text-gray-600 hover:text-indigo-600"
                                                        >
                                                            {contact.name}
                                                        </NextLink>
                                                    </Table.Data>
                                                    <Table.Data>
                                                        {contact?.email ||
                                                            "---"}
                                                    </Table.Data>
                                                    <Table.Data>
                                                        {contact?.phoneNumber ||
                                                            "---"}
                                                    </Table.Data>
                                                    <Table.Data>
                                                        {contact._count
                                                            .appointmentsMeta ? (
                                                            <Link
                                                                href={`/workspace/${workspace.id}/contacts/${contact.id}/appointments`}
                                                                passHref
                                                            >
                                                                <a className="text-indigo-600">
                                                                    {
                                                                        contact
                                                                            ._count
                                                                            .appointmentsMeta
                                                                    }
                                                                </a>
                                                            </Link>
                                                        ) : (
                                                            "---"
                                                        )}
                                                    </Table.Data>
                                                    <Table.Data>
                                                        {contact.subContacts
                                                            .flatMap(
                                                                (sub) =>
                                                                    sub.firstName
                                                            )
                                                            .join(", ")}
                                                    </Table.Data>
                                                    <Table.Data>
                                                        {contact.profiles
                                                            ?.length > 0 ? (
                                                            <Link
                                                                href={`/workspace/${workspace.id}/contacts/${contact.id}/profiles`}
                                                                passHref
                                                            >
                                                                <a className="text-indigo-600">
                                                                    {
                                                                        contact
                                                                            .profiles
                                                                            ?.length
                                                                    }
                                                                </a>
                                                            </Link>
                                                        ) : (
                                                            "--"
                                                        )}
                                                    </Table.Data>
                                                    <Table.Data className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right sm:pr-6">
                                                        <NextLink
                                                            href={`/workspace/${contact.workspaceId}/contacts/${contact.id}`}
                                                            className="flex items-center justify-end text-sm font-medium text-indigo-400 hover:text-indigo-600"
                                                        >
                                                            <span>View</span>
                                                            <ChevronRightIcon className="ml-1 h-4 w-4" />
                                                        </NextLink>
                                                    </Table.Data>
                                                </Table.Row>
                                            ))}
                                        </Suspense>
                                    </ErrorBoundary>
                                </Table.Body>
                            </Table>
                        </div>
                        <Pagination
                            onPaginate={(page) => setQueryParamsState({ page })}
                            totalItems={totalContacts}
                            currentPage={queryParamsState.page || 1}
                            itemsPerPage={queryParamsState.take || 10}
                            currentResultsLength={contactsQuery?.length || 0}
                        />
                    </>
                )}
            </PageBody>
        </>
    );
};

ContactsContainer.layout = "dashboard";

const FormFieldTitle = ({
    className,
    ...props
}: React.ComponentProps<"h4">) => (
    <h4
        className={clsx(className, "mb-1 text-sm font-medium text-gray-700")}
        {...props}
    />
);
