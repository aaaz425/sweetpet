import { orderStatusLabels } from "../../constants";
import { cn } from "../../lib/utils";
import type { Order } from "../../types";
import { EmptyState } from "../feedback/EmptyState";
import { badgeClass, cardSurfaceClass } from "../ui";
import { getOrderPrintOptions, getOrderQuantity } from "./orderViewUtils";

const headerCellClass =
  "sticky top-0 z-20 border-b border-border bg-white/75 px-4 py-3.5 text-xs font-bold text-text-secondary shadow-[0_1px_0_rgba(25,23,20,0.04)] backdrop-blur-xl";

type AdminOrderTableProps = {
  orders: Order[];
  emptyDescription: string;
  isFramed?: boolean;
  selectedOrderIds: number[];
  onOpenOrder: (order: Order) => void;
  onToggleOrder: (orderId: number) => void;
  onToggleVisibleOrders: () => void;
};

export function AdminOrderTable({
  orders,
  emptyDescription,
  isFramed = true,
  selectedOrderIds,
  onOpenOrder,
  onToggleOrder,
  onToggleVisibleOrders
}: AdminOrderTableProps) {
  const visibleOrderIds = orders.map((order) => order.id);
  const selectedVisibleCount = visibleOrderIds.filter((orderId) => selectedOrderIds.includes(orderId)).length;
  const areAllVisibleOrdersSelected = orders.length > 0 && selectedVisibleCount === orders.length;

  if (orders.length === 0) {
    return (
      <EmptyState
        title="조건에 맞는 주문이 없습니다"
        description={emptyDescription}
      />
    );
  }

  return (
    <div className={cn("overflow-visible", isFramed && cardSurfaceClass)}>
      <table className="w-full min-w-[928px] table-fixed border-collapse text-left text-sm">
        <colgroup>
          <col className="w-[48px]" />
          <col className="w-[34%]" />
          <col className="w-[12%]" />
          <col className="w-[11%]" />
          <col className="w-[11%]" />
          <col className="w-[22%]" />
          <col className="w-[10%]" />
        </colgroup>
        <thead>
          <tr>
            <th className={cn(headerCellClass, "rounded-tl-xl")}>
              <input
                aria-label="현재 목록 주문 전체 선택"
                checked={areAllVisibleOrdersSelected}
                className="h-4 w-4 cursor-pointer accent-primary"
                onChange={onToggleVisibleOrders}
                type="checkbox"
              />
            </th>
            <th className={headerCellClass}>주문 요약</th>
            <th className={headerCellClass}>상태</th>
            <th className={headerCellClass}>기록</th>
            <th className={headerCellClass}>수량</th>
            <th className={headerCellClass}>인쇄 옵션</th>
            <th className={cn(headerCellClass, "rounded-tr-xl")}>주문일</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isSelected = selectedOrderIds.includes(order.id);

            return (
              <tr
                className={`group relative transition duration-150 hover:bg-primary-soft/35 hover:shadow-[inset_3px_0_0_#2F2923] ${isSelected ? "bg-primary-soft/55 shadow-[inset_3px_0_0_#2F2923]" : "odd:bg-surface/30 even:bg-surface/15"}`}
                key={order.id}
              >
                <td className="border-b border-border px-4 py-3.5 align-middle">
                  <input
                    aria-label={`${order.title} 선택`}
                    checked={isSelected}
                    className="h-4 w-4 cursor-pointer accent-primary"
                    onChange={() => onToggleOrder(order.id)}
                    onClick={(event) => event.stopPropagation()}
                    type="checkbox"
                  />
                </td>
                <td
                  className="min-w-0 cursor-pointer border-b border-border px-4 py-3.5 align-middle"
                  onClick={() => onOpenOrder(order)}
                >
                  <div className="grid min-w-0 gap-1">
                    <strong className="truncate text-sm font-bold text-text-primary" title={order.title}>{order.title}</strong>
                    <span className="truncate text-xs text-text-secondary" title={order.orderUid ?? `#${order.id}`}>
                      {order.orderUid ?? `#${order.id}`} · 마이펫 #{order.petId}
                    </span>
                  </div>
                </td>
                <td
                  className="cursor-pointer border-b border-border px-4 py-3.5 align-middle"
                  onClick={() => onOpenOrder(order)}
                >
                  <span className={badgeClass}>{orderStatusLabels[order.status]}</span>
                </td>
                <td
                  className="min-w-0 cursor-pointer border-b border-border px-4 py-3.5 align-middle text-text-secondary"
                  onClick={() => onOpenOrder(order)}
                >
                  <span className="block truncate">기록 {order.recordCount}개</span>
                </td>
                <td
                  className="min-w-0 cursor-pointer border-b border-border px-4 py-3.5 align-middle text-text-secondary"
                  onClick={() => onOpenOrder(order)}
                >
                  <span className="block truncate">{getOrderQuantity(order)}권</span>
                </td>
                <td
                  className="min-w-0 cursor-pointer border-b border-border px-4 py-3.5 align-middle text-text-secondary"
                  onClick={() => onOpenOrder(order)}
                >
                  <span className="block truncate" title={getOrderPrintOptions(order)}>
                    {getOrderPrintOptions(order)}
                  </span>
                </td>
                <td
                  className="min-w-0 cursor-pointer border-b border-border px-4 py-3.5 align-middle text-text-secondary"
                  onClick={() => onOpenOrder(order)}
                >
                  <span className="block truncate" title={order.createdAt}>{order.createdAt}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
