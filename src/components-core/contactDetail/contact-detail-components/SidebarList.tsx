import { Button } from "components-common/Button";
import { GridCard } from "./GridCard";
import { GridSectionTitle } from "./GridSectionTitle";

type SidebarListProps<T> = {
    title: string;
    data: T[] | undefined;
    onClick: () => void;
    renderItem: (i: T) => React.ReactNode;
    buttonTitle?: string;
    noDataMessage?: string;
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
    } = props;
    return (
        <GridCard>
            <GridSectionTitle title={title} />

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
                <p className="py-2 text-sm">{noDataMessage ?? `No ${title}`}</p>
            )}

            <Button
                variant="outlined"
                className="mt-3 w-full justify-center"
                onClick={onClick}
            >
                {buttonTitle}
            </Button>
        </GridCard>
    );
}
