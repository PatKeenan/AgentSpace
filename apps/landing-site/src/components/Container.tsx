import clsx from "clsx";
import React from "react";

export const Container = ({
    className,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={clsx(
                "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
                className
            )}
            {...props}
        />
    );
};
