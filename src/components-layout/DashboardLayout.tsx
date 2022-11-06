import { Dialog, Menu, Transition } from "@headlessui/react";
import { NextLink } from "components-common/NextLink";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import {
    Bars3CenterLeftIcon,
    HomeIcon,
    XMarkIcon,
    UserGroupIcon,
    TruckIcon,
    RectangleGroupIcon,
} from "@heroicons/react/24/outline";

import {
    ChevronUpDownIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

import * as React from "react";
import clsx from "clsx";
import Image from "next/image";
import { trpc } from "utils/trpc";
import { Protected } from "./Protected";
import { Loading } from "components-common/Loading";
import { useGlobalStore } from "global-store/useGlobalStore";

const teams = [
    { name: "Engineering", href: "#", bgColorClass: "bg-indigo-500" },
    { name: "Human Resources", href: "#", bgColorClass: "bg-green-500" },
    { name: "Customer Success", href: "#", bgColorClass: "bg-yellow-500" },
];

type DashboardLayoutProps = {
    children: React.ReactNode | React.ReactNode[];
};

export const DashboardLayout = (props: DashboardLayoutProps) => {
    const { data: session } = useSession();
    const { children = false } = props;
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const router = useRouter();

    const { activeWorkspaceId, setActiveWorkspaceId } = useGlobalStore();

    const { data: userWorkspaceMeta, isLoading: isLoadingUserWorkspaceMeta } =
        trpc.user.getWorkspaceMeta.useQuery(undefined, {
            enabled: !activeWorkspaceId,
        });

    const {
        data: isAllowed,
        isLoading: isLoadingPermission,
        isError: isErrorPermission,
    } = trpc.workspace.checkIfAllowed.useQuery(
        { workspaceId: activeWorkspaceId as string },
        { enabled: activeWorkspaceId !== undefined }
    );

    const navigation = [
        {
            name: "Home",
            href: `/workspace/${activeWorkspaceId}`,
            icon: HomeIcon,
        },
        {
            name: "Showings",
            href: `/workspace/${activeWorkspaceId}/showings`,
            icon: TruckIcon,
        },
        {
            name: "Projects",
            href: `/workspace/${activeWorkspaceId}/projects`,
            icon: RectangleGroupIcon,
        },
        {
            name: "People",
            href: `/workspace/${activeWorkspaceId}/people`,
            icon: UserGroupIcon,
        },
    ];

    React.useEffect(() => {
        if (
            !activeWorkspaceId &&
            userWorkspaceMeta &&
            !userWorkspaceMeta.defaultWorkspace
        ) {
            router.push("/workspace/create");
        }
    }, [activeWorkspaceId, router, userWorkspaceMeta]);

    React.useEffect(() => {
        if (
            activeWorkspaceId &&
            userWorkspaceMeta?.defaultWorkspace &&
            activeWorkspaceId !== userWorkspaceMeta.defaultWorkspace
        ) {
            setActiveWorkspaceId(userWorkspaceMeta.defaultWorkspace);
        }
    }, [activeWorkspaceId, setActiveWorkspaceId, userWorkspaceMeta]);

    React.useEffect(() => {
        if (isErrorPermission) {
            router.push("/unauthorized");
        }
    }, [isErrorPermission, router]);

    return !session ? null : !isAllowed && isLoadingPermission ? (
        <Loading />
    ) : (
        <div className="min-h-full">
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

                    <div className="fixed inset-0 z-40 flex">
                        <Transition.Child
                            as={React.Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
                                <Transition.Child
                                    as={React.Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-0 right-0 -mr-12 pt-2">
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
                                <div className="flex flex-shrink-0 items-center px-4">
                                    <img
                                        className="h-8 w-auto"
                                        src="https://tailwindui.com/img/logos/mark.svg?color=purple&shade=500"
                                        alt="Your Company"
                                    />
                                </div>
                                <div className="mt-5 h-0 flex-1 overflow-y-auto">
                                    <nav className="px-2">
                                        <div className="space-y-1">
                                            {navigation.map((item) => (
                                                <NextLink
                                                    href={item.href}
                                                    key={item.name}
                                                    className={clsx(
                                                        router.pathname ==
                                                            item.href
                                                            ? "bg-gray-100 text-gray-900"
                                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                                        "group flex items-center rounded-md px-2 py-2 text-base font-medium leading-5"
                                                    )}
                                                    aria-current={
                                                        router.pathname ==
                                                        item.href
                                                            ? "page"
                                                            : undefined
                                                    }
                                                >
                                                    <item.icon
                                                        className={clsx(
                                                            router.pathname ==
                                                                item.href
                                                                ? "text-gray-500"
                                                                : "text-gray-400 group-hover:text-gray-500",
                                                            "mr-3 h-6 w-6 flex-shrink-0"
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </NextLink>
                                            ))}
                                        </div>
                                        <div className="mt-8">
                                            <NextLink
                                                href={`/workspace/${activeWorkspaceId}/tags`}
                                                className="px-3 text-sm font-medium text-gray-500"
                                                id="mobile-teams-headline"
                                            >
                                                Tags
                                            </NextLink>
                                            <div
                                                className="mt-1 space-y-1"
                                                role="group"
                                                aria-labelledby="mobile-teams-headline"
                                            >
                                                {teams.map((team) => (
                                                    <NextLink
                                                        key={team.name}
                                                        href={team.href}
                                                        className="group flex items-center rounded-md px-3 py-2 text-base font-medium leading-5 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                    >
                                                        <span
                                                            className={clsx(
                                                                team.bgColorClass,
                                                                "mr-4 h-2.5 w-2.5 rounded-full"
                                                            )}
                                                            aria-hidden="true"
                                                        />
                                                        <span className="truncate">
                                                            {team.name}
                                                        </span>
                                                    </NextLink>
                                                ))}
                                            </div>
                                        </div>
                                    </nav>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                        <div className="w-14 flex-shrink-0" aria-hidden="true">
                            {/* Dummy element to force sidebar to shrink to fit close icon */}
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

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
                <div className="mt-6 flex h-0 flex-1 flex-col overflow-y-auto">
                    {/* User account dropdown */}
                    <Menu
                        as="div"
                        className="relative mt-1 inline-block px-3 text-left"
                    >
                        <div>
                            <Menu.Button className="group w-full rounded-md bg-gray-100 px-3.5 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                                <span className="flex w-full items-center justify-between">
                                    <span className="flex min-w-0 items-center justify-between space-x-3">
                                        <Image
                                            height={"40px"}
                                            width={"40px"}
                                            className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
                                            src={
                                                session.user?.image ??
                                                "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            }
                                            alt=""
                                        />
                                        <span className="flex min-w-0 flex-1 flex-col">
                                            <span className="truncate text-sm font-medium text-gray-900">
                                                {session.user?.name}
                                            </span>
                                        </span>
                                    </span>
                                    <ChevronUpDownIcon
                                        className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                        aria-hidden="true"
                                    />
                                </span>
                            </Menu.Button>
                        </div>
                        <Transition
                            as={React.Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 left-0 z-10 mx-3 mt-1 origin-top divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <NextLink
                                                href="#"
                                                className={clsx(
                                                    active
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                )}
                                            >
                                                View profile
                                            </NextLink>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <NextLink
                                                href="/settings"
                                                className={clsx(
                                                    active
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                )}
                                            >
                                                Settings
                                            </NextLink>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <NextLink
                                                href={"/notifications"}
                                                className={clsx(
                                                    active
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                )}
                                            >
                                                Notifications
                                            </NextLink>
                                        )}
                                    </Menu.Item>
                                </div>
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <NextLink
                                                href="#"
                                                className={clsx(
                                                    active
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                )}
                                            >
                                                Get desktop app
                                            </NextLink>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <NextLink
                                                href="#"
                                                className={clsx(
                                                    active
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                )}
                                            >
                                                Support
                                            </NextLink>
                                        )}
                                    </Menu.Item>
                                </div>
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <NextLink
                                                href="/api/auth/signout"
                                                className={clsx(
                                                    active
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                )}
                                            >
                                                Logout
                                            </NextLink>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
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
                                        router.pathname == item.href
                                            ? "bg-gray-200 text-gray-900"
                                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                                        "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                                    )}
                                    aria-current={
                                        router.pathname == item.href
                                            ? "page"
                                            : undefined
                                    }
                                >
                                    <item.icon
                                        className={clsx(
                                            router.pathname == item.href
                                                ? "text-gray-500"
                                                : "text-gray-400 group-hover:text-gray-500",
                                            "mr-3 h-6 w-6 flex-shrink-0"
                                        )}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </NextLink>
                            ))}
                        </div>
                        <div className="mt-8">
                            {/* Secondary navigation */}
                            <NextLink
                                href={`workspace/${activeWorkspaceId}/tags`}
                                className="px-3 text-sm font-medium text-gray-500"
                                id="desktop-teams-headline"
                            >
                                Tags
                            </NextLink>
                            <div
                                className="mt-1 space-y-1"
                                role="group"
                                aria-labelledby="desktop-teams-headline"
                            >
                                {teams.map((team) => (
                                    <NextLink
                                        key={team.name}
                                        href={team.href}
                                        className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                    >
                                        <span
                                            className={clsx(
                                                team.bgColorClass,
                                                "mr-4 h-2.5 w-2.5 rounded-full"
                                            )}
                                            aria-hidden="true"
                                        />
                                        <span className="truncate">
                                            {team.name}
                                        </span>
                                    </NextLink>
                                ))}
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
            {/* Main column */}
            <div className="flex flex-col lg:pl-64">
                {/* Search header */}
                <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white lg:hidden">
                    <button
                        type="button"
                        className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3CenterLeftIcon
                            className="h-6 w-6"
                            aria-hidden="true"
                        />
                    </button>
                    <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
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
                        <div className="flex items-center">
                            {/* Profile dropdown */}
                            <Menu as="div" className="relative ml-3">
                                <div>
                                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                                        <span className="sr-only">
                                            Open user menu
                                        </span>
                                        <Image
                                            height="32px"
                                            width="32px"
                                            className="h-8 w-8 rounded-full"
                                            src={
                                                session.user?.image ??
                                                "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            }
                                            alt=""
                                        />
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={React.Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <NextLink
                                                        href="#"
                                                        className={clsx(
                                                            active
                                                                ? "bg-gray-100 text-gray-900"
                                                                : "text-gray-700",
                                                            "block px-4 py-2 text-sm"
                                                        )}
                                                    >
                                                        View profile
                                                    </NextLink>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <NextLink
                                                        href="/settings"
                                                        className={clsx(
                                                            active
                                                                ? "bg-gray-100 text-gray-900"
                                                                : "text-gray-700",
                                                            "block px-4 py-2 text-sm"
                                                        )}
                                                    >
                                                        Settings
                                                    </NextLink>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <NextLink
                                                        href="#"
                                                        className={clsx(
                                                            active
                                                                ? "bg-gray-100 text-gray-900"
                                                                : "text-gray-700",
                                                            "block px-4 py-2 text-sm"
                                                        )}
                                                    >
                                                        Notifications
                                                    </NextLink>
                                                )}
                                            </Menu.Item>
                                        </div>
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <NextLink
                                                        href="#"
                                                        className={clsx(
                                                            active
                                                                ? "bg-gray-100 text-gray-900"
                                                                : "text-gray-700",
                                                            "block px-4 py-2 text-sm"
                                                        )}
                                                    >
                                                        Support
                                                    </NextLink>
                                                )}
                                            </Menu.Item>
                                        </div>
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <NextLink
                                                        href="/api/auth/signout"
                                                        className={clsx(
                                                            active
                                                                ? "bg-gray-100 text-gray-900"
                                                                : "text-gray-700",
                                                            "block px-4 py-2 text-sm"
                                                        )}
                                                    >
                                                        Logout
                                                    </NextLink>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </div>
                </div>

                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
};
