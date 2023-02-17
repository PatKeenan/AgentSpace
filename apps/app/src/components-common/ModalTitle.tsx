import clsx from "clsx";
import React from "react";

export const ModalTitle = (props: React.ComponentProps<"h3">) => {
    const { className, ...htmlProps } = props;
    return (
        <h3
            className={clsx(
                className,
                "text-md border-b pb-2 text-center font-medium leading-6"
            )}
            {...htmlProps}
        />
    );
};
