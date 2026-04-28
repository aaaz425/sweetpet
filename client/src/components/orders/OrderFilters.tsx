import { ChevronDown, X } from "lucide-react";
import { orderStatusLabels } from "../../constants";
import type { OrderStatus } from "../../types";
import { secondaryButtonClass } from "../ui";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

export type OrderStatusFilter = "all" | OrderStatus;
export type OrderSortOrder = "newest" | "oldest";

type OrderFiltersProps = {
  selectedStatus: OrderStatusFilter;
  sortOrder: OrderSortOrder;
  hasActiveFilters: boolean;
  onChangeStatus: (value: OrderStatusFilter) => void;
  onChangeSortOrder: (value: OrderSortOrder) => void;
  onResetFilters: () => void;
};

const userStatusFilters: OrderStatusFilter[] = ["all", "pending", "processing", "completed"];

function getOrderStatusFilterLabel(status: OrderStatusFilter) {
  return status === "all" ? "전체" : orderStatusLabels[status];
}

function FilterDropdown<Value extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: Value;
  options: Array<{ value: Value; label: string }>;
  onChange: (value: Value) => void;
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
        <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
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

export function OrderFilters({
  selectedStatus,
  sortOrder,
  hasActiveFilters,
  onChangeStatus,
  onChangeSortOrder,
  onResetFilters
}: OrderFiltersProps) {
  const statusOptions = userStatusFilters.map((status) => ({ value: status, label: getOrderStatusFilterLabel(status) }));
  const sortOptions: Array<{ value: OrderSortOrder; label: string }> = [
    { value: "newest", label: "최신순" },
    { value: "oldest", label: "오래된순" }
  ];

  return (
    <div className="grid gap-3 rounded-xl border border-border bg-surface p-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <FilterDropdown label="주문 상태" value={selectedStatus} options={statusOptions} onChange={onChangeStatus} />
        <FilterDropdown label="정렬" value={sortOrder} options={sortOptions} onChange={onChangeSortOrder} />
      </div>
      {hasActiveFilters ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-text-secondary">필터가 적용된 주문을 보고 있습니다.</span>
          <button className={`${secondaryButtonClass} min-h-9 px-3 py-2`} onClick={onResetFilters} type="button">
            <X className="h-4 w-4" aria-hidden="true" />
            필터 초기화
          </button>
        </div>
      ) : null}
    </div>
  );
}
