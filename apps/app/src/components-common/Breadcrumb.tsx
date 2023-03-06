import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useWorkspace } from "hooks/useWorkspace";
import Link from "next/link";

export type BreadcrumbItem = {
    href: string;
    title: string;
};
export type BreadcrumbType = {
    items: BreadcrumbItem[];
    isHome?: boolean;
};

export const Breadcrumb = (
    props: BreadcrumbType & React.ComponentProps<"nav">
) => {
    const { items, className, isHome, ...htmlProps } = props;

    const isActiveItem = (item: BreadcrumbItem) => {
        const lastItem = items[items.length - 1];
        if (lastItem) {
            return lastItem.title == item.title;
        }
        return false;
    };

    const { id: workspaceId } = useWorkspace();

    return (
        <nav
            className={clsx(
                "hidden px-4 pt-2 sm:px-6 md:py-4 lg:flex lg:px-8",
                className
            )}
            aria-label="Breadcrumb"
            {...htmlProps}
        >
            <ol role="list" className="flex items-center space-x-4">
                <li>
                    <div>
                        {isHome ? (
                            <div className="text-gray-400">
                                <HomeIcon
                                    className="h-5 w-5 flex-shrink-0"
                                    aria-hidden="true"
                                />
                                <span className="sr-only">Home</span>
                            </div>
                        ) : (
                            <Link
                                href={
                                    workspaceId
                                        ? `/workspace/${workspaceId}`
                                        : "/"
                                }
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <HomeIcon
                                    className="h-5 w-5 flex-shrink-0"
                                    aria-hidden="true"
                                />
                                <span className="sr-only">Home</span>
                            </Link>
                        )}
                    </div>
                </li>
                {items.map((item, index) => (
                    <li key={index}>
                        <div className="flex items-center">
                            <ChevronRightIcon
                                className="h-5 w-5 flex-shrink-0 text-gray-400"
                                aria-hidden="true"
                            />
                            <Link
                                href={item.href}
                                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                                aria-current={
                                    isActiveItem(item) ? "page" : undefined
                                }
                            >
                                {item.title}
                            </Link>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
};
