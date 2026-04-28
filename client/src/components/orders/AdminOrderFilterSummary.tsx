import { X } from "lucide-react";

export type AdminOrderFilterSummaryItem = {
  label: string;
  value: string;
  onRemove?: () => void;
};

type AdminOrderFilterSummaryProps = {
  filters: AdminOrderFilterSummaryItem[];
  resultCount: number;
};

const summaryBadgeClass =
  "box-border inline-flex h-6 appearance-none items-center rounded-full border border-border-strong bg-primary-soft px-2.5 py-0 font-sans !text-xs font-semibold !leading-none text-primary";

export function AdminOrderFilterSummary({ filters, resultCount }: AdminOrderFilterSummaryProps) {
  const sortedFilters = [...filters].sort((firstFilter, secondFilter) => {
    if (Boolean(firstFilter.onRemove) === Boolean(secondFilter.onRemove)) return 0;
    return firstFilter.onRemove ? 1 : -1;
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-1">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-text-primary">현재 적용 조건</span>
        {sortedFilters.map((filter) =>
          filter.onRemove ? (
            <button
              aria-label={`${filter.label} 조건 해제`}
              className={`${summaryBadgeClass} max-w-full gap-1 transition duration-150 hover:border-primary hover:bg-surface`}
              key={`${filter.label}-${filter.value}`}
              onClick={filter.onRemove}
              type="button"
            >
              <span className="truncate font-sans !text-xs font-semibold !leading-none">{filter.label}: {filter.value}</span>
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          ) : (
            <span className={summaryBadgeClass} key={`${filter.label}-${filter.value}`}>
              <span className="truncate font-sans !text-xs font-semibold !leading-none">{filter.label}: {filter.value}</span>
            </span>
          )
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm font-medium text-text-secondary">{resultCount}건</span>
      </div>
    </div>
  );
}
