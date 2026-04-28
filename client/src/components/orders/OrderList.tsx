import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { getPrintOptionLabel, orderStatusLabels } from "../../constants";
import type { Order, OrderStatus } from "../../types";
import { SectionTitle } from "../SectionTitle";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { badgeClass, panelClass } from "../ui";

type OrderListProps = {
  orders: Order[];
  title?: string;
  headerAction?: ReactNode;
  onUpdateStatus?: (order: Order, status: OrderStatus) => void;
  onExportOrder?: (order: Order) => void;
};

const orderStatuses: OrderStatus[] = ["pending", "processing", "completed"];

export function OrderList({ orders, title = "주문 목록", headerAction, onUpdateStatus, onExportOrder }: OrderListProps) {
  return (
    <div className={panelClass}>
      {headerAction ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="text-lg font-bold text-text-primary">{title}</h2>
            <span className="text-sm font-medium text-text-secondary">{orders.length}건</span>
          </div>
          {headerAction}
        </div>
      ) : (
        <SectionTitle title={title} meta={`${orders.length}건`} />
      )}
      <div className="grid min-w-0 gap-3">
        {orders.map((order) => (
          <article className="grid min-w-0 gap-3 rounded-xl border border-border bg-surface p-4 transition duration-150 hover:border-primary" key={order.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="grid min-w-0 gap-1 break-words">
                <strong className="text-base text-text-primary">{order.title}</strong>
                <span className="text-sm text-text-secondary">{order.startDate} - {order.endDate}</span>
                <span className="text-xs text-text-secondary">
                  주문 {order.orderUid ?? `#${order.id}`} · 마이펫 #{order.petId}
                </span>
                <span className="text-xs text-text-secondary">
                  일상기록 {order.recordCount}개 · 도서 {order.bookId ? `#${order.bookId}` : "없음"}
                </span>
                <span className="text-xs text-text-secondary">
                  {getPrintOptionLabel("size", order.printOptions.size)} · {getPrintOptionLabel("binding", order.printOptions.binding)} · {getPrintOptionLabel("paper", order.printOptions.paper)}
                </span>
                <span className="text-xs text-text-secondary">
                  주문 수량 {typeof order.printOptions.quantity === "number" ? order.printOptions.quantity : 1}권
                </span>
              </div>
              <span className={badgeClass}>{orderStatusLabels[order.status]}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {onUpdateStatus && (
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
              )}
              {onExportOrder && (
                <Button disabled={!order.orderUid} onClick={() => onExportOrder(order)}>
                  JSON 보기
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
