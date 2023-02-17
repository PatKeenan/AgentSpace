import { PlusIcon } from "@heroicons/react/20/solid";
import { Button } from "./Button";
import clsx from "clsx";

type NoDataBaseProps = {
    buttonText?: never;
    onClick?: never;
};
type NoDataExtendedProps = {
    buttonText: string;
    onClick: () => void;
};

export const NoData = (
    props: {
        title: string;
        message?: string;
        icon?: React.ElementType;
        className?: string;
        height?: string;
    } & (NoDataBaseProps | NoDataExtendedProps)
) => {
    const {
        title,
        message,
        onClick,
        buttonText,
        icon: Icon,
        className,
        height = "h-full",
    } = props;

    return (
        <div
            className={clsx(
                "grid w-full place-items-center p-8 text-center",
                className,
                height
            )}
        >
            <div>
                {Icon ? (
                    <Icon className="mx-auto h-12 w-12 text-gray-400" />
                ) : (
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            vectorEffect="non-scaling-stroke"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                        />
                    </svg>
                )}
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{message}</p>
                {onClick ? (
                    <div className="mt-6">
                        <Button variant="primary" onClick={() => onClick()}>
                            <PlusIcon
                                className="-ml-1 mr-2 h-5 w-5"
                                aria-hidden="true"
                            />
                            {buttonText}
                        </Button>
                    </div>
                ) : null}
            </div>
        </div>
    );
};
