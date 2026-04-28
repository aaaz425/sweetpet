import { ChevronDown, X } from "lucide-react";
import type { ReactNode } from "react";
import { secondaryButtonClass } from "../ui";
import { Button } from "../ui/button";
import { DatePicker } from "../ui/date-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

export type RecordSortOrder = "newest" | "oldest";

type FilterOption = {
  value: string;
  label: string;
};

type RecordFiltersProps = {
  conditionOptions: string[];
  tagOptions: string[];
  startDate: string;
  endDate: string;
  selectedCondition: string;
  selectedTag: string;
  sortOrder: RecordSortOrder;
  hasActiveFilters: boolean;
  summary?: ReactNode;
  onChangeStartDate: (value: string) => void;
  onChangeEndDate: (value: string) => void;
  onChangeCondition: (value: string) => void;
  onChangeTag: (value: string) => void;
  onChangeSortOrder: (value: RecordSortOrder) => void;
  onResetFilters: () => void;
};

function FilterDropdown({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}) {
  const selectedLabel = options.find((option) => option.value === value)?.label ?? "전체";

  return (
    <label className="grid gap-1.5 text-sm font-semibold text-text-secondary">
      {label}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full justify-between px-3" variant="secondary">
            <span className="truncate">{selectedLabel}</span>
            <ChevronDown aria-hidden="true" size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-72 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto">
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {options.map((option) => (
            <DropdownMenuItem disabled={option.value === value} key={option.value} onSelect={() => onChange(option.value)}>
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </label>
  );
}

export function RecordFilters({
  conditionOptions,
  tagOptions,
  startDate,
  endDate,
  selectedCondition,
  selectedTag,
  sortOrder,
  hasActiveFilters,
  summary,
  onChangeStartDate,
  onChangeEndDate,
  onChangeCondition,
  onChangeTag,
  onChangeSortOrder,
  onResetFilters
}: RecordFiltersProps) {
  const conditionFilterOptions = [
    { value: "all", label: "전체" },
    ...conditionOptions.map((condition) => ({ value: condition, label: condition }))
  ];
  const tagFilterOptions = [
    { value: "all", label: "전체" },
    ...tagOptions.map((tag) => ({ value: tag, label: tag }))
  ];
  const sortOptions = [
    { value: "newest", label: "최신순" },
    { value: "oldest", label: "오래된순" }
  ];

  return (
    <div className="grid gap-3 rounded-xl border border-border bg-surface p-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="grid gap-1.5 text-sm font-semibold text-text-secondary">
          시작일
          <DatePicker placeholder="시작일 선택" value={startDate} onChange={onChangeStartDate} />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-text-secondary">
          종료일
          <DatePicker placeholder="종료일 선택" value={endDate} onChange={onChangeEndDate} />
        </label>
        <FilterDropdown label="컨디션" value={selectedCondition} options={conditionFilterOptions} onChange={onChangeCondition} />
        <FilterDropdown label="태그" value={selectedTag} options={tagFilterOptions} onChange={onChangeTag} />
        <FilterDropdown
          label="정렬"
          value={sortOrder}
          options={sortOptions}
          onChange={(value) => onChangeSortOrder(value as RecordSortOrder)}
        />
      </div>
      {hasActiveFilters ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-text-secondary">필터가 적용된 기록을 보고 있습니다.</span>
          <button className={`${secondaryButtonClass} min-h-9 px-3 py-2`} onClick={onResetFilters} type="button">
            <X className="h-4 w-4" aria-hidden="true" />
            필터 초기화
          </button>
        </div>
      ) : null}
      {summary}
    </div>
  );
}
