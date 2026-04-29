import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { orderStatusLabels } from "../../constants";
import type { OrderStatus, Pet } from "../../types";
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
  pets: Pet[];
  selectedPetId: number | null;
  selectedStatus: OrderStatusFilter;
  sortOrder: OrderSortOrder;
  summary?: ReactNode;
  onChangePetId: (value: number | null) => void;
  onChangeStatus: (value: OrderStatusFilter) => void;
  onChangeSortOrder: (value: OrderSortOrder) => void;
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
  pets,
  selectedPetId,
  selectedStatus,
  sortOrder,
  summary,
  onChangePetId,
  onChangeStatus,
  onChangeSortOrder
}: OrderFiltersProps) {
  const statusOptions = userStatusFilters.map((status) => ({ value: status, label: getOrderStatusFilterLabel(status) }));
  const petOptions = [
    { value: "all", label: "전체" },
    ...pets.map((pet) => ({ value: String(pet.id), label: pet.name }))
  ];
  const sortOptions: Array<{ value: OrderSortOrder; label: string }> = [
    { value: "newest", label: "최신순" },
    { value: "oldest", label: "오래된순" }
  ];

  return (
    <div className="grid gap-3 rounded-xl border border-border bg-surface p-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <FilterDropdown
          label="마이펫"
          value={selectedPetId === null ? "all" : String(selectedPetId)}
          options={petOptions}
          onChange={(value) => onChangePetId(value === "all" ? null : Number(value))}
        />
        <FilterDropdown label="주문 상태" value={selectedStatus} options={statusOptions} onChange={onChangeStatus} />
        <FilterDropdown label="정렬" value={sortOrder} options={sortOptions} onChange={onChangeSortOrder} />
      </div>
      {summary}
    </div>
  );
}
