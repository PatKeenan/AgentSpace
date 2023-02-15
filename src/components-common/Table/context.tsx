type TableProps = {
    children: React.ReactNode;
};

export const Table = ({ children }: TableProps) => {
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
