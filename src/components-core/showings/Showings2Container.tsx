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
    isToday,
    isThisMonth,
    isSameDay,
    isSameMonth,
    format,
    isTomorrow,
    isYesterday,
} from "date-fns";

import * as React from "react";
import { useWorkspace } from "hooks/useWorkspace";
import { useCalendar } from "hooks/useCalendar";
import { addDays } from "date-fns";

export const Showings2Container: NextPageExtended = () => {
    const {
        activeMonth,
        handleChangeMonth,
        firstDayOffset,
        allDates,
        monthName,
    } = useCalendar({ activeMonth: new Date() });

    const [selectedDate, setSelectedDate] = React.useState<Date>(
        () => new Date()
    );

    const router = useRouter();
    const workspace = useWorkspace();

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
                                ? "Today "
                                : isTomorrow(selectedDate)
                                ? "Tomorrow "
                                : isYesterday(selectedDate)
                                ? "Yesterday "
                                : null}
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
                                onClick={() => handleChangeMonth("decrement")}
                            >
                                <span className="sr-only">Previous month</span>
                                <ChevronLeftIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </button>
                            <div className="flex-auto font-semibold">
                                {monthName}
                            </div>
                            <button
                                type="button"
                                className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                                onClick={() => handleChangeMonth("increment")}
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
                                        firstDayOffset !== 0
                                            ? firstDayOffset - 1
                                            : 0
                                    ).keys()
                                ),
                            ].map((i) => (
                                <div className="h-7 w-7" key={i}></div>
                            ))}

                            {allDates.map((day, dayIdx) => {
                                const isTodayBoolean = isToday(day);
                                const isCurrentMonthBoolean = isSameMonth(
                                    day,
                                    activeMonth
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
                                                "relative mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                                                isSelected &&
                                                    isTodayBoolean &&
                                                    "bg-indigo-600",
                                                isSelected &&
                                                    !isTodayBoolean &&
                                                    "bg-gray-900"
                                            )}
                                        >
                                            {String(day.getDate())}
                                            {!isSelected && isTomorrow(day) && (
                                                <div className="absolute bottom-0 h-[4px] w-[4px] rounded-full bg-green-600" />
                                            )}
                                        </time>
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            type="button"
                            className="mt-8 w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Add Showing
                        </button>
                    </div>
                </div>
            </PageBody>
        </>
    );
};

Showings2Container.layout = "dashboard";
