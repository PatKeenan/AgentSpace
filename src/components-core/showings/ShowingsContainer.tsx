import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { SectionHeading, Breadcrumb, PageBody } from "components-layout";
import { useWorkspace, useCalendar, useShowings } from "hooks";
import { Loading, NoData, Button } from "components-common";
import { TruckIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import * as React from "react";
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

import { AddShowingModal, ShowingCard } from "./showings-components";
import { useShowingsUI } from "./useShowingsUI";

import type { NextPageExtended } from "types/index";
import { dateUtils } from "utils/dateUtils";

function isEmpty(arr: any[] | undefined) {
    if (!arr || typeof arr == "undefined") return true;
    if (arr.length == 0) return true;
    return false;
}

export const ShowingsContainer: NextPageExtended = () => {
    const calendar = useCalendar({ activeMonth: new Date() });
    const showings = useShowings();
    const workspace = useWorkspace();
    const showingUI = useShowingsUI();
    const router = useRouter();

    const [selectedDate, setSelectedDate] = React.useState<Date>(
        () => new Date()
    );

    const showingsQuery = showings.getByMonth(
        {
            workspaceId: workspace.id as string,
            date: String(calendar.activeMonth),
        },
        { refetchOnWindowFocus: false }
    );

    const statusIndicators = React.useMemo(
        () => showingsQuery.data?.flatMap((i) => i.date),
        [showingsQuery.data]
    );

    const filteredShowingsByDate = React.useCallback(() => {
        const data = showingsQuery.data?.filter(
            (i) =>
                dateUtils.transform(i.date).isoDateOnly ==
                dateUtils.transform(selectedDate).isoDateOnly
        );

        if (data) {
            return data;
        }
        return [];
    }, [selectedDate, showingsQuery]);

    ///////////////////////////////////
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
            <AddShowingModal
                selectedDate={selectedDate}
                onSuccessCallback={() => showingsQuery.refetch()}
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
                                : `${format(selectedDate, "EEEE")}, `}
                            {format(selectedDate, "PPP")}
                        </p>
                    </SectionHeading.TitleContainer>
                </SectionHeading>

                <div className="mt-10 lg:grid lg:grid-cols-12 lg:gap-x-16">
                    <div className="text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 xl:col-start-7">
                        <div className="flex items-center text-gray-900">
                            <button
                                type="button"
                                className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                                onClick={() =>
                                    calendar.handleChangeMonth("decrement")
                                }
                            >
                                <span className="sr-only">Previous month</span>
                                <ChevronLeftIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </button>
                            <div className="flex-auto font-semibold">
                                {calendar.monthName}
                            </div>
                            <button
                                type="button"
                                className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                                onClick={() =>
                                    calendar.handleChangeMonth("increment")
                                }
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
                                        calendar.firstDayOffset !== 0
                                            ? calendar.firstDayOffset - 1
                                            : 0
                                    ).keys()
                                ),
                            ].map((i) => (
                                <div className="h-7 w-7" key={i}></div>
                            ))}

                            {calendar.allDates.map((day, dayIdx) => {
                                const isTodayBoolean = isToday(day);
                                const isCurrentMonthBoolean = isSameMonth(
                                    day,
                                    calendar.activeMonth
                                );
                                const isSelected = selectedDate
                                    ? isSameDay(day, selectedDate)
                                    : false;

                                const hasShowingsOnDate =
                                    statusIndicators?.includes(
                                        dateUtils.transform(day).isoDateOnly
                                    );
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
                                            {!isSelected &&
                                                hasShowingsOnDate && (
                                                    <div className="absolute bottom-0 h-[4px] w-[4px] rounded-full bg-green-600" />
                                                )}
                                        </time>
                                    </button>
                                );
                            })}
                        </div>
                        <Button
                            variant="primary"
                            className="mt-4 w-full justify-center"
                            onClick={() => showingUI.setModalOpen(true)}
                        >
                            Add Showing
                        </Button>
                    </div>
                    <div className="mt-4  lg:col-span-7 xl:col-span-6">
                        <ol className=" divide-y divide-gray-100 text-sm leading-6">
                            {showingsQuery.isLoading && !showingsQuery.data ? (
                                <Loading />
                            ) : !isEmpty(filteredShowingsByDate()) ? (
                                filteredShowingsByDate().map((showing, idx) => (
                                    <li
                                        key={showing.id}
                                        className="relative flex space-x-6 py-6 xl:static"
                                    >
                                        <ShowingCard
                                            showing={showing}
                                            index={idx}
                                        />
                                    </li>
                                ))
                            ) : (
                                <div className="grid h-full w-full place-items-center">
                                    <NoData
                                        icon={TruckIcon}
                                        title="No Showings"
                                        message="Get started by adding a showing for this date."
                                    />
                                </div>
                            )}
                        </ol>
                    </div>
                </div>
            </PageBody>
        </>
    );
};

ShowingsContainer.layout = "dashboard";
