import { Button } from "components-common/Button";
import { NextLink } from "components-common/NextLink";
import { GridCard } from "./GridCard";
import { GridSectionTitle } from "./GridSectionTitle";

type SidebarListProps<T> = {
    title: string;
    data: T[] | undefined;
    onClick?: () => void;
    renderItem: (i: T) => React.ReactNode;
    buttonTitle?: string;
    noDataMessage?: string;
    href?: string;
    action?: React.ReactNode;
    titleIcon?: React.ReactNode;
};

export function SidebarList<T extends { id: string }>(
    props: SidebarListProps<T>
) {
    const {
        title,
        buttonTitle = "View All",
        onClick,
        data,
        renderItem,
        noDataMessage,
        href,
        action,
        titleIcon,
    } = props;

    return (
        <GridCard>
            <GridSectionTitle
                title={title}
                actions={action}
                titleIcon={titleIcon}
            />

            {data && data.length > 0 ? (
                <ul
                    role="list"
                    className="-mt-3 flow-root divide-y divide-gray-200"
                >
                    {data.map((i) => (
                        <li key={i.id} className="py-5">
                            {renderItem(i)}
                        </li>
                    ))}
                </ul>
            ) : noDataMessage ? (
                noDataMessage
            ) : (
                <p className="py-2 text-sm  text-gray-500">
                    {noDataMessage ?? `No ${title}`}
                </p>
            )}

            {href ? (
                <NextLink
                    href={href}
                    className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                    {buttonTitle}
                </NextLink>
            ) : (
                <Button
                    variant="outlined"
                    className="mt-3 w-full justify-center"
                    onClick={onClick}
                >
                    {buttonTitle}
                </Button>
            )}
        </GridCard>
    );
}
