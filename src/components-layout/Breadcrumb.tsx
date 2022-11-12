import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import { useGlobalStore } from "global-store/useGlobalStore";
import Link from "next/link";

export type BreadcrumbItem = {
    href: string;
    title: string;
};
export type BreadcrumbType = {
    items: BreadcrumbItem[];
};

export const Breadcrumb = (props: BreadcrumbType) => {
    const { items } = props;

    const isActiveItem = (item: BreadcrumbItem) => {
        const lastItem = items[items.length - 1];
        if (lastItem) {
            return lastItem.title == item.title;
        }
        return false;
    };

    return (
        <nav
            className="flex px-4 pt-2 sm:px-6 md:py-4 lg:px-8"
            aria-label="Breadcrumb"
        >
            <ol role="list" className="flex items-center space-x-4">
                <li>
                    <div>
                        <Link href={`/`}>
                            <a className="text-gray-400 hover:text-gray-500">
                                <HomeIcon
                                    className="h-5 w-5 flex-shrink-0"
                                    aria-hidden="true"
                                />
                                <span className="sr-only">Home</span>
                            </a>
                        </Link>
                    </div>
                </li>
                {items.map((item, index) => (
                    <li key={index}>
                        <div className="flex items-center">
                            <ChevronRightIcon
                                className="h-5 w-5 flex-shrink-0 text-gray-400"
                                aria-hidden="true"
                            />
                            <Link href={item.href}>
                                <a
                                    className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                                    aria-current={
                                        isActiveItem(item) ? "page" : undefined
                                    }
                                >
                                    {item.title}
                                </a>
                            </Link>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
};
