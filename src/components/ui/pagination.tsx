import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/utils/cn';
import { SearchableSelect } from './SearchableSelect';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  totalCount?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  totalCount,
  className
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <nav className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t border-gray-50 bg-gray-50/30", className)}>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Show</span>
            <div className="w-24">
              <SearchableSelect
                value={pageSize}
                onChange={(val) => {
                  if (onPageSizeChange) {
                    onPageSizeChange(Number(val));
                    onPageChange(1);
                  }
                }}
                options={[
                  { value: 10, label: '10' },
                  { value: 25, label: '25' },
                  { value: 50, label: '50' },
                  { value: 100, label: '100' }
                ]}
                isSearchable={false}
                className="react-select-small"
              />
            </div>
          </div>
        )}
        <div className="text-[11px] text-gray-400 font-medium">
          Showing <span className="text-gray-900 font-bold">{Math.min(totalCount || 0, (currentPage - 1) * pageSize + 1)}</span> to{' '}
          <span className="text-gray-900 font-bold">{Math.min(totalCount || 0, currentPage * pageSize)}</span> of{' '}
          <span className="text-gray-900 font-bold">{totalCount || totalPages * pageSize}</span> entries
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg border-gray-100 hover:bg-gray-50 flex items-center justify-center text-gray-400 disabled:opacity-30"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={14} />
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum, idx) => (
            <React.Fragment key={idx}>
              {pageNum === '...' ? (
                <span className="px-2 text-gray-300">
                  <MoreHorizontal size={12} />
                </span>
              ) : (
                <Button
                  variant={currentPage === pageNum ? 'primary' : 'outline'}
                  className={cn(
                    "h-8 min-w-[32px] rounded-lg text-xs font-bold transition-all p-0",
                    currentPage === pageNum 
                      ? "shadow-blue-500/20 shadow-md scale-105" 
                      : "border-transparent text-gray-500 hover:bg-gray-100"
                  )}
                  onClick={() => onPageChange(pageNum as number)}
                >
                  {pageNum}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg border-gray-100 hover:bg-gray-50 flex items-center justify-center text-gray-400 disabled:opacity-30"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <ChevronRight size={14} />
        </Button>
      </div>
    </nav>
  );
};
