/* eslint-disable react/display-name */
import clsx from "clsx";
import type { ChildrenPropsObj } from "types/index";

export const SectionHeading = (props: ChildrenPropsObj) => (
    <div className="mb-4 flex items-center justify-between" {...props} />
);
SectionHeading.TitleContainer = (props: ChildrenPropsObj) => (
    <div className="min-w-0 flex-1 items-center" {...props} />
);
SectionHeading.Title = (
    props: ChildrenPropsObj & { icon?: React.ReactNode }
) => {
    const { icon, ...rest } = props;
    return (
        <div className="flex items-center">
            <h2
                className={clsx(
                    icon && "mr-2",
                    "text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
                )}
                {...rest}
            />
            {icon ? <>{icon}</> : null}
        </div>
    );
};
SectionHeading.Subtitle = (props: ChildrenPropsObj) => (
    <div
        className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap"
        {...props}
    />
);
SectionHeading.Actions = (props: ChildrenPropsObj) => (
    <div className="sm:mt-0 sm:ml-4" {...props} />
);
