import clsx from "clsx";

const colsOptions = {
    4: "grid-cols-4",
    3: "grid-cols-3",
    2: "grid-cols-2",
    1: "grid-cols-1",
};
const colSpan = {
    4: "col-span-4",
    3: "col-span-3",
    2: "col-span-2",
    1: "col-span-1",
};

export const DetailsRow = (
    props: {
        title: string;
        value?: string | null;
        action?: React.ReactNode;
        titleSpan?: keyof typeof colSpan;
        valueSpan?: keyof typeof colSpan;
        actionSpan?: keyof typeof colSpan;
        cols?: keyof typeof colsOptions;
    } & React.ComponentProps<"div">
) => {
    const {
        title,
        value = "---",
        action,
        className,
        cols = 4,
        actionSpan = 1,
        valueSpan = 2,
        titleSpan = 1,
        ...htmlProps
    } = props;
    return (
        <div
            className={clsx(colsOptions[cols], "grid items-center", className)}
            {...htmlProps}
        >
            <dt
                className={clsx(
                    colSpan[titleSpan],
                    "text-gray-899 text-sm font-medium"
                )}
            >
                {title}
            </dt>
            <dd className={clsx(colSpan[valueSpan], "truncate text-gray-600")}>
                {value}
            </dd>
            {action ? (
                <div className={clsx(colSpan[actionSpan], "ml-auto")}>
                    {action}
                </div>
            ) : null}
        </div>
    );
};
