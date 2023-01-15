import { NextPageExtended } from "types/index";
import { Cog6ToothIcon } from "@heroicons/react/20/solid";
import { Button, ButtonLink } from "components-common/Button";
import { useAppointments } from "hooks/useAppointments";
import { useRouter } from "next/router";
import { ContactDetailLayout } from "./contact-detail-components/ContactDetailLayout";
import { NextLink } from "components-common/NextLink";
import { ListViewAppointmentCard } from "components-core/appointments/appointments-components";
import { timeDisplay } from "utils/formatTime";
import * as React from "react";

export const ContactDetailAppointmentsContainer: NextPageExtended = () => {
    const [sort, setSort] = React.useState<AppointmentSortSchema>({
        field: "createdAt",
        order: "desc",
    });

    const sortOptions = [
        {
            name: "Created At",
            onClick: () => setSort({ field: "createdAt", order: "desc" }),
            current: sort.field == "createdAt",
        },
        {
            name: "Updated At",
            onClick: () => setSort({ field: "updatedAt", order: "desc" }),
            current: sort.field == "updatedAt",
        },

        {
            name: "Date",
            onClick: () => setSort({ field: "date", order: "desc" }),
            current: sort.field == "date",
        },
    ];
    const orderOptions = [
        {
            name: "Descending",
            onClick: () => setSort({ ...sort, order: "desc" }),
            current: sort.order == "desc",
        },
        {
            name: "Ascending",
            onClick: () => setSort({ ...sort, order: "asc" }),
            current: sort.order == "asc",
        },
    ];

    const router = useRouter();
    const contactId = router.query.contactId;
    const { getAllForContact } = useAppointments();

    const { data: appointments } = getAllForContact(
        {
            contactId: contactId as string,
            take: 20,
            order: sort.order,
            field: sort.field,
        },
        { enabled: typeof contactId == "string" }
    );

    return (
        <ContactDetailLayout activeTab="Appointments">
            <div>
                <div className="mb-4 flex items-center">
                    {/* Sort/Status */}
                    <div className="flex-grow space-x-8">
                        <TextDropDownMenu
                            options={sortOptions}
                            displayField="name"
                            title="Sort By"
                        />
                        <TextDropDownMenu
                            options={orderOptions}
                            displayField="name"
                            title="Order"
                        />
                    </div>

                    <div className="ml-auto">
                        <ButtonLink variant="primary" href="" actionIcon="add">
                            Add New
                        </ButtonLink>
                    </div>
                </div>
                {appointments && appointments.length > 0 ? (
                    <>
                        <ul className="space-y-4 pb-2">
                            {appointments.map(({ appointment }) => (
                                <li key={appointment.id} className="">
                                    <NextLink
                                        href={"/"}
                                        className="block rounded-md border border-gray-200  hover:bg-gray-50"
                                    >
                                        <ListViewAppointmentCard
                                            key={appointment.id}
                                            address={appointment.address}
                                            date={appointment.date}
                                            time={timeDisplay(
                                                appointment.startTime,
                                                appointment.endTime
                                            )}
                                            status={appointment.status}
                                            contacts={appointment.contacts
                                                .flatMap((p) =>
                                                    p.profile
                                                        ? `${p.contact.name} - ${p.profile.name}`
                                                        : `${p.contact.name}`
                                                )
                                                .join(", ")}
                                            notes={appointment.note || ""}
                                            address_2={
                                                appointment.address_2 || ""
                                            }
                                            createdAt={formatDate(
                                                appointment.createdAt,
                                                "MM/DD/YYYY"
                                            )}
                                        />
                                    </NextLink>
                                </li>
                            ))}
                        </ul>
                        <nav
                            className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
                            aria-label="Pagination"
                        >
                            <div className="hidden sm:block">
                                <p className="text-sm text-gray-700">
                                    Showing{" "}
                                    <span className="font-medium">1</span> to{" "}
                                    <span className="font-medium">
                                        {appointments.length}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-medium">
                                        {appointments.length}
                                    </span>{" "}
                                    results
                                </p>
                            </div>
                            <div className="flex flex-1 justify-between space-x-2 sm:justify-end">
                                <Button variant="outlined">Previous</Button>
                                <Button variant="outlined">Next</Button>
                            </div>
                        </nav>
                    </>
                ) : null}
            </div>
        </ContactDetailLayout>
    );
};

