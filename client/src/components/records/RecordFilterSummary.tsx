import { badgeClass } from "../ui";

export type RecordFilterSummaryItem = {
  label: string;
  value: string;
};

type RecordFilterSummaryProps = {
  filters: RecordFilterSummaryItem[];
  resultCount: number;
};

export function RecordFilterSummary({ filters, resultCount }: RecordFilterSummaryProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-1">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-text-primary">현재 적용 조건</span>
        {filters.map((filter) => (
          <span className={badgeClass} key={`${filter.label}-${filter.value}`}>
            {filter.label}: {filter.value}
          </span>
        ))}
      </div>
      <span className="text-sm font-medium text-text-secondary">{resultCount}개</span>
    </div>
  );
}
