import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useCalendar } from "hooks/useCalendar";
import { isToday, isThisMonth, isSameDay, isSameMonth } from "date-fns";
import clsx from "clsx";
import { dateUtils } from "utils/dateUtils";

type CalendarProps = {
    selectedDate: Date | undefined;
    activeMonth: Date | undefined;
    statusIndicatorsArr?: string[] | undefined;
    onSelectDay: (selectedDate: Date) => void;
    onChangeMonth?: (newMonth: Date) => void;
};

export const Calendar = (props: CalendarProps) => {
    const {
        selectedDate,
        statusIndicatorsArr,
        onSelectDay,
        onChangeMonth,
        activeMonth,
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

    return (
        <div className="text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 xl:col-start-7">
            <div className="flex items-center p-2 text-gray-900">
                <button
                    type="button"
                    className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                    onClick={() => handleChangeMonth("decrement")}
                >
                    <span className="sr-only">Previous month</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <div className="flex-auto font-semibold">
                    {calendar.monthName}
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
            <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
                {["M", "T", "W", "T", "F", "S", "S"].map((i, idx) => (
                    <div key={idx}>{i}</div>
                ))}
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

                    const hasEventOnDay = statusIndicatorsArr?.includes(
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
                                isTodayBoolean &&
                                    !isSelected &&
                                    "text-indigo-600"
                            )}
                            onClick={() => handleSelectDay(day)}
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
                                {!isSelected && hasEventOnDay && (
                                    <div className="absolute bottom-0 h-[4px] w-[4px] rounded-full bg-green-600" />
                                )}
                            </time>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
