import clsx from "clsx";

export const GridCard = (props: React.ComponentProps<"div">) => {
    const { className, ...htmlProps } = props;
    return (
        <div
            className={clsx(
                className,
                "relative rounded-md border border-gray-200 bg-white p-4 shadow"
            )}
            {...htmlProps}
        />
    );
};
