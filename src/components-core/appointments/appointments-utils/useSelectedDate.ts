/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

export const useSelectedDate = (defaultDate: Date) => {
    const [date, setDate] = React.useState<Date>(() => {
        const localStoredDate = localStorage.getItem("selected-date");
        return localStoredDate ? new Date(localStoredDate) : defaultDate;
    });
    const [activeMonth, setActiveMonth] = React.useState<Date>(() => {
        const localStoredMonth = localStorage.getItem("selected-month");
        return localStoredMonth ? new Date(localStoredMonth) : defaultDate;
    });

    const handleSetDate = (date: Date) => {
        localStorage.setItem("selected-date", date.toString());
        setDate(date);
    };
    const handleSetMonth = (date: Date) => {
        localStorage.setItem("selected-month", date.toString());
        setActiveMonth(date);
    };

    React.useEffect(() => {
        const localDate = localStorage.getItem("selected-date");
        const localMonth = localStorage.getItem("selected-month");
        if (
            window &&
            typeof window !== "undefined" &&
            localDate &&
            localMonth
        ) {
            handleSetDate(new Date(localDate));
            handleSetMonth(new Date(localMonth));
        }
        if (
            window &&
            typeof window !== "undefined" &&
            !localDate &&
            !localMonth
        ) {
            localStorage.setItem("selected-date", defaultDate.toString());
            localStorage.setItem("selected-month", defaultDate.toString());
        }
    }, []);

    return {
        selectedDate: date,
        setSelectedDate: handleSetDate,
        activeMonth,
        setActiveMonth: handleSetMonth,
    };
};
