import React from 'react';
import ReactPaginate from 'react-paginate';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Handle potential ESM/CJS interop issue where ReactPaginate might be on .default
const ReactPaginateComponent = (ReactPaginate as any).default || ReactPaginate;

interface DataPaginationProps {
    totalItems: number;
    pageSize: number;
    currentPage: number; // 1-based
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    pageSizeOptions?: number[];
}

export const DataPagination: React.FC<DataPaginationProps> = ({
    totalItems,
    pageSize,
    currentPage,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 50, 100],
}) => {
    const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
    const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const to = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Info text */}
                <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{from}</span> to{' '}
                    <span className="font-medium">{to}</span> of{' '}
                    <span className="font-medium">{totalItems}</span> results
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    {/* Page size selector */}
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm cursor-pointer"
                    >
                        {pageSizeOptions.map((s) => (
                            <option key={s} value={s}>
                                Show {s}
                            </option>
                        ))}
                    </select>

                    {/* react-paginate */}
                    <ReactPaginateComponent
                        pageCount={pageCount}
                        forcePage={currentPage - 1}
                        onPageChange={({ selected }: { selected: number }) => onPageChange(selected + 1)}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={3}
                        previousLabel={<ChevronLeft size={16} />}
                        nextLabel={<ChevronRight size={16} />}
                        breakLabel="..."
                        containerClassName="flex items-center gap-1"
                        pageClassName=""
                        pageLinkClassName="relative inline-flex items-center justify-center w-9 h-9 border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer select-none"
                        activeClassName=""
                        activeLinkClassName="!bg-blue-600 !text-white !border-blue-600 hover:!bg-blue-700"
                        previousClassName=""
                        previousLinkClassName="relative inline-flex items-center justify-center w-9 h-9 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        nextClassName=""
                        nextLinkClassName="relative inline-flex items-center justify-center w-9 h-9 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        breakClassName=""
                        breakLinkClassName="relative inline-flex items-center justify-center w-9 h-9 border border-gray-300 bg-white text-sm font-medium text-gray-400 rounded-lg select-none"
                        disabledClassName="opacity-40 cursor-not-allowed pointer-events-none"
                    />
                </div>
            </div>
        </div>
    );
};
