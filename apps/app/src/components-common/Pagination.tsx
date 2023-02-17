import { Button } from "./Button";

type PaginationProps = {
    currentPage: number;
    currentResultsLength: number;
    onPaginate: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
};
export const Pagination = ({
    currentPage,
    onPaginate,
    currentResultsLength,
    totalItems,
    itemsPerPage,
}: PaginationProps) => {
    const isLastPage = Math.ceil(totalItems / itemsPerPage) == currentPage;
    const showingFrom = currentPage * itemsPerPage - itemsPerPage + 1;
    const showingTo = isLastPage
        ? currentPage * itemsPerPage - itemsPerPage + currentResultsLength
        : currentPage * itemsPerPage;
    return (
        <nav
            className="flex items-center justify-between border-t border-gray-200 bg-white py-3 "
            aria-label="Pagination"
        >
            <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{showingFrom}</span> -{" "}
                    <span className="font-medium">{showingTo}</span> of{" "}
                    <span className="font-medium">{totalItems}</span>
                </p>
            </div>
            <div className="flex flex-1 justify-between space-x-2 sm:justify-end">
                <Button
                    variant="outlined"
                    disabled={currentPage == 1}
                    onClick={() => onPaginate(currentPage - 1)}
                >
                    Previous
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => onPaginate(currentPage + 1)}
                    disabled={isLastPage}
                >
                    Next
                </Button>
            </div>
        </nav>
    );
};
