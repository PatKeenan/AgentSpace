/* eslint-disable react/display-name */
import clsx from "clsx";
import { ChildrenProps } from "types/index";

export const PageBody = (props: {
    children: ChildrenProps;
    fullWidth?: boolean;
    noMaxWidth?: boolean;
    fullHeight?: boolean;
}) => {
    const { fullWidth, fullHeight, noMaxWidth = false, ...rest } = props;
    return fullWidth ? (
        <div
            className={clsx(
                fullHeight && "h-full flex-grow",
                "pt-2 pb-16 sm:pt-4 lg:pt-8"
            )}
            {...rest}
        />
    ) : (
        <div
            className={clsx(
                fullHeight && "h-[calc(100vh-3.5rem)]",
                noMaxWidth ? "w-full" : "max-w-6xl ",
                "relative mx-auto px-4 md:px-8"
            )}
        >
            <div
                className={clsx(
                    fullHeight && "flex h-full flex-1 flex-col overflow-auto",
                    "pt-2 pb-16 sm:pt-4 lg:pt-8"
                )}
                {...rest}
            />
        </div>
    );
};
