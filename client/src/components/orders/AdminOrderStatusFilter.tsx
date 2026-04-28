import { orderStatusLabels } from "../../constants";
import type { OrderStatus } from "../../types";

export type OrderStatusFilter = "all" | OrderStatus;

type AdminOrderStatusFilterProps = {
  filters: OrderStatusFilter[];
  selectedFilter: OrderStatusFilter;
  getCount: (statusFilter: OrderStatusFilter) => number;
  onSelectFilter: (statusFilter: OrderStatusFilter) => void;
};

export function getStatusFilterLabel(statusFilter: OrderStatusFilter) {
  return statusFilter === "all" ? "전체" : orderStatusLabels[statusFilter];
}

export function AdminOrderStatusFilter({
  filters,
  selectedFilter,
  getCount,
  onSelectFilter
}: AdminOrderStatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="주문 상태 필터">
      {filters.map((statusFilter) => {
        const isSelected = selectedFilter === statusFilter;

        return (
          <button
            className={`rounded-full border px-3 py-2 text-sm font-semibold leading-5 transition duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft ${
              isSelected
                ? "border-primary bg-primary text-surface"
                : "border-border bg-surface text-text-secondary hover:border-border-strong hover:bg-surface-muted hover:text-primary"
            }`}
            key={statusFilter}
            onClick={() => onSelectFilter(statusFilter)}
            type="button"
          >
            {getStatusFilterLabel(statusFilter)} {getCount(statusFilter)}
          </button>
        );
      })}
    </div>
  );
}
