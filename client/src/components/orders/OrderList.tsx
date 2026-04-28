import { ChevronDown, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { getPrintOptionLabel, orderStatusLabels } from "../../constants";
import type { Order, OrderStatus, Pet } from "../../types";
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
import { DeleteConfirmModal } from "../feedback/DeleteConfirmModal";
import { EmptyState } from "../feedback/EmptyState";
import { badgeClass, cardSurfaceClass, panelClass } from "../ui";

type OrderListProps = {
  orders: Order[];
  title?: string;
  headerAction?: ReactNode;
  filters?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  displayMode?: "full" | "album";
  pets?: Pet[];
  onCancelOrder?: (order: Order) => Promise<void>;
  onEditOrder?: (order: Order) => void;
  onUpdateStatus?: (order: Order, status: OrderStatus) => Promise<void>;
  onExportOrder?: (order: Order) => void;
};

const orderStatuses: OrderStatus[] = ["pending", "processing", "completed", "canceled"];

function getOrderQuantity(order: Order) {
  return typeof order.printOptions.quantity === "number" ? order.printOptions.quantity : 1;
}

function hasPrintOptions(order: Order) {
  return Boolean(order.printOptions.size || order.printOptions.binding || order.printOptions.paper);
}

function OrderDetailModal({ order, petName, onClose }: { order: Order; petName: string; onClose: () => void }) {
  const hasSavedPrintOptions = hasPrintOptions(order);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-text-primary/35 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="grid max-h-full w-full max-w-[520px] gap-5 overflow-y-auto rounded-xl border border-border bg-surface px-6 py-6 shadow-[0_18px_44px_rgba(31,41,51,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="grid min-w-0 gap-1">
            <h2 className="break-words text-lg font-bold text-text-primary">{order.title}</h2>
            <p className="text-sm text-text-secondary">{order.startDate} - {order.endDate}</p>
          </div>
          <button
            aria-label="닫기"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-secondary transition duration-150 hover:bg-primary-soft hover:text-primary active:scale-[0.99]"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="grid gap-3.5">
          <section className="grid gap-2.5 rounded-xl border border-border bg-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-text-secondary">마이펫</span>
              <strong className="text-text-primary">{petName}</strong>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-text-secondary">상태</span>
              <span className={badgeClass}>{orderStatusLabels[order.status]}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-text-secondary">주문 번호</span>
              <span className="font-medium text-text-primary">{order.orderUid ?? `#${order.id}`}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-text-secondary">주문일</span>
              <span className="font-medium text-text-primary">{order.createdAt}</span>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs font-medium text-text-secondary">일상기록</p>
              <strong className="mt-1 block text-base text-text-primary">{order.recordCount}개</strong>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs font-medium text-text-secondary">주문 수량</p>
              <strong className="mt-1 block text-base text-text-primary">{getOrderQuantity(order)}권</strong>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs font-medium text-text-secondary">인쇄 옵션</p>
            {hasSavedPrintOptions ? (
              <p className="mt-1 text-sm font-medium text-text-primary">
                {getPrintOptionLabel("size", order.printOptions.size)} · {getPrintOptionLabel("binding", order.printOptions.binding)} · {getPrintOptionLabel("paper", order.printOptions.paper)}
              </p>
            ) : (
              <p className="mt-1 text-sm text-text-secondary">저장된 인쇄 옵션이 없습니다.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export function OrderList({
  orders,
  title = "주문 목록",
  headerAction,
  filters,
  emptyTitle,
  emptyDescription,
  displayMode = "full",
  pets = [],
  onCancelOrder,
  onEditOrder,
  onUpdateStatus,
  onExportOrder
}: OrderListProps) {
  const [selectedDetailOrder, setSelectedDetailOrder] = useState<Order | null>(null);
  const [cancelTargetOrder, setCancelTargetOrder] = useState<Order | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const isAlbumDisplay = displayMode === "album";

  async function handleConfirmCancelOrder() {
    if (!cancelTargetOrder) return;

    setIsCanceling(true);
    try {
      if (onCancelOrder) {
        await onCancelOrder(cancelTargetOrder);
      } else {
        await onUpdateStatus?.(cancelTargetOrder, "canceled");
      }
      setCancelTargetOrder(null);
    } finally {
      setIsCanceling(false);
    }
  }

  function handleUpdateStatus(order: Order, status: OrderStatus) {
    if (status === "canceled") {
      setCancelTargetOrder(order);
      return;
    }

    void onUpdateStatus?.(order, status);
  }

  return (
    <div className={panelClass}>
      {headerAction ? (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="text-lg font-bold text-text-primary">{title}</h2>
            <span className="text-sm font-medium text-text-secondary">{orders.length}건</span>
          </div>
          {headerAction}
        </div>
      ) : (
        <SectionTitle title={title} meta={`${orders.length}건`} />
      )}
      {filters ? <div className="mb-5">{filters}</div> : null}
      {orders.length === 0 ? (
        <EmptyState
          title={emptyTitle ?? (isAlbumDisplay ? "생성된 앨범북 주문이 없습니다" : "접수된 주문이 없습니다")}
          description={
            emptyDescription ??
            (isAlbumDisplay
              ? "일상기록을 남긴 뒤 기간을 선택해 앨범북 주문을 만들 수 있습니다."
              : "사용자가 앨범북 주문을 만들면 이곳에서 상태 변경과 JSON export를 진행할 수 있습니다.")
          }
        />
      ) : (
        <div className="grid min-w-0 gap-3.5">
          {orders.map((order) =>
            isAlbumDisplay ? (
              <article
                className={`grid min-w-0 gap-3 p-4 transition duration-150 hover:border-border-strong hover:bg-surface-muted/45 md:p-5 ${cardSurfaceClass}`}
                key={order.id}
              >
                <button
                  className="grid min-w-0 gap-2 text-left"
                  onClick={() => setSelectedDetailOrder(order)}
                  type="button"
                >
                  <strong className="break-words text-base text-text-primary">{order.title}</strong>
                  <span className="text-sm text-text-secondary">{order.startDate} - {order.endDate}</span>
                  <span className="flex flex-wrap items-center gap-2">
                    <span className={badgeClass}>{orderStatusLabels[order.status]}</span>
                    <span className="text-sm font-medium text-text-primary">주문 수량 {getOrderQuantity(order)}권</span>
                  </span>
                </button>
                {order.status === "pending" && (onEditOrder || onCancelOrder) ? (
                  <div className="flex flex-wrap gap-2">
                    {onEditOrder ? (
                      <Button onClick={() => onEditOrder(order)} variant="secondary">
                        편집
                      </Button>
                    ) : null}
                    {onCancelOrder ? (
                      <Button onClick={() => setCancelTargetOrder(order)} variant="secondary">
                        취소
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </article>
            ) : (
              <article className={`grid min-w-0 gap-3.5 p-4 transition duration-150 hover:border-border-strong hover:bg-surface-muted/45 md:p-5 ${cardSurfaceClass}`} key={order.id}>
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
                      주문 수량 {getOrderQuantity(order)}권
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
                            onSelect={() => handleUpdateStatus(order, status)}
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
            )
          )}
        </div>
      )}
      {selectedDetailOrder ? (
        <OrderDetailModal
          order={selectedDetailOrder}
          petName={pets.find((pet) => pet.id === selectedDetailOrder.petId)?.name ?? `마이펫 #${selectedDetailOrder.petId}`}
          onClose={() => setSelectedDetailOrder(null)}
        />
      ) : null}
      {cancelTargetOrder ? (
        <DeleteConfirmModal
          title="주문 취소"
          description={`${cancelTargetOrder.title} 주문을 취소하시겠습니까? 취소 후에는 진행 상태가 취소로 변경됩니다.`}
          confirmLabel="주문 취소"
          loadingLabel="취소 중"
          isDeleting={isCanceling}
          onCancel={() => setCancelTargetOrder(null)}
          onConfirm={handleConfirmCancelOrder}
          variant="cancel"
        />
      ) : null}
    </div>
  );
}
