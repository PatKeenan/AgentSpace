/* eslint-disable react/display-name */
import clsx from "clsx";
import { ChildrenProps } from "types/index";

export const PageBody = (props: {
    children: ChildrenProps;
    fullWidth?: boolean;
    noMaxWidth?: boolean;
    fullHeight?: boolean;
    extraClassName?: string;
}) => {
    const {
        fullWidth,
        fullHeight,
        noMaxWidth = false,
        extraClassName,
        ...rest
    } = props;
    return fullWidth ? (
        <div
            className={clsx(
                fullHeight && "h-full flex-grow",
                "pt-2 pb-16 sm:pt-4 lg:pt-8",
                extraClassName
            )}
            {...rest}
        />
    ) : (
        <div
            className={clsx(
                fullHeight && "h-[calc(100vh-3.5rem)]",
                noMaxWidth ? "w-full" : "max-w-6xl ",
                "relative mx-auto md:px-8",
                extraClassName
            )}
        >
            <div
                className={clsx(
                    fullHeight && "flex h-full flex-1 flex-col overflow-auto",
                    "mx-4 pt-2 pb-16 sm:mx-0 sm:pt-4 lg:pt-8",
                    extraClassName
                )}
                {...rest}
            />
        </div>
    );
};
