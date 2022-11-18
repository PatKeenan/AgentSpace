import { NextLink } from "components-common/NextLink";
import { Menu, Transition } from "@headlessui/react";
import { Col } from "components-common/Col";
import { Row } from "components-common/Row";
import { Fragment } from "react";

import clsx from "clsx";
import {
    CheckBadgeIcon,
    EllipsisHorizontalIcon,
    MapPinIcon,
    TrashIcon,
    UserIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";

import type { AppointmentCardProps } from "../types";

export const AppointmentCard = (props: AppointmentCardProps) => {
    const { appointment, index } = props;
    return (
        <div className="block text-gray-500">
            <div className="flex items-center justify-between text-sm ">
                <div className="flex items-center text-sm">
                    <h3 className="mr-4 text-sm font-semibold text-purple-600">
                        Appointment {index + 1}
                    </h3>
                    <time dateTime="2022-01-10T17:00">5:30pm to 6:00pm</time>
                </div>

                <Menu as="div" className="relative ml-auto">
                    <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-500 hover:text-gray-600">
                        <span className="sr-only">More</span>
                        <EllipsisHorizontalIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                        />
                    </Menu.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="#"
                                            className={clsx(
                                                active
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-700",
                                                "block px-4 py-2 text-sm"
                                            )}
                                        >
                                            Edit
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="#"
                                            className={clsx(
                                                active
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-700",
                                                "block px-4 py-2 text-sm"
                                            )}
                                        >
                                            Notes
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="#"
                                            className={clsx(
                                                active
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-700",
                                                "block px-4 py-2 text-sm"
                                            )}
                                        >
                                            Reschedule
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="#"
                                            className={clsx(
                                                active
                                                    ? "bg-gray-100 text-red-600"
                                                    : "text-red-700",
                                                "flex items-center border-t px-4 py-2 text-sm "
                                            )}
                                        >
                                            <TrashIcon className="mr-2 h-4 w-4" />
                                            Delete
                                        </a>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
            {/* Row */}
            <Row className="mt-3">
                <Col className="w-3/5 pr-2">
                    <div className="flex items-start space-x-3">
                        <dt>
                            <span className="sr-only">Location</span>
                            <MapPinIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </dt>
                        <dd>
                            {/* TODO: Add button to open in map */}
                            <NextLink
                                href="/places/asdas"
                                className="hover:underline"
                            >
                                {appointment.address}
                            </NextLink>
                        </dd>
                    </div>
                </Col>
                <Col className="w-2/5">
                    <div className="flex items-center justify-start space-x-2">
                        <dt className="">
                            <span className="sr-only">Time</span>
                            <CheckBadgeIcon
                                className="h-5 w-5 text-green-400"
                                aria-hidden="true"
                            />
                        </dt>
                        <dd>{appointment.status}</dd>
                    </div>
                </Col>
            </Row>
            {/* End Row */}
            {/* Row */}
            <Row className="mt-3">
                <Col className="w-3/5">
                    <div className="flex items-start space-x-3">
                        <dt className="">
                            <span className="sr-only">Clients?</span>
                            <UsersIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </dt>
                        <dd>
                            <ol className="flex items-center">
                                {appointment.contacts
                                    ?.filter((i) => i.role == "CLIENT")
                                    ?.map((i, idx) => (
                                        <li key={`${i.contact.id}-${idx}`}>
                                            <NextLink
                                                href={`/workspace/${appointment.workspaceId}/contacts/${i.contact.id}`}
                                                className="mr-1 hover:underline"
                                            >
                                                {i.contact.displayName}
                                            </NextLink>
                                        </li>
                                    )) || "--"}
                            </ol>
                        </dd>
                    </div>
                </Col>
                <Col className="w-2/5">
                    <div className="flex items-start space-x-3">
                        <dt className="">
                            <span className="sr-only">Agent?</span>
                            <UserIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </dt>
                        <dd>
                            <ol className="flex items-center">
                                {appointment.contacts
                                    ?.filter((i) => i.role == "AGENT")
                                    ?.map((i, idx) => (
                                        <li key={`${i.contact.id}-${idx}`}>
                                            <NextLink
                                                href={`/workspace/${appointment.workspaceId}/contacts/${i.contact.id}`}
                                                className="mr-1 hover:underline"
                                            >
                                                {i.contact.displayName}
                                            </NextLink>
                                        </li>
                                    ))}
                            </ol>
                        </dd>
                    </div>
                </Col>
            </Row>
            {/* End Row */}
        </div>
    );
};
