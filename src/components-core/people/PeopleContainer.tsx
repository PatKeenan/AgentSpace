import React from "react";
import { NextPageExtended } from "types/index";
import { useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import { PageBody } from "components-layout/PageBody";
import { SectionHeading } from "components-layout/SectionHeading";
import { Breadcrumb } from "components-layout/Breadcrumb";
import { useRouter } from "next/router";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Button, ButtonLink } from "components-common/Button";

const people = [
    {
        name: "Lindsay Walton",
        title: "Front-end Developer",
        email: "lindsay.walton@example.com",
        role: "Member",
    },
    {
        name: "Walton",
        title: "Front-end Developer",
        email: "lindsay.walton@example.com",
        role: "Member",
    },
    // More people...
];

export const PeopleContainer: NextPageExtended = () => {
    const checkbox = useRef<HTMLInputElement>(null);
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    const [selectedPeople, setSelectedPeople] = useState<typeof people | []>(
        []
    );

    useLayoutEffect(() => {
        const isIndeterminate =
            selectedPeople.length > 0 && selectedPeople.length < people.length;
        setChecked(selectedPeople.length === people.length);
        setIndeterminate(isIndeterminate);
        if (checkbox.current) {
            checkbox.current.indeterminate = isIndeterminate;
        }
    }, [selectedPeople]);

    function toggleAll() {
        setSelectedPeople(checked || indeterminate ? [] : people);
        setChecked(!checked && !indeterminate);
        setIndeterminate(false);
    }

    const router = useRouter();
    return (
        <>
            <Breadcrumb
                items={[
                    {
                        title: "People",
                        href: `/workspace/${
                            router.query.workspaceId as string
                        }/people`,
                    },
                ]}
            />
            <PageBody>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>People</SectionHeading.Title>
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
                                        placeholder="Search People"
                                    />
                                    <input
                                        type="text"
                                        className="hidden w-full  rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:block sm:text-sm"
                                        placeholder="Search people"
                                    />
                                </div>
                            </div>
                        </>
                    </SectionHeading.Actions>
                </SectionHeading>
                <div className="mt-7">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <p className="mt-2 text-sm text-gray-700">
                                A list of all the users in your account
                                including their name, title, email and role.
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                            <Button variant="primary">Add Person</Button>
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                    {selectedPeople.length > 0 && (
                                        <div className="absolute top-0 left-12 flex h-12 items-center space-x-3 bg-gray-50 sm:left-16">
                                            <Button
                                                variant="outlined"
                                                className="text-xs"
                                            >
                                                Bulk edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                className="text-xs"
                                            >
                                                Delete all
                                            </Button>
                                        </div>
                                    )}
                                    <table className="min-w-full table-fixed divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="relative w-12 px-6 sm:w-16 sm:px-8"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                                                        ref={checkbox}
                                                        checked={checked}
                                                        onChange={toggleAll}
                                                    />
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                                >
                                                    Name
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                >
                                                    Title
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                >
                                                    Email
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                >
                                                    Role
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                                                >
                                                    <span className="sr-only">
                                                        Edit
                                                    </span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {people.map((person) => (
                                                <tr
                                                    key={person.email}
                                                    className={
                                                        selectedPeople.includes(
                                                            person
                                                        )
                                                            ? "bg-gray-50"
                                                            : undefined
                                                    }
                                                >
                                                    <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                                                        {selectedPeople.includes(
                                                            person
                                                        ) && (
                                                            <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                                                        )}
                                                        <input
                                                            type="checkbox"
                                                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                                                            value={person.email}
                                                            checked={selectedPeople.includes(
                                                                person
                                                            )}
                                                            onChange={(e) =>
                                                                setSelectedPeople(
                                                                    e.target
                                                                        .checked
                                                                        ? [
                                                                              ...selectedPeople,
                                                                              person,
                                                                          ]
                                                                        : selectedPeople.filter(
                                                                              (
                                                                                  p
                                                                              ) =>
                                                                                  p !==
                                                                                  person
                                                                          )
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td
                                                        className={clsx(
                                                            "whitespace-nowrap py-4 pr-3 text-sm font-medium",
                                                            selectedPeople.includes(
                                                                person
                                                            )
                                                                ? "text-indigo-600"
                                                                : "text-gray-900"
                                                        )}
                                                    >
                                                        {person.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {person.title}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {person.email}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {person.role}
                                                    </td>
                                                    <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <a
                                                            href="#"
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Edit
                                                            <span className="sr-only">
                                                                , {person.name}
                                                            </span>
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <nav
                                        className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
                                        aria-label="Pagination"
                                    >
                                        <div className="hidden sm:block">
                                            <p className="text-sm text-gray-700">
                                                Showing{" "}
                                                <span className="font-medium">
                                                    1
                                                </span>{" "}
                                                to{" "}
                                                <span className="font-medium">
                                                    10
                                                </span>{" "}
                                                of{" "}
                                                <span className="font-medium">
                                                    {people.length}
                                                </span>{" "}
                                                results
                                            </p>
                                        </div>
                                        <div className="flex flex-1 justify-between sm:justify-end">
                                            <ButtonLink
                                                href="#"
                                                variant="outlined"
                                                className="text-xs"
                                            >
                                                Previous
                                            </ButtonLink>
                                            <ButtonLink
                                                href="#"
                                                variant="outlined"
                                                className="ml-2 text-xs"
                                            >
                                                Next
                                            </ButtonLink>
                                        </div>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PageBody>
        </>
    );
};

PeopleContainer.layout = "dashboard";