ContactDetailAppointmentsContainer.layout = "dashboard";
ContactDetailAppointmentsContainer.subLayout = "contact";

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { Fragment, useState } from "react";
import {
    Dialog,
    Disclosure,
    Menu,
    Popover,
    Transition,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { TextDropDownMenu } from "components-common/TextDropDownMenu";
import { Appointment } from "@prisma/client";
import { formatDate } from "utils/formatDate";
import { AppointmentSortSchema } from "server/schemas";

const sortOptions = [
    {
        name: "Most Popular",
        onClick: () => alert("Test"),
        current: true,
        icon: Cog6ToothIcon,
    },
    { name: "Best Rating", href: "#", current: false },
    { name: "Newest", href: "#", current: false, icon: Cog6ToothIcon },
];
const filters = [
    {
        id: "category",
        name: "Category",
        options: [
            {
                value: "new-arrivals",
                label: "All New Arrivals",
                checked: false,
            },
            { value: "tees", label: "Tees", checked: false },
            { value: "objects", label: "Objects", checked: true },
        ],
    },
    {
        id: "color",
        name: "Color",
        options: [
            { value: "white", label: "White", checked: false },
            { value: "beige", label: "Beige", checked: false },
            { value: "blue", label: "Blue", checked: false },
        ],
    },
    {
        id: "sizes",
        name: "Sizes",
        options: [
            { value: "s", label: "S", checked: false },
            { value: "m", label: "M", checked: false },
            { value: "l", label: "L", checked: false },
        ],
    },
];

export function Example() {
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-white">
            {/* Mobile filter dialog */}
            <Transition.Root show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-40 sm:hidden"
                    onClose={setOpen}
                >
                    <Transition.Child
                        as={Fragment}
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
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                                <div className="flex items-center justify-between px-4">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Filters
                                    </h2>
                                    <button
                                        type="button"
                                        className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                        onClick={() => setOpen(false)}
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
                                <form className="mt-4">
                                    {filters.map((section) => (
                                        <Disclosure
                                            as="div"
                                            key={section.name}
                                            className="border-t border-gray-200 px-4 py-6"
                                        >
                                            {({ open }) => (
                                                <>
                                                    <h3 className="-mx-2 -my-3 flow-root">
                                                        <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                                                            <span className="font-medium text-gray-900">
                                                                {section.name}
                                                            </span>
                                                            <span className="ml-6 flex items-center">
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
                                                    </h3>
                                                    <Disclosure.Panel className="pt-6">
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
                                                                            id={`filter-mobile-${section.id}-${optionIdx}`}
                                                                            name={`${section.id}[]`}
                                                                            defaultValue={
                                                                                option.value
                                                                            }
                                                                            type="checkbox"
                                                                            defaultChecked={
                                                                                option.checked
                                                                            }
                                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                        />
                                                                        <label
                                                                            htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                                                            className="ml-3 text-sm text-gray-500"
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
                                                </>
                                            )}
                                        </Disclosure>
                                    ))}
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Filters */}
            <section aria-labelledby="filter-heading">
                <h2 id="filter-heading" className="sr-only">
                    Filters
                </h2>

                <div className="border-b border-gray-200 bg-white pb-4">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <TextDropDownMenu
                            options={sortOptions}
                            displayField="name"
                            title="Sort"
                        />

                        <div className="hidden sm:block">
                            <div className="flow-root">
                                <Popover.Group className="-mx-4 flex items-center divide-x divide-gray-200">
                                    {filters.map((section, sectionIdx) => (
                                        <Popover
                                            key={section.name}
                                            className="relative inline-block px-4 text-left"
                                        >
                                            <Popover.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                                <span>{section.name}</span>
                                                {sectionIdx === 0 ? (
                                                    <span className="ml-1.5 rounded bg-gray-200 py-0.5 px-1.5 text-xs font-semibold tabular-nums text-gray-700">
                                                        1
                                                    </span>
                                                ) : null}
                                                <ChevronDownIcon
                                                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                                    aria-hidden="true"
                                                />
                                            </Popover.Button>

                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    <form className="space-y-4">
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
                                                                        id={`filter-${section.id}-${optionIdx}`}
                                                                        name={`${section.id}[]`}
                                                                        defaultValue={
                                                                            option.value
                                                                        }
                                                                        type="checkbox"
                                                                        defaultChecked={
                                                                            option.checked
                                                                        }
                                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                    />
                                                                    <label
                                                                        htmlFor={`filter-${section.id}-${optionIdx}`}
                                                                        className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                                                                    >
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </label>
                                                                </div>
                                                            )
                                                        )}
                                                    </form>
                                                </Popover.Panel>
                                            </Transition>
                                        </Popover>
                                    ))}
                                </Popover.Group>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
