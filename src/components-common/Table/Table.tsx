import clsx from "clsx";
import { TableDataProps, TableHeaderProps, TableProps } from "./types";

export const Table = (props: TableProps) => {
    const { children } = props;
    return (
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    {children}
                </table>
            </div>
        </div>
    );
};

const TableHeader = (props: TableHeaderProps) => {
    const { columnHeaders } = props;
    return (
        <thead className="bg-gray-50">
            <tr>
                {columnHeaders.map((header, headerIdx) => (
                    <th
                        key={header.value}
                        className={clsx(
                            headerIdx === 0
                                ? "py-3.5 pl-4 pr-3 sm:pl-6"
                                : "px-3 py-3.5",
                            "text-left text-sm font-semibold text-gray-900"
                        )}
                    >
                        <span className={header.className}>{header.value}</span>
                    </th>
                ))}
            </tr>
        </thead>
    );
};

const TableBody = (props: { children: React.ReactNode }) => {
    return (
        <tbody className="divide-y divide-gray-300 bg-white">
            {props.children}
        </tbody>
    );
};

const TableRow = (props: { children: React.ReactNode }) => {
    return <tr>{props.children}</tr>;
};

const TableData = (props: TableDataProps) => {
    const { className, fontColor = "text-gray-500", ...htmlProps } = props;
    return (
        <td
            className={clsx(
                "px-3 py-4 text-sm font-medium",
                fontColor,
                className
            )}
            {...htmlProps}
        />
    );
};

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Data = TableData;
