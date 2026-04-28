import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

type AdminOrderPaginationProps = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getVisiblePages(currentPage: number, totalPages: number) {
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  const adjustedStartPage = Math.max(1, endPage - 4);

  return Array.from({ length: endPage - adjustedStartPage + 1 }, (_, index) => adjustedStartPage + index);
}

export function AdminOrderPagination({
  currentPage,
  pageSize,
  totalCount,
  totalPages,
  onPageChange
}: AdminOrderPaginationProps) {
  if (totalCount <= pageSize) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3">
      <span className="text-sm font-medium text-text-secondary">
        {startItem}-{endItem} / {totalCount}건
      </span>
      <div className="flex items-center gap-1">
        <Button
          aria-label="이전 페이지"
          className="h-9 min-h-9 w-9 p-0"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          variant="secondary"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
        {visiblePages.map((page) => (
          <button
            className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-semibold transition duration-150 active:scale-[0.99] ${
              currentPage === page
                ? "border-primary bg-primary text-surface"
                : "border-border bg-surface text-text-secondary hover:border-primary hover:bg-primary-soft hover:text-primary"
            }`}
            key={page}
            onClick={() => onPageChange(page)}
            type="button"
          >
            {page}
          </button>
        ))}
        <Button
          aria-label="다음 페이지"
          className="h-9 min-h-9 w-9 p-0"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          variant="secondary"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
