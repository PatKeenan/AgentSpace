import clsx from "clsx";

import type { RowColProps } from "./types";

export const Col = (props: RowColProps) => {
    const { className, ...htmlProps } = props;
    return (
        <div
            className={clsx(className, "flex flex-auto flex-col")}
            {...htmlProps}
        ></div>
    );
};
