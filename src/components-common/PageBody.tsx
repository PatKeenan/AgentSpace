/* eslint-disable react/display-name */
import clsx from "clsx";
import { ChildrenProps } from "types/index";

export const PageBody = (props: {
    children: ChildrenProps;
    fullWidth?: boolean;
    noMaxWidth?: boolean;
    fullHeight?: boolean;
    extraClassName?: string;
    noPadding?: boolean;
}) => {
    const {
        fullWidth,
        fullHeight,
        noMaxWidth = false,
        noPadding = false,
        extraClassName,
        ...rest
    } = props;
    return fullWidth ? (
        <div
            className={clsx(
                fullHeight && "h-full flex-grow",
                "pt-0 pb-16 sm:pt-4 lg:pt-8",
                extraClassName
            )}
            {...rest}
        />
    ) : (
        <div
            className={clsx(
                fullHeight && "h-full lg:h-[calc(100vh-3.5rem)]",
                noMaxWidth ? "w-full" : "max-w-7xl ",
                noPadding ? "px-0" : "sm:px-4",
                "relative mx-auto",
                extraClassName
            )}
        >
            <div
                className={clsx(
                    fullHeight &&
                        "flex-1 flex-col overflow-auto lg:flex lg:h-full",
                    "px-2 pt-0 pb-4 lg:mx-6 lg:pt-8 "
                )}
                {...rest}
            />
        </div>
    );
};
