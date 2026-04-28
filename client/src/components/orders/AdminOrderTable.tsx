import { orderStatusLabels } from "../../constants";
import type { Order } from "../../types";
import { EmptyState } from "../feedback/EmptyState";
import { badgeClass } from "../ui";
import { getOrderPrintOptions, getOrderQuantity } from "./orderViewUtils";

type AdminOrderTableProps = {
  orders: Order[];
  emptyDescription: string;
  selectedOrderIds: number[];
  onOpenOrder: (order: Order) => void;
  onToggleOrder: (orderId: number) => void;
  onToggleVisibleOrders: () => void;
};

export function AdminOrderTable({
  orders,
  emptyDescription,
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
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full min-w-[960px] table-fixed border-collapse text-left text-sm">
        <colgroup>
          <col className="w-[48px]" />
          <col className="w-[32%]" />
          <col className="w-[12%]" />
          <col className="w-[18%]" />
          <col className="w-[14%]" />
          <col className="w-[14%]" />
          <col className="w-[10%]" />
        </colgroup>
        <thead className="bg-background text-xs font-semibold text-text-secondary">
          <tr>
            <th className="border-b border-border px-4 py-3">
              <input
                aria-label="현재 목록 주문 전체 선택"
                checked={areAllVisibleOrdersSelected}
                className="h-4 w-4 cursor-pointer accent-primary"
                onChange={onToggleVisibleOrders}
                type="checkbox"
              />
            </th>
            <th className="border-b border-border px-4 py-3">주문 요약</th>
            <th className="border-b border-border px-4 py-3">상태</th>
            <th className="border-b border-border px-4 py-3">기간</th>
            <th className="border-b border-border px-4 py-3">기록/수량</th>
            <th className="border-b border-border px-4 py-3">인쇄 옵션</th>
            <th className="border-b border-border px-4 py-3">주문일</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isSelected = selectedOrderIds.includes(order.id);

            return (
              <tr
                className={`transition duration-150 hover:bg-primary-soft/50 ${isSelected ? "bg-primary-soft/70" : "odd:bg-surface even:bg-background/60"}`}
                key={order.id}
              >
                <td className="border-b border-border px-4 py-4 align-middle">
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
                  className="min-w-0 cursor-pointer border-b border-border px-4 py-4 align-middle"
                  onClick={() => onOpenOrder(order)}
                >
                  <div className="grid min-w-0 gap-1">
                    <strong className="truncate text-sm text-text-primary" title={order.title}>{order.title}</strong>
                    <span className="truncate text-xs text-text-secondary" title={order.orderUid ?? `#${order.id}`}>
                      {order.orderUid ?? `#${order.id}`} · 마이펫 #{order.petId}
                    </span>
                  </div>
                </td>
                <td
                  className="cursor-pointer border-b border-border px-4 py-4 align-middle"
                  onClick={() => onOpenOrder(order)}
                >
                  <span className={badgeClass}>{orderStatusLabels[order.status]}</span>
                </td>
                <td
                  className="min-w-0 cursor-pointer border-b border-border px-4 py-4 align-middle text-text-secondary"
                  onClick={() => onOpenOrder(order)}
                >
                  <span className="block truncate" title={`${order.startDate} - ${order.endDate}`}>
                    {order.startDate} - {order.endDate}
                  </span>
                </td>
                <td
                  className="min-w-0 cursor-pointer border-b border-border px-4 py-4 align-middle text-text-secondary"
                  onClick={() => onOpenOrder(order)}
                >
                  <span className="block truncate">기록 {order.recordCount}개 · {getOrderQuantity(order)}권</span>
                </td>
                <td
                  className="min-w-0 cursor-pointer border-b border-border px-4 py-4 align-middle text-text-secondary"
                  onClick={() => onOpenOrder(order)}
                >
                  <span className="block truncate" title={getOrderPrintOptions(order)}>
                    {getOrderPrintOptions(order)}
                  </span>
                </td>
                <td
                  className="min-w-0 cursor-pointer border-b border-border px-4 py-4 align-middle text-text-secondary"
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
