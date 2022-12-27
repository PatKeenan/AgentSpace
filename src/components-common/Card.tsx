import clsx from "clsx";

export const Card = (props: React.ComponentProps<"div">) => {
    const { className, ...htmlProps } = props;
    return (
        <div
            className={clsx(
                className,
                "relative rounded-md border border-gray-100 bg-white p-4 shadow"
            )}
            {...htmlProps}
        />
    );
};
