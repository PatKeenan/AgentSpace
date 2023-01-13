import { Dialog, Transition } from "@headlessui/react";
import { NextLink } from "components-common/NextLink";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import {
    Bars3CenterLeftIcon,
    HomeIcon,
    XMarkIcon,
    UserGroupIcon,
    TruckIcon,
    ViewColumnsIcon,
    QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

import {
    ArrowLeftOnRectangleIcon,
    Cog6ToothIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

import * as React from "react";
import clsx from "clsx";

import { Loading } from "components-common/Loading";

import { GatedWorkspace } from "./GatedWorkspace";
import { useWorkspace } from "hooks/useWorkspace";

type DashboardLayoutProps = {
    children: React.ReactNode | React.ReactNode[];
};

export const DashboardLayout = (props: DashboardLayoutProps) => {
    const { status } = useSession({
        required: true,
        onUnauthenticated: () => signIn(),
    });

    const { children = false } = props;
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const router = useRouter();

    const workspace = useWorkspace();

    const navigation = [
        {
            name: "Home",
            href: `/workspace/${workspace.id}`,
            icon: HomeIcon,
        },
        {
            name: "Contacts",
            href: `/workspace/${workspace.id}/contacts`,
            icon: UserGroupIcon,
        },
        {
            name: "Appointments",
            href: `/workspace/${workspace.id}/appointments`,
            icon: TruckIcon,
        },
        /*             {
            name: "Projects",
            href: `/workspace/${workspace.id}/projects`,
            icon: RectangleGroupIcon,
        }, */
        {
            name: "Tasks",
            href: `/workspace/${workspace.id}/tasks`,
            icon: ViewColumnsIcon,
        },
    ];

    const subNavigation = [
        { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
        { name: "Help", href: "/help", icon: QuestionMarkCircleIcon },
        {
            name: "Logout",
            href: "/api/auth/signout",
            icon: ArrowLeftOnRectangleIcon,
        },
    ];

    return status == "loading" ? (
        <Loading />
    ) : (
        <GatedWorkspace>
            <div className="min-h-full">
                {/* Mobile Menu */}
                <Transition.Root show={sidebarOpen} as={React.Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-40 lg:hidden"
                        onClose={setSidebarOpen}
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
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-40 flex ">
                            <div
                                className="w-14 flex-shrink-0"
                                aria-hidden="true"
                            />
                            <Transition.Child
                                as={React.Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="translate-x-full"
                                enterTo="-translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="-translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="relative ml-auto flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
                                    <Transition.Child
                                        as={React.Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute top-0 left-0 -ml-12 pt-2">
                                            <button
                                                type="button"
                                                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                                onClick={() =>
                                                    setSidebarOpen(false)
                                                }
                                            >
                                                <span className="sr-only">
                                                    Close sidebar
                                                </span>
                                                <XMarkIcon
                                                    className="h-6 w-6 text-white"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    {/* <div className="flex flex-shrink-0 items-center px-4">
                                        <img
                                            className="h-8 w-auto"
                                            src="https://tailwindui.com/img/logos/mark.svg?color=purple&shade=500"
                                            alt="Your Company"
                                        />
                                    </div> */}
                                    <div className="mt-5 flex h-full flex-1 flex-grow flex-col overflow-y-auto">
                                        <nav className="flex-shrink-0 px-2">
                                            <div className="space-y-1">
                                                {navigation.map((item) => {
                                                    const isActive =
                                                        router.pathname.startsWith(
                                                            `/workspace/[workspaceId]/${item.name.toLowerCase()}`
                                                        );
                                                    return (
                                                        <NextLink
                                                            onClick={() =>
                                                                setSidebarOpen(
                                                                    false
                                                                )
                                                            }
                                                            href={item.href}
                                                            key={item.name}
                                                            className={clsx(
                                                                isActive
                                                                    ? "bg-gray-100 text-gray-900"
                                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                                                "group flex items-center rounded-md px-2 py-2 text-base font-medium leading-5"
                                                            )}
                                                            aria-current={
                                                                isActive
                                                                    ? "page"
                                                                    : undefined
                                                            }
                                                        >
                                                            <item.icon
                                                                className={clsx(
                                                                    isActive
                                                                        ? "text-gray-500"
                                                                        : "text-gray-400 group-hover:text-gray-500",
                                                                    "mr-3 h-6 w-6 flex-shrink-0"
                                                                )}
                                                                aria-hidden="true"
                                                            />
                                                            {item.name}
                                                        </NextLink>
                                                    );
                                                })}
                                            </div>
                                        </nav>
                                        <div className="flex flex-grow" />
                                        <nav className="flex flex-shrink-0 border-t-2 border-t-gray-300/50 px-3 pb-6 pt-4">
                                            <ul className="flex w-full flex-col">
                                                {subNavigation.map(
                                                    (navItem, index) => (
                                                        <NextLink
                                                            href={navItem.href}
                                                            key={index}
                                                            className={clsx(
                                                                router.pathname.startsWith(
                                                                    `${navItem.name.toLowerCase()}`
                                                                )
                                                                    ? "bg-gray-200 text-gray-900"
                                                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                                                                "text-md group flex items-center rounded-md px-2 py-2 "
                                                            )}
                                                            aria-current={
                                                                router.pathname.startsWith(
                                                                    `/${navItem.name.toLowerCase()}`
                                                                )
                                                                    ? "page"
                                                                    : undefined
                                                            }
                                                        >
                                                            <navItem.icon
                                                                className={clsx(
                                                                    router.pathname.startsWith(
                                                                        `/workspace/[workspaceId]/${navItem.name.toLowerCase()}`
                                                                    )
                                                                        ? "text-gray-600"
                                                                        : "text-gray-400 group-hover:text-gray-500",
                                                                    "mr-3 h-4 w-4 flex-shrink-0"
                                                                )}
                                                                aria-hidden="true"
                                                            />
                                                            {navItem.name}
                                                        </NextLink>
                                                    )
                                                )}
                                            </ul>
                                        </nav>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>
                {/* End Menu */}

                {/* Static sidebar for desktop */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-gray-100 lg:pt-5 lg:pb-4">
                    <div className="flex flex-shrink-0 items-center px-6">
                        <img
                            className="h-8 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg?color=purple&shade=500"
                            alt="Your Company"
                        />
                    </div>
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="mt-6 flex h-0 flex-1 flex-grow flex-col overflow-y-auto">
                        {/* User account dropdown */}

                        {/* Sidebar Search */}
                        <div className="mt-5 px-3">
                            <label htmlFor="search" className="sr-only">
                                Search
                            </label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <div
                                    className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                                    aria-hidden="true"
                                >
                                    <MagnifyingGlassIcon
                                        className="mr-3 h-4 w-4 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </div>
                                <input
                                    type="text"
                                    name="search"
                                    id="search"
                                    className="block w-full rounded-md border-gray-300 pl-9 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Search"
                                />
                            </div>
                        </div>
                        {/* Navigation */}
                        <nav className="mt-6 px-3">
                            <div className="space-y-1">
                                {navigation.map((item) => (
                                    <NextLink
                                        key={item.name}
                                        href={item.href}
                                        className={clsx(
                                            router.pathname.startsWith(
                                                `/workspace/[workspaceId]/${item.name.toLowerCase()}`
                                            )
                                                ? "bg-gray-200 text-gray-900"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                                            "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                                        )}
                                        aria-current={
                                            router.pathname.startsWith(
                                                `/workspace/[workspaceId]/${item.name.toLowerCase()}`
                                            )
                                                ? "page"
                                                : undefined
                                        }
                                    >
                                        <item.icon
                                            className={clsx(
                                                router.pathname.startsWith(
                                                    `/workspace/[workspaceId]/${item.name.toLowerCase()}`
                                                )
                                                    ? "text-gray-600"
                                                    : "text-gray-400 group-hover:text-gray-500",
                                                "mr-3 h-6 w-6 flex-shrink-0"
                                            )}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </NextLink>
                                ))}
                            </div>
                        </nav>
                        <div className="flex flex-grow" />
                        <nav className="flex flex-shrink-0 border-t-2 border-t-gray-300/50 px-3 pb-6 pt-4">
                            <ul className="flex w-full flex-col">
                                {subNavigation.map((navItem, index) => (
                                    <NextLink
                                        href={navItem.href}
                                        key={index}
                                        className={clsx(
                                            router.pathname.startsWith(
                                                `${navItem.name.toLowerCase()}`
                                            )
                                                ? "bg-gray-200 text-gray-900"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                                            "text-md group flex items-center rounded-md px-2 py-2 "
                                        )}
                                        aria-current={
                                            router.pathname.startsWith(
                                                `/${navItem.name.toLowerCase()}`
                                            )
                                                ? "page"
                                                : undefined
                                        }
                                    >
                                        <navItem.icon
                                            className={clsx(
                                                router.pathname.startsWith(
                                                    `/workspace/[workspaceId]/${navItem.name.toLowerCase()}`
                                                )
                                                    ? "text-gray-600"
                                                    : "text-gray-400 group-hover:text-gray-500",
                                                "mr-3 h-4 w-4 flex-shrink-0 text-sm"
                                            )}
                                            aria-hidden="true"
                                        />
                                        {navItem.name}
                                    </NextLink>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
                {/* Main column */}
                <div className="flex flex-col lg:pl-64">
                    {/* Search header */}
                    <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white lg:hidden">
                        <div className="flex flex-shrink-0 items-center px-4">
                            <img
                                className="h-8 w-auto"
                                src="https://tailwindui.com/img/logos/mark.svg?color=purple&shade=500"
                                alt="Your Company"
                            />
                        </div>
                        <button
                            type="button"
                            className="ml-auto border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Bars3CenterLeftIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                            />
                        </button>
                        {/* <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-1">
                                <form
                                    className="flex w-full md:ml-0"
                                    action="#"
                                    method="GET"
                                >
                                    <label
                                        htmlFor="search-field"
                                        className="sr-only"
                                    >
                                        Search
                                    </label>
                                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                                            <MagnifyingGlassIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <input
                                            id="search-field"
                                            name="search-field"
                                            className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                                            placeholder="Search"
                                            type="search"
                                        />
                                    </div>
                                </form>
                            </div>
                        </div> */}
                    </div>

                    <main className="flex-1">{children}</main>
                </div>
            </div>
        </GatedWorkspace>
    );
};
