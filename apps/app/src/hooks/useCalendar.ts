import { dateUtils } from "utils/dateUtils";
import { addMonths } from "date-fns";
import * as React from "react";

export const useCalendar = (initialState?: { activeMonth?: Date }) => {
    const startDate = initialState?.activeMonth ?? new Date();

    const [activeMonth, setActiveMonth] = React.useState(startDate);

    const month = dateUtils.getMonth(activeMonth);

    const handleChangeMonth = (
        action: "increment" | "decrement",
        step?: number,
        callback?: (newMonth: Date) => void
    ) => {
        if (action == "increment") {
            setActiveMonth((prev) => addMonths(prev, step ?? 1));
            callback && callback(addMonths(activeMonth, step ?? 1));
        }
        if (action == "decrement") {
            setActiveMonth((prev) => addMonths(prev, step ?? -1));
            callback && callback(addMonths(activeMonth, step ?? -1));
        }
    };

    return {
        activeMonth,
        handleChangeMonth,
        firstDayOffset: month.firstDayIndex,
        monthName: month.getName(),
        allDates: month.getAllDates(),
    };
};
