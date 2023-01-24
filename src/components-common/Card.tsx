import clsx from "clsx";

export const Card = (props: React.ComponentProps<"div">) => {
    const { className, ...htmlProps } = props;
    return (
        <div
            className={clsx(
                className,
                "group relative block rounded-md border border-gray-200 p-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 md:p-6"
            )}
            {...htmlProps}
        />
    );
};
