export type TableProps = {
    children: React.ReactNode;
};

export type ColumnHeader = {
    value: string;
    className?: string;
};

export type TableHeaderProps = {
    columnHeaders: ColumnHeader[];
};

export type TableDataProps = {
    children: React.ReactNode;
    fontColor?: string;
    className?: string;
    padding?: string;
};

export type TableBodyProps = {
    children: React.ReactNode;
    isLoading?: boolean;
};
