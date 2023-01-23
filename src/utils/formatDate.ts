type FormatOptions = {
    M: number;
    D: number;
    "MM/DD": string;
    "MM/DD/YYYY": string;
    "YYYY-MM-DD": string;
    "YYYY-MM": string;
};

export const formatDate = (
    date: Date | string | null,
    format?: keyof FormatOptions
) => {
    if (!date) throw new Error("Expected a date");

    const baseDate = new Date(date);

    const year = baseDate.getFullYear();
    const month = baseDate.getMonth() + 1;
    const day = baseDate.getDate();
    const dateFormats: FormatOptions = {
        M: month,
        D: day,
        "MM/DD": month + "/" + day,
        "MM/DD/YYYY": month + "/" + day + "/" + year,
        "YYYY-MM-DD": `${year}-${month <= 9 ? "0" + month : month}-${
            day <= 9 ? "0" + day : day
        }`,
        "YYYY-MM": `${year}-${month <= 9 ? "0" + month : month}`,
    };
    return dateFormats[format ?? "MM/DD/YYYY"] as string;
};

// string date should be in the following format Ex: 2022-04-10
export const formatStringToDate = (stringDate: string): Date | null => {
    const dateArr = stringDate.split("-");
    if (dateArr && dateArr.length == 3) {
        const year = Number(dateArr[0]);
        const month = Number(dateArr[1]) - 1;
        const day = Number(dateArr[2]);

        return new Date(year, month, day);
    }

    return null;
};

// Function that returns different format options for a javascript date object
export const getFormattedDate = (date: Date, format: string) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return format
        .replace("YYYY", year.toString())
        .replace("MM", month <= 9 ? "0" + month : month.toString())
        .replace("DD", day <= 9 ? "0" + day : day.toString());
};
