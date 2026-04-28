import { ChevronDown, X } from "lucide-react";
import { orderStatusLabels } from "../../constants";
import type { Order, OrderStatus } from "../../types";
import { badgeClass } from "../ui";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { getOrderPrintOptions, getOrderQuantity } from "./orderViewUtils";

type AdminOrderDetailModalProps = {
  order: Order;
  exportingOrderId: number | null;
  onClose: () => void;
  onExportOrder: (order: Order) => void;
  onUpdateStatus: (order: Order, status: OrderStatus) => Promise<void>;
};

const orderStatuses: OrderStatus[] = ["pending", "processing", "completed", "canceled"];

export function AdminOrderDetailModal({
  order,
  exportingOrderId,
  onClose,
  onExportOrder,
  onUpdateStatus
}: AdminOrderDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-text-primary/35 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="grid max-h-full w-full max-w-[600px] gap-4 overflow-y-auto rounded-xl border border-border bg-surface p-4 shadow-[0_18px_44px_rgba(31,41,51,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="grid min-w-0 gap-1">
            <h2 className="truncate text-lg font-bold text-text-primary">{order.title}</h2>
            <p className="truncate text-sm text-text-secondary">{order.orderUid ?? `#${order.id}`}</p>
          </div>
          <button
            aria-label="닫기"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition duration-150 hover:border-primary hover:bg-primary-soft hover:text-primary active:scale-[0.99]"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-3">
          <section className="grid gap-2 rounded-xl border border-border bg-surface p-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-text-secondary">상태</span>
              <span className={badgeClass}>{orderStatusLabels[order.status]}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-text-secondary">기간</span>
              <strong className="text-text-primary">{order.startDate} - {order.endDate}</strong>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-text-secondary">마이펫</span>
              <strong className="text-text-primary">#{order.petId}</strong>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-text-secondary">주문일</span>
              <strong className="text-text-primary">{order.createdAt}</strong>
            </div>
          </section>

          <section className="grid gap-2 rounded-xl border border-border bg-surface p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-text-secondary">기록/수량</span>
              <strong className="text-text-primary">기록 {order.recordCount}개 · {getOrderQuantity(order)}권</strong>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-text-secondary">도서</span>
              <strong className="text-text-primary">{order.bookId ? `#${order.bookId}` : "없음"}</strong>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-text-secondary">인쇄 옵션</span>
              <strong className="text-text-primary">{getOrderPrintOptions(order)}</strong>
            </div>
          </section>

          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  상태 변경
                  <ChevronDown aria-hidden="true" size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>주문 상태</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {orderStatuses.map((status) => (
                  <DropdownMenuItem
                    disabled={order.status === status}
                    key={status}
                    onSelect={() => onUpdateStatus(order, status)}
                  >
                    {orderStatusLabels[status]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              disabled={!order.orderUid || exportingOrderId === order.id}
              onClick={() => onExportOrder(order)}
            >
              {exportingOrderId === order.id ? "준비 중" : "JSON 보기"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
