import { Breadcrumb, PageBody, SectionHeading } from "components-common";
import { useWorkspace } from "hooks/useWorkspace";
import { classNames } from "utils/classNames";
import { exists } from "utils/helpers";

import type { NextPageExtended } from "types/index";
import Link from "next/link";
import {
    Cog6ToothIcon,
    ExclamationTriangleIcon,
    TruckIcon,
    UserGroupIcon,
    ViewColumnsIcon,
} from "@heroicons/react/20/solid";
import { SidebarList } from "components-core/contactDetail/contact-detail-components/SidebarList";
import { format } from "date-fns";
import clsx from "clsx";
import {
    statusColorsLight,
    statusDisplay,
} from "components-core/appointments/appointments-utils";
import { trpc } from "utils/trpc";

export const HomeContainer: NextPageExtended = () => {
    const workspace = useWorkspace();

    const { data: user } = trpc.user.getUserInfo.useQuery(undefined, {
        refetchOnWindowFocus: false,
    });
    const { data } = workspace.getDashboard(
        { workspaceId: workspace.id as string },
        { enabled: exists(workspace.id), refetchOnWindowFocus: false }
    );
    const actions = [
        {
            icon: UserGroupIcon,
            name: "Contacts",
            href: `/workspace/${workspace.id}/contacts`,
            iconForeground: "text-teal-700",
            iconBackground: "bg-teal-50",
        },
        {
            icon: TruckIcon,
            name: "Appointments",
            href: `/workspace/${workspace.id}/appointments`,
            iconForeground: "text-purple-700",
            iconBackground: "bg-purple-50",
        },

        {
            icon: ViewColumnsIcon,
            name: "Tasks",
            href: `/workspace/${workspace.id}/tasks`,
            iconForeground: "text-yellow-700",
            iconBackground: "bg-yellow-50",
        },
        {
            icon: Cog6ToothIcon,
            name: "Settings",
            href: `/settings`,
            iconForeground: "text-sky-700",
            iconBackground: "bg-sky-50",
        },
    ];

    return (
        <>
            <div className="flex items-center bg-red-100 px-4 py-2 text-sm">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <p className="ml-2 font-bold">Warning:</p>
                <p className="ml-2 text-sm text-gray-800">
                    All data entered into the app during beta has the chance of
                    being deleted at any point.
                </p>
            </div>
            <Breadcrumb
                isHome
                items={[{ title: "Home", href: `/workspace/${workspace.id}` }]}
            />

            <PageBody>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>Dashboard</SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                </SectionHeading>
                <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
                    {/* Left side */}
                    <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                            <section aria-labelledby="dashboard-overview-title">
                                <div
                                    className="relative overflow-hidden rounded-md border border-gray-200  bg-white 
                                shadow "
                                >
                                    <h2
                                        className="sr-only"
                                        id="dashboard-overview-title"
                                    >
                                        {data?.title}
                                    </h2>
                                    <div className="bg-white p-6">
                                        <div className="sm:flex sm:items-center sm:justify-between">
                                            <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                                                <p className="text-sm font-medium text-gray-600">
                                                    Welcome,
                                                </p>
                                                <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                                                    {user?.name ||
                                                        user?.email ||
                                                        "User"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
                                        <div className="px-6 py-5 text-center text-sm font-medium">
                                            <Link
                                                href={`/workspace/${workspace.id}/appointments`}
                                                passHref
                                            >
                                                <a className="hover:underline">
                                                    <span className="text-gray-900">
                                                        {
                                                            data?._count
                                                                .appointments
                                                        }
                                                    </span>{" "}
                                                    <span className="text-gray-600">
                                                        Appointment
                                                        <span
                                                            className={clsx(
                                                                data?._count &&
                                                                    data._count
                                                                        ?.appointments >
                                                                        1
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        >
                                                            s
                                                        </span>
                                                    </span>
                                                </a>
                                            </Link>
                                        </div>
                                        <div className="px-6 py-5 text-center text-sm font-medium">
                                            <Link
                                                href={`/workspace/${workspace.id}/contacts`}
                                                passHref
                                            >
                                                <a className="hover:underline">
                                                    <span className="text-gray-900">
                                                        {data?._count.contacts}
                                                    </span>{" "}
                                                    <span className="text-gray-600">
                                                        Contact
                                                        <span
                                                            className={clsx(
                                                                data?._count &&
                                                                    data._count
                                                                        ?.contacts >
                                                                        1
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        >
                                                            s
                                                        </span>
                                                    </span>
                                                </a>
                                            </Link>
                                        </div>
                                        <div className="px-6 py-5 text-center text-sm font-medium">
                                            <Link
                                                href={`/workspace/${workspace.id}/tasks`}
                                                passHref
                                            >
                                                <a className="hover:underline">
                                                    <span className="text-gray-900">
                                                        {data?._count.tasks}
                                                    </span>{" "}
                                                    <span className="text-gray-600">
                                                        Task
                                                        <span
                                                            className={clsx(
                                                                data?._count &&
                                                                    data._count
                                                                        ?.tasks >
                                                                        1
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        >
                                                            s
                                                        </span>
                                                    </span>
                                                </a>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section aria-labelledby="quick-links-title">
                                <div
                                    className="divide-y divide-gray-200 overflow-hidden rounded-md border border-gray-200 bg-gray-200 shadow  sm:grid sm:grid-cols-2  sm:gap-px 
                                sm:divide-y-0 "
                                >
                                    <h2
                                        className="sr-only"
                                        id="quick-links-title"
                                    >
                                        Quick links
                                    </h2>
                                    {actions.map((action, actionIdx) => (
                                        <div
                                            key={action.name}
                                            className={classNames(
                                                actionIdx === 0
                                                    ? "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none"
                                                    : "",
                                                actionIdx === 1
                                                    ? "sm:rounded-tr-lg"
                                                    : "",
                                                actionIdx === actions.length - 2
                                                    ? "sm:rounded-bl-lg"
                                                    : "",
                                                actionIdx === actions.length - 1
                                                    ? "rounded-bl-lg rounded-br-lg sm:rounded-bl-none"
                                                    : "",
                                                "group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 "
                                            )}
                                        >
                                            <div>
                                                <span
                                                    className={classNames(
                                                        action.iconBackground,
                                                        action.iconForeground,
                                                        "inline-flex rounded-lg p-3 ring-4 ring-white"
                                                    )}
                                                >
                                                    <action.icon
                                                        className="h-6 w-6"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            </div>
                                            <div className="mt-8">
                                                <h3 className="text-lg font-medium">
                                                    <Link
                                                        href={action.href}
                                                        passHref
                                                    >
                                                        <a className="focus:outline-none">
                                                            {/* Extend touch target to entire panel */}
                                                            <span
                                                                className="absolute inset-0"
                                                                aria-hidden="true"
                                                            />
                                                            {action.name}
                                                        </a>
                                                    </Link>
                                                </h3>
                                                <p className="mt-2 text-sm text-gray-500">
                                                    Doloribus dolores nostrum
                                                    quia qui natus officia quod
                                                    et dolorem. Sit repellendus
                                                    qui ut at blanditiis et quo
                                                    et molestiae.
                                                </p>
                                            </div>
                                            <span
                                                className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                                                aria-hidden="true"
                                            >
                                                <svg
                                                    className="h-6 w-6"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                                                </svg>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                    {/* Right side */}
                    <div className="grid grid-cols-1 gap-4">
                        <SidebarList
                            title="Upcoming Appointments"
                            data={data?.appointments}
                            href={`/workspace/${workspace.id}/appointments`}
                            renderItem={(i) => {
                                const rawDate = new Date(i.date);
                                const formattedDate = format(
                                    new Date(
                                        rawDate.getUTCFullYear(),
                                        rawDate.getUTCMonth(),
                                        rawDate.getUTCDate()
                                    ),
                                    "MM/dd/yyyy"
                                );
                                return (
                                    <Link
                                        href={`/workspace/${workspace.id}/appointments/${i.id}`}
                                        passHref
                                    >
                                        <a>
                                            <div className="relative focus-within:ring-2 focus-within:ring-cyan-500 hover:underline">
                                                <h3 className="text-sm font-semibold text-gray-800">
                                                    {formattedDate}
                                                    <span
                                                        className={clsx(
                                                            i.status &&
                                                                statusColorsLight[
                                                                    i.status
                                                                ],
                                                            "capitalize",
                                                            "top-0 right-0 rounded-md px-2 py-1 text-xs md:absolute"
                                                        )}
                                                    >
                                                        {statusDisplay(
                                                            i.status
                                                        )}
                                                    </span>
                                                </h3>
                                                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                                                    {i.address}
                                                </p>
                                            </div>
                                        </a>
                                    </Link>
                                );
                            }}
                        />
                        <SidebarList
                            title="Tasks"
                            data={data?.tasks}
                            href={`/workspace/${workspace.id}/tasks`}
                            renderItem={(i) => (
                                <div key={i.id} className="relative">
                                    <p className=" text-sm font-medium capitalize text-gray-800">
                                        {i.status
                                            .toLowerCase()
                                            .replace("_", " ")}
                                    </p>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {i.task}
                                    </p>
                                </div>
                            )}
                        />
                    </div>
                </div>
            </PageBody>
        </>
    );
};

HomeContainer.layout = "dashboard";
