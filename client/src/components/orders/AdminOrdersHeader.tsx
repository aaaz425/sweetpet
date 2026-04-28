import {
  AdminOrderStatusFilter,
  type OrderStatusFilter
} from "./AdminOrderStatusFilter";

type AdminOrdersHeaderProps = {
  filters: OrderStatusFilter[];
  orderCount: number;
  selectedFilter: OrderStatusFilter;
  getCount: (statusFilter: OrderStatusFilter) => number;
  onSelectFilter: (statusFilter: OrderStatusFilter) => void;
};

export function AdminOrdersHeader({
  filters,
  orderCount,
  selectedFilter,
  getCount,
  onSelectFilter
}: AdminOrdersHeaderProps) {
  return (
    <div className="mb-4 grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="text-lg font-bold text-text-primary">주문 관리</h2>
          <span className="text-sm font-medium text-text-secondary">{orderCount}건</span>
        </div>
      </div>

      <AdminOrderStatusFilter
        filters={filters}
        selectedFilter={selectedFilter}
        getCount={getCount}
        onSelectFilter={onSelectFilter}
      />
    </div>
  );
}
