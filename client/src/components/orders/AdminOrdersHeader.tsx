import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import {
  AdminOrderStatusFilter,
  type OrderStatusFilter
} from "./AdminOrderStatusFilter";
import type { OrderSortOrder } from "./OrderFilters";

type AdminOrdersHeaderProps = {
  filters: OrderStatusFilter[];
  selectedFilter: OrderStatusFilter;
  searchKeyword: string;
  sortOrder: OrderSortOrder;
  summary?: ReactNode;
  getCount: (statusFilter: OrderStatusFilter) => number;
  onSelectFilter: (statusFilter: OrderStatusFilter) => void;
  onChangeSearchKeyword: (value: string) => void;
  onChangeSortOrder: (value: OrderSortOrder) => void;
};

export function AdminOrdersHeader({
  filters,
  selectedFilter,
  searchKeyword,
  sortOrder,
  summary,
  getCount,
  onSelectFilter,
  onChangeSearchKeyword,
  onChangeSortOrder
}: AdminOrdersHeaderProps) {
  const sortLabel = sortOrder === "newest" ? "최신순" : "오래된순";

  return (
    <div className="grid gap-3.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="text-lg font-bold text-text-primary">주문 관리</h2>
        </div>
      </div>

      <AdminOrderStatusFilter
        filters={filters}
        selectedFilter={selectedFilter}
        getCount={getCount}
        onSelectFilter={onSelectFilter}
      />

      <div className="grid gap-3 rounded-xl border border-border bg-surface p-3">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
          <label className="grid gap-1.5 text-sm font-semibold text-text-secondary">
            주문명 검색
            <input
              className="min-h-10 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold leading-5 text-text-primary shadow-[0_1px_2px_rgba(25,23,20,0.04)] outline-none transition duration-150 placeholder:font-medium placeholder:text-text-secondary hover:border-border-strong hover:bg-surface-muted focus:border-primary focus:ring-2 focus:ring-primary-soft"
              placeholder="주문 제목을 입력하세요"
              value={searchKeyword}
              onChange={(event) => onChangeSearchKeyword(event.target.value)}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-text-secondary">
            정렬
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full justify-between px-3" variant="secondary">
                  {sortLabel}
                  <ChevronDown aria-hidden="true" size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
                <DropdownMenuLabel>정렬</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled={sortOrder === "newest"} onSelect={() => onChangeSortOrder("newest")}>
                  최신순
                </DropdownMenuItem>
                <DropdownMenuItem disabled={sortOrder === "oldest"} onSelect={() => onChangeSortOrder("oldest")}>
                  오래된순
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </label>
        </div>
        {summary}
      </div>
    </div>
  );
}
