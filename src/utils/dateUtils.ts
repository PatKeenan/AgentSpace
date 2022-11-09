import { addDays, getDay } from "date-fns";

export const dateUtils = {
    getMonth: getMonth,
};

function getMonth(month: Date) {
    return {
        getName: (options?: Intl.DateTimeFormatOptions | undefined) =>
            getMonthName(month, options),
        getAllDates: () => getAllDatesInMonth(month),
        firstDayIndex: getDay(
            new Date(month.getFullYear(), month.getMonth(), 1)
        ) as number,
    };
}

function getMonthName(
    month: Date,
    options?: Intl.DateTimeFormatOptions | undefined
) {
    const initialOptions: Intl.DateTimeFormatOptions = {
        ...options,
        month: options?.month ? options?.month : "long",
    };
    return month.toLocaleString("en-US", initialOptions);
}

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
