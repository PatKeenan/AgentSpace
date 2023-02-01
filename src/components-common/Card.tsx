import clsx from "clsx";

const paddingOptions = {
    sm: "p-2 md:p-4",
    md: "p-3 md:p-6",
    lg: "p-6 md:p-12",
};

export const Card = (
    props: React.ComponentProps<"div"> & {
        paddingSize?: keyof typeof paddingOptions;
    }
) => {
    const { className, paddingSize = "md", ...htmlProps } = props;
    return (
        <div
            className={clsx(
                className,
                paddingOptions[paddingSize],
                "group relative block rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 "
            )}
            {...htmlProps}
        />
    );
};
