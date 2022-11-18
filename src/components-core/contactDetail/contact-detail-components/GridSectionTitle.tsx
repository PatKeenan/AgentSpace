import clsx from "clsx";

export const GridSectionTitle = (props: {
    title: string;
    subTitle?: string;
    actions?: React.ReactNode | React.ReactNode[];
    titleIcon?: React.ReactNode | React.ReactNode[];
}) => {
    const { title, subTitle, actions, titleIcon } = props;
    return (
        <div className="mb-4 flex items-center">
            <div
                className={clsx(
                    "flex-shrink-0 space-y-1",
                    !actions && "flex-grow"
                )}
            >
                <div className="inline-flex items-center space-x-2">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                        {title}
                    </h3>
                    {titleIcon ? titleIcon : null}
                </div>

                {subTitle ? (
                    <p className="max-w-2xl text-sm text-gray-500">
                        {subTitle}
                    </p>
                ) : null}
            </div>
            {actions ? (
                <>
                    <div className="flex flex-grow"></div>
                    <div className="flex-shrink-0">{actions}</div>
                </>
            ) : null}
        </div>
    );
};
