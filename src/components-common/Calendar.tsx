/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useCalendar } from "hooks/useCalendar";
import { isToday, isThisMonth, isSameDay, isSameMonth, format } from "date-fns";
import clsx from "clsx";
import * as React from "react";
import { dateUtils } from "utils/dateUtils";

type CalendarProps = {
    selectedDate: Date | undefined;
    activeMonth: Date | undefined;
    statusIndicatorsArr?: string[] | undefined;
    onSelectDay: (selectedDate: Date) => void;
    onChangeMonth?: (newMonth: Date) => void;
    mobileActionButton?: React.ReactNode;
    headerClasses?: string;
    datesClasses?: string;
};

export const Calendar = (props: CalendarProps) => {
    const {
        selectedDate,
        statusIndicatorsArr,
        onSelectDay,
        onChangeMonth,
        activeMonth,
        mobileActionButton,
        headerClasses,
        datesClasses,
    } = props;

    const calendar = useCalendar({
        activeMonth: activeMonth,
    });

    const handleSelectDay = (day: Date) => {
        onSelectDay(day);
    };

    const handleChangeMonth = (action: "increment" | "decrement") => {
        calendar.handleChangeMonth(action, undefined, onChangeMonth);
    };

    const dates = React.useCallback(() => {
        return calendar.allDates;
    }, [calendar.allDates]);

    // Scroll the selected date into view if the date is outside of the viewArea

    function generateRefs() {
        const refs: React.RefObject<HTMLLIElement>[] = [];
        dates().map(() => {
            refs.push(React.createRef<HTMLLIElement>());
        });
        return refs;
    }

    const refsArr = generateRefs();
    const activeDate = dates().find((i) =>
        isSameDay(i, selectedDate || new Date())
    );
    const activeIDX = activeDate ? dates().indexOf(activeDate) : -1;
    React.useLayoutEffect(() => {
        if (activeIDX && refsArr && refsArr.length > 0) {
            refsArr[activeIDX]?.current?.scrollIntoView({
                block: "center",
            });
        }
    }, []);

    return (
        <div
            className={
                "text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 xl:col-start-7"
            }
        >
            {/* Mobile */}
            <div
                className={clsx(
                    headerClasses,
                    "flex items-center justify-between bg-gray-100 p-2 text-gray-900 lg:hidden"
                )}
            >
                <div className="ml-1 flex flex-col text-left">
                    <h4 className="font-medium md:hidden">
                        {calendar.monthName.slice(0, 3)}{" "}
                        {selectedDate?.getFullYear()}
                    </h4>
                    <h4 className="hidden font-medium md:block ">
                        {calendar.monthName} {selectedDate?.getFullYear()}
                    </h4>

                    <span className="lg:hidden">
                        {format(selectedDate || new Date(), "EEEE")}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="m-1 flex items-center divide-x rounded-md shadow-sm md:items-stretch">
                        <button
                            type="button"
                            className="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-white py-2 pl-4 pr-5 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
                            onClick={() => handleChangeMonth("decrement")}
                        >
                            <span className="sr-only">Previous month</span>
                            <ChevronLeftIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                            />
                        </button>

                        <button
                            type="button"
                            className="flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-white py-2 pl-5 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
                            onClick={() => handleChangeMonth("increment")}
                        >
                            <span className="sr-only">Next month</span>
                            <ChevronRightIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                    {mobileActionButton && mobileActionButton}
                </div>
            </div>
            <ul
                className={clsx(
                    "flex overflow-auto bg-white px-2 lg:hidden",
                    datesClasses
                )}
            >
                {dates().map((day, dayIdx) => {
                    const isTodayBoolean = isToday(day);
                    const isCurrentMonthBoolean = isSameMonth(
                        day,
                        calendar.activeMonth
                    );
                    const isSelected = selectedDate
                        ? isSameDay(day, selectedDate)
                        : false;

                    const showStatusIndicator = statusIndicatorsArr?.includes(
                        dateUtils.transform(day).isoDateOnly
                    );

                    return (
                        <li
                            key={dayIdx}
                            className="z-0 mx-3 flex flex-col py-2"
                            ref={refsArr[dayIdx]}
                        >
                            <span className="mb-2 text-xs font-bold text-gray-400">
                                {format(day, "iii")}
                            </span>
                            <DateButton
                                key={dayIdx}
                                isCurrentMonthBoolean={isCurrentMonthBoolean}
                                isSelected={isSelected}
                                isTodayBoolean={isTodayBoolean}
                                statusIndicator={showStatusIndicator}
                                handleSelect={() => handleSelectDay(day)}
                                day={day}
                            />
                        </li>
                    );
                })}
            </ul>
            {/* Desktop */}
            <div className="hidden items-center p-2 text-gray-900 lg:flex">
                <button
                    type="button"
                    className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                    onClick={() => handleChangeMonth("decrement")}
                >
                    <span className="sr-only">Previous month</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <div className="flex-auto font-semibold">
                    <span className="hidden md:block">
                        {calendar.monthName}{" "}
                        {calendar.activeMonth.getFullYear()}
                    </span>
                    <span className="block md:hidden">
                        {calendar.monthName.slice(0, 3)}
                    </span>
                </div>
                <button
                    type="button"
                    className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                    onClick={() => handleChangeMonth("increment")}
                >
                    <span className="sr-only">Next month</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>
            <div className="hidden lg:block">
                <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
                    {["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"].map(
                        (i, idx) => (
                            <div key={idx}>{i}</div>
                        )
                    )}
                </div>
                <div className="isolate mt-2 grid grid-cols-7 gap-px bg-gray-200 text-sm shadow ring-1 ring-gray-200">
                    {[
                        ...Array.from(
                            Array(
                                calendar.firstDayOffset == 0
                                    ? 0
                                    : calendar.firstDayOffset !== 0
                                    ? calendar.firstDayOffset
                                    : 1
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

                        const showStatusIndicator =
                            statusIndicatorsArr?.includes(
                                dateUtils.transform(day).isoDateOnly
                            );
                        return (
                            <DateButton
                                key={dayIdx}
                                isCurrentMonthBoolean={isCurrentMonthBoolean}
                                isSelected={isSelected}
                                isTodayBoolean={isTodayBoolean}
                                statusIndicator={showStatusIndicator}
                                handleSelect={() => handleSelectDay(day)}
                                day={day}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

type DateButtonProps = {
    isCurrentMonthBoolean: boolean;
    isSelected: boolean;
    isTodayBoolean: boolean;
    statusIndicator?: boolean;
    handleSelect: () => void;
    day: Date;
};

const DateButton = ({
    isCurrentMonthBoolean,
    isSelected,
    isTodayBoolean,
    statusIndicator,
    handleSelect,
    day,
}: DateButtonProps) => {
    return (
        <button
            type="button"
            className={clsx(
                "py-1.5 focus:z-10 lg:hover:bg-gray-100",
                isCurrentMonthBoolean ? "bg-white" : "bg-gray-50",
                (isSelected || isToday(day)) && "font-semibold",
                isSelected && "text-white",
                !isSelected &&
                    isThisMonth(day) &&
                    !isTodayBoolean &&
                    "text-gray-900",
                !isSelected &&
                    !isCurrentMonthBoolean &&
                    !isTodayBoolean &&
                    "text-gray-400",
                isTodayBoolean && !isSelected && "text-indigo-600"
            )}
            onClick={() => handleSelect()}
        >
            <time
                dateTime={day.toDateString()}
                className={clsx(
                    "relative mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                    isSelected && isTodayBoolean && "bg-indigo-600",
                    isSelected && !isTodayBoolean && "bg-gray-900"
                )}
            >
                {String(day.getDate())}
                {!isSelected && statusIndicator && (
                    <div className="absolute -bottom-1 h-[4px] w-[4px] rounded-full bg-green-600 lg:bottom-0" />
                )}
            </time>
        </button>
    );
};
