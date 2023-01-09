import { ListViewAppointmentCard } from "./ListViewAppointmentCard";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useAppointments } from "hooks/useAppointments";
import { NextLink } from "components-common/NextLink";
import { Button } from "components-common/Button";
import { Select } from "components-common/Select";
import { useWorkspace } from "hooks/useWorkspace";
import { timeDisplay } from "utils/formatTime";
import { formatDate } from "utils/formatDate";
import { TextDropDownMenu } from "components-common/TextDropDownMenu";
import * as React from "react";
import { z } from "zod";
import { AppointmentQueryParamSchema } from "server/schemas";
import { useDebounceState } from "hooks/useDebounce";
import { AppointmentStatus } from "@prisma/client";

const initialQueryParamsState: AppointmentQueryParamSchema = {
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
    state: AppointmentQueryParamSchema,
    newState: Partial<AppointmentQueryParamSchema>
) => ({ ...state, ...newState });

const AppointmentListView = () => {
    const [queryParamsState, setQueryParamsState] = React.useReducer(
        queryParamReducer,
        initialQueryParamsState
    );

    const searchQuery = useDebounceState("", 500);

    const { getAll } = useAppointments();
    const { id } = useWorkspace();

    const { data: appointments } = getAll({
        workspaceId: id as string,
        ...queryParamsState,
        searchQuery: searchQuery.debounced,
    });

    const searchByOptions: {
        name: string;
        value: AppointmentQueryParamSchema["searchBy"];
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

    return (
        <div className="px-2">
            <div className="mt-4 block">
                {/* Search */}
                <div className="mb-4 w-full">
                    <div className="flex space-x-2">
                        <label htmlFor="mobile-search" className="sr-only">
                            Search
                        </label>
                        <div className="relative flex items-center rounded-md border border-gray-300 text-gray-700 shadow focus-within:text-gray-600">
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
                                type="search"
                                name="search"
                                autoComplete="off"
                                value={searchQuery.state}
                                onChange={(e) =>
                                    searchQuery.setState(e.target.value)
                                }
                            />
                            <div className="pr-3">
                                <TextDropDownMenu
                                    title={queryParamsState.searchBy}
                                    options={searchByOptions}
                                    displayField="name"
                                />
                            </div>
                        </div>
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
                                Showing <span className="font-medium">1</span>{" "}
                                to{" "}
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
                        <h5 className="border-b pb-1 text-gray-700">Status</h5>
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
                                            {i.toLowerCase().replace("_", " ")}
                                        </label>
                                    </div>
                                );
                            }
                        )}
                        {/*  <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                name="confirmed"
                                defaultChecked={true}
                            />
                            <label htmlFor="">Confirmed</label>
                        </div>
                        <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                name="confirmed"
                                defaultChecked={true}
                            />
                            <label htmlFor="">Pending</label>
                        </div>
                        <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                name="confirmed"
                                defaultChecked={true}
                            />
                            <label htmlFor="">Canceled</label>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AppointmentListView;
