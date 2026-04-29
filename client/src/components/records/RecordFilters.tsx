import { Check, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
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
  selectedTags: string[];
  sortOrder: RecordSortOrder;
  petSelector?: ReactNode;
  summary?: ReactNode;
  onChangeStartDate: (value: string) => void;
  onChangeEndDate: (value: string) => void;
  onChangeCondition: (value: string) => void;
  onToggleTag: (value: string) => void;
  onClearTags: () => void;
  onChangeSortOrder: (value: RecordSortOrder) => void;
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

function TagFilterDropdown({
  selectedTags,
  tagOptions,
  onToggleTag,
  onClearTags
}: {
  selectedTags: string[];
  tagOptions: string[];
  onToggleTag: (value: string) => void;
  onClearTags: () => void;
}) {
  const selectedLabel =
    selectedTags.length === 0 ? "전체" : selectedTags.length === 1 ? selectedTags[0] : `${selectedTags.length}개 선택`;

  return (
    <label className="grid gap-1.5 text-sm font-semibold text-text-secondary">
      태그
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full justify-between px-3" variant="secondary">
            <span className="truncate">{selectedLabel}</span>
            <ChevronDown aria-hidden="true" size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-72 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto">
          <DropdownMenuLabel>태그</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={selectedTags.length === 0} onSelect={onClearTags}>
            전체
          </DropdownMenuItem>
          {tagOptions.map((tag) => {
            const isSelected = selectedTags.includes(tag);

            return (
              <DropdownMenuItem
                className="justify-between gap-2"
                key={tag}
                onSelect={(event) => {
                  event.preventDefault();
                  onToggleTag(tag);
                }}
              >
                <span className="truncate">{tag}</span>
                {isSelected ? <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" /> : null}
              </DropdownMenuItem>
            );
          })}
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
  selectedTags,
  sortOrder,
  petSelector,
  summary,
  onChangeStartDate,
  onChangeEndDate,
  onChangeCondition,
  onToggleTag,
  onClearTags,
  onChangeSortOrder
}: RecordFiltersProps) {
  const conditionFilterOptions = [
    { value: "all", label: "전체" },
    ...conditionOptions.map((condition) => ({ value: condition, label: condition }))
  ];
  const sortOptions = [
    { value: "newest", label: "최신순" },
    { value: "oldest", label: "오래된순" }
  ];

  return (
    <div className="grid gap-3 rounded-xl border border-border bg-surface p-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {petSelector}
        <label className="grid gap-1.5 text-sm font-semibold text-text-secondary">
          시작일
          <DatePicker placeholder="시작일 선택" value={startDate} onChange={onChangeStartDate} />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-text-secondary">
          종료일
          <DatePicker placeholder="종료일 선택" value={endDate} onChange={onChangeEndDate} />
        </label>
        <FilterDropdown label="컨디션" value={selectedCondition} options={conditionFilterOptions} onChange={onChangeCondition} />
        <TagFilterDropdown
          selectedTags={selectedTags}
          tagOptions={tagOptions}
          onToggleTag={onToggleTag}
          onClearTags={onClearTags}
        />
        <FilterDropdown
          label="정렬"
          value={sortOrder}
          options={sortOptions}
          onChange={(value) => onChangeSortOrder(value as RecordSortOrder)}
        />
      </div>
      {summary}
    </div>
  );
}
