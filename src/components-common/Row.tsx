import clsx from "clsx";

import type { RowColProps } from "./types";

export const Row = (props: RowColProps) => {
    const { className, ...htmlProps } = props;
    return (
        <div
            className={clsx(className, "flex w-full flex-wrap")}
            {...htmlProps}
        />
    );
};
