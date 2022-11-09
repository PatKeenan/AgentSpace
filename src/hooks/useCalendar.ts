import { addMonths } from "date-fns";
import * as React from "react";
import { dateUtils } from "utils/dateUtils";

export const useCalendar = (initialState?: { activeMonth?: Date }) => {
    const startDate = initialState?.activeMonth ?? new Date();

    const [activeMonth, setActiveMonth] = React.useState(startDate);

    const month = dateUtils.getMonth(activeMonth);

    const handleChangeMonth = (
        action: "increment" | "decrement",
        step?: number
    ) => {
        if (action == "increment") {
            setActiveMonth((prev) => addMonths(prev, step ?? 1));
        }
        if (action == "decrement") {
            setActiveMonth((prev) => addMonths(prev, step ?? -1));
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
