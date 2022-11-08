import { Fragment, useEffect, useRef } from "react";
import {
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";

import { Menu, Transition } from "@headlessui/react";
import { NextPageExtended } from "types/index";
import { PageBody } from "components-layout/PageBody";
import { SectionHeading } from "components-layout/SectionHeading";
import { Breadcrumb } from "components-layout/Breadcrumb";
import { useRouter } from "next/router";
import { CalendarIcon, MapPinIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import {
    getMonth,
    addMonths,
    isToday,
    isThisMonth,
    isSameDay,
    isSameMonth,
    format,
    getDaysInMonth,
    addDays,
    getDay,
    isTomorrow,
} from "date-fns";

import * as React from "react";
import { trpc } from "utils/trpc";
import { Loading } from "components-common/Loading";
import { useWorkspace } from "hooks/useWorkspace";
import { NextLink } from "components-common/NextLink";
import { formatDate } from "utils/formatDate";

const dayOffset = {
    Monday: "ml-0",
    Tuesday: "ml-[1.75rem]",
    Wednesday: "ml-[3.5rem]",
    Thursday: "ml-[7rem]",
    Friday: "ml-[8.75rem]",
    Saturday: "ml-[10.5rem]",
    Sunday: "ml-[12.25rem]",
};

export const Showings2Container: NextPageExtended = () => {
    const [monthInView, setMonthInView] = React.useState(new Date());
    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

    const router = useRouter();
    const workspace = useWorkspace();

    const getMonthName = () => {
        return monthInView.toLocaleString("en-US", { month: "long" });
    };

    const getAllDatesInMonth = (month: Date) => {
        const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
        const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);

        const dates = [];

        let startDate = firstDay;
        while (startDate <= lastDay) {
            dates.push(new Date(startDate));
            startDate = addDays(startDate, 1);
        }
        return dates;
    };

    const handleChangeDate = (action: "increment" | "decrement") => {
        if (action == "increment") {
            setMonthInView((prev) => addMonths(prev, 1));
        }
        if (action == "decrement") {
            setMonthInView((prev) => addMonths(prev, -1));
        }
    };
    const firstDayOfMonthOffset = () => {
        const firstDayInMonth = new Date(
            monthInView.getFullYear(),
            monthInView.getMonth(),
            1
        );
        return getDay(firstDayInMonth) as number;
    };

    return (
        <>
            <Breadcrumb
                items={[
                    {
                        title: "Showings",
                        href: `/workspace/${router.query.workspaceId}/showings`,
                    },
                ]}
            />
            <PageBody>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>Showings </SectionHeading.Title>
                        <p className="mt-2 text-lg font-normal">
                            {isToday(selectedDate)
                                ? "Today"
                                : isTomorrow(selectedDate)
                                ? "Tomorrow"
                                : null}{" "}
                            {format(selectedDate, "PPP")}
                        </p>
                    </SectionHeading.TitleContainer>
                </SectionHeading>

                <div className="mt-10 lg:grid lg:grid-cols-12 lg:gap-x-16">
                    <div className="text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 xl:col-start-9">
                        <div className="flex items-center text-gray-900">
                            <button
                                type="button"
                                className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                                onClick={() => handleChangeDate("decrement")}
                            >
                                <span className="sr-only">Previous month</span>
                                <ChevronLeftIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </button>
                            <div className="flex-auto font-semibold">
                                {getMonthName()}
                            </div>
                            <button
                                type="button"
                                className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                                onClick={() => handleChangeDate("increment")}
                            >
                                <span className="sr-only">Next month</span>
                                <ChevronRightIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                        <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
                            {["M", "T", "W", "T", "F", "S", "S"].map(
                                (i, idx) => (
                                    <div key={idx}>{i}</div>
                                )
                            )}
                        </div>
                        <div className="isolate mt-2 grid grid-cols-7 gap-px bg-gray-200 text-sm shadow ring-1 ring-gray-200">
                            {[
                                ...Array.from(
                                    Array(
                                        firstDayOfMonthOffset() !== 0
                                            ? firstDayOfMonthOffset() - 1
                                            : 0
                                    ).keys()
                                ),
                            ].map((i) => (
                                <div className="h-7 w-7" key={i}></div>
                            ))}

                            {getAllDatesInMonth(monthInView).map(
                                (day, dayIdx) => {
                                    const isTodayBoolean = isToday(day);
                                    const isCurrentMonthBoolean = isSameMonth(
                                        day,
                                        monthInView
                                    );
                                    const isSelected = selectedDate
                                        ? isSameDay(day, selectedDate)
                                        : false;

                                    return (
                                        <button
                                            key={dayIdx}
                                            type="button"
                                            className={clsx(
                                                "py-1.5 hover:bg-gray-100 focus:z-10",
                                                isCurrentMonthBoolean
                                                    ? "bg-white"
                                                    : "bg-gray-50",
                                                (isSelected || isToday(day)) &&
                                                    "font-semibold",
                                                isSelected && "text-white",
                                                !isSelected &&
                                                    isThisMonth(day) &&
                                                    !isTodayBoolean &&
                                                    "text-gray-900",
                                                !isSelected &&
                                                    !isCurrentMonthBoolean &&
                                                    !isTodayBoolean &&
                                                    "text-gray-400",
                                                isTodayBoolean &&
                                                    !isSelected &&
                                                    "text-indigo-600"
                                            )}
                                            onClick={() => setSelectedDate(day)}
                                        >
                                            <time
                                                dateTime={day.toDateString()}
                                                className={clsx(
                                                    "mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                                                    isSelected &&
                                                        isTodayBoolean &&
                                                        "bg-indigo-600",
                                                    isSelected &&
                                                        !isTodayBoolean &&
                                                        "bg-gray-900"
                                                )}
                                            >
                                                {String(day.getDate())}
                                            </time>
                                        </button>
                                    );
                                }
                            )}
                        </div>
                        <button
                            type="button"
                            className="mt-8 w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Add Showing
                        </button>
                    </div>
                    <div className="lg:col-span-7 xl:col-span-8">
                        <ol className="mt-4 divide-y divide-gray-100 text-sm leading-6">
                            {/* {isLoading && !data ? (
                                <Loading />
                            ) : data ? (
                                data.map((showingGroup) => (
                                    <li key={showingGroup.id}>
                                        <NextLink
                                            href={`/workspace/${showingGroup.workspaceId}/showings/${showingGroup.id}`}
                                            className="group block hover:bg-gray-50"
                                        >
                                            <div className="flex items-center px-4 py-4 sm:px-6">
                                                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                                    <div className="truncate">
                                                        <p className="truncate text-base font-medium text-gray-600 group-hover:text-purple-600">
                                                            {showingGroup.title}
                                                        </p>
                                                        <div className="mt-2 flex">
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <CalendarIcon
                                                                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                                    aria-hidden="true"
                                                                />

                                                                <time
                                                                    dateTime={formatDate(
                                                                        showingGroup.date
                                                                    )}
                                                                >
                                                                    {formatDate(
                                                                        showingGroup.date
                                                                    )}
                                                                </time>
                                                            </div>
                                                            <div className="ml-4 flex items-center text-sm text-gray-500">
                                                                <MapPinIcon
                                                                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                                    aria-hidden="true"
                                                                />
                                                                <p>
                                                                    {
                                                                        showingGroup
                                                                            .showings
                                                                            .length
                                                                    }{" "}
                                                                    showing
                                                                    {showingGroup
                                                                        .showings
                                                                        .length !==
                                                                        1 &&
                                                                        "s"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="ml-5 flex-shrink-0">
                                                    <ChevronRightIcon
                                                        className="h-5 w-5 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                            </div>
                                        </NextLink>
                                    </li>
                                ))
                            ) : null} */}
                        </ol>
                    </div>
                </div>
            </PageBody>
        </>
    );
};

Showings2Container.layout = "dashboard";
