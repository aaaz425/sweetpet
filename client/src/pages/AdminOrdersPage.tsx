import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminOrderBulkActions } from "../components/orders/AdminOrderBulkActions";
import { AdminOrderDetailModal } from "../components/orders/AdminOrderDetailModal";
import { AdminOrderExportModal } from "../components/orders/AdminOrderExportModal";
import { AdminOrderPagination } from "../components/orders/AdminOrderPagination";
import { getStatusFilterLabel, type OrderStatusFilter } from "../components/orders/AdminOrderStatusFilter";
import { AdminOrderTable } from "../components/orders/AdminOrderTable";
import { AdminOrdersHeader } from "../components/orders/AdminOrdersHeader";
import { DeleteConfirmModal } from "../components/feedback/DeleteConfirmModal";
import { DataLoadErrorState } from "../components/feedback/PageState";
import { panelClass } from "../components/ui";
import type { Order, OrderStatus } from "../types";

type AdminOrdersPageProps = {
  orders: Order[];
  isOrdersError: boolean;
  onUpdateOrderStatus: (order: Order, status: OrderStatus) => Promise<void>;
  onUpdateOrdersStatus: (orders: Order[], status: OrderStatus) => Promise<void>;
  onExportOrder: (order: Order) => Promise<string | null>;
  onExportOrders: (orders: Order[]) => Promise<string | null>;
};

const orderStatusFilters: OrderStatusFilter[] = ["all", "pending", "processing", "completed", "canceled"];
const orderPageSize = 10;

export function AdminOrdersPage({
  orders,
  isOrdersError,
  onUpdateOrderStatus,
  onUpdateOrdersStatus,
  onExportOrder,
  onExportOrders
}: AdminOrdersPageProps) {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<OrderStatusFilter>("all");
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [exportModalJson, setExportModalJson] = useState("");
  const [exportModalTitle, setExportModalTitle] = useState("");
  const [exportModalMeta, setExportModalMeta] = useState("");
  const [exportingOrderId, setExportingOrderId] = useState<number | null>(null);
  const [isBatchExporting, setIsBatchExporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cancelTargetOrder, setCancelTargetOrder] = useState<Order | null>(null);
  const [cancelTargetOrders, setCancelTargetOrders] = useState<Order[]>([]);
  const [isCanceling, setIsCanceling] = useState(false);

  const filteredOrders = useMemo(
    () => orders.filter((order) => selectedStatusFilter === "all" || order.status === selectedStatusFilter),
    [orders, selectedStatusFilter]
  );
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / orderPageSize));
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * orderPageSize;

    return filteredOrders.slice(startIndex, startIndex + orderPageSize);
  }, [currentPage, filteredOrders]);
  const selectedOrders = useMemo(
    () => orders.filter((order) => selectedOrderIds.includes(order.id)),
    [orders, selectedOrderIds]
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function getStatusFilterCount(statusFilter: OrderStatusFilter) {
    if (statusFilter === "all") return orders.length;

    return orders.filter((order) => order.status === statusFilter).length;
  }

  const emptyDescription =
    selectedStatusFilter === "all"
      ? "사용자가 앨범북 주문을 만들면 이곳에서 상태 변경과 JSON export를 진행할 수 있습니다."
      : `${getStatusFilterLabel(selectedStatusFilter)} 상태의 주문이 없습니다.`;

  async function handleExportOrder(order: Order) {
    setExportingOrderId(order.id);
    const nextExportJson = await onExportOrder(order);
    setExportingOrderId(null);

    if (!nextExportJson) return;

    setExportModalTitle(order.title);
    setExportModalMeta(order.orderUid ?? `#${order.id}`);
    setExportModalJson(nextExportJson);
    setIsCopied(false);
  }

  async function handleBatchExportOrders() {
    if (selectedOrders.length === 0) return;

    setIsBatchExporting(true);
    const nextExportJson = await onExportOrders(selectedOrders);
    setIsBatchExporting(false);

    if (!nextExportJson) return;

    setExportModalTitle("선택 주문 JSON");
    setExportModalMeta(`${selectedOrders.length}건`);
    setExportModalJson(nextExportJson);
    setIsCopied(false);
  }

  async function handleBatchUpdateStatus(status: OrderStatus) {
    if (selectedOrders.length === 0) return;

    if (status === "canceled") {
      setCancelTargetOrders(selectedOrders);
      return;
    }

    await onUpdateOrdersStatus(selectedOrders, status);
    setSelectedOrderIds([]);
  }

  async function handleDetailUpdateStatus(order: Order, status: OrderStatus) {
    if (status === "canceled") {
      setCancelTargetOrder(order);
      return;
    }

    await onUpdateOrderStatus(order, status);
    setDetailOrder((currentOrder) => (currentOrder?.id === order.id ? { ...currentOrder, status } : currentOrder));
  }

  async function handleConfirmCancelOrder() {
    if (!cancelTargetOrder) return;

    setIsCanceling(true);
    try {
      await onUpdateOrderStatus(cancelTargetOrder, "canceled");
      setDetailOrder((currentOrder) =>
        currentOrder?.id === cancelTargetOrder.id ? { ...currentOrder, status: "canceled" } : currentOrder
      );
      setCancelTargetOrder(null);
    } finally {
      setIsCanceling(false);
    }
  }

  async function handleConfirmCancelOrders() {
    if (cancelTargetOrders.length === 0) return;

    setIsCanceling(true);
    try {
      await onUpdateOrdersStatus(cancelTargetOrders, "canceled");
      setSelectedOrderIds([]);
      setCancelTargetOrders([]);
    } finally {
      setIsCanceling(false);
    }
  }

  function handleSelectStatusFilter(statusFilter: OrderStatusFilter) {
    setSelectedStatusFilter(statusFilter);
    setCurrentPage(1);
  }

  function handleToggleOrder(orderId: number) {
    setSelectedOrderIds((currentIds) =>
      currentIds.includes(orderId) ? currentIds.filter((selectedId) => selectedId !== orderId) : [...currentIds, orderId]
    );
  }

  function handleToggleVisibleOrders() {
    const visibleOrderIds = paginatedOrders.map((order) => order.id);
    const areAllVisibleOrdersSelected = visibleOrderIds.every((orderId) => selectedOrderIds.includes(orderId));

    if (areAllVisibleOrdersSelected) {
      setSelectedOrderIds((currentIds) => currentIds.filter((orderId) => !visibleOrderIds.includes(orderId)));
      return;
    }

    setSelectedOrderIds((currentIds) => Array.from(new Set([...currentIds, ...visibleOrderIds])));
  }

  function handlePageChange(page: number) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  }

  function handleCloseExportModal() {
    setExportModalJson("");
    setExportModalTitle("");
    setExportModalMeta("");
    setIsCopied(false);
  }

  async function handleCopyExportJson() {
    try {
      await navigator.clipboard.writeText(exportModalJson);
      setIsCopied(true);
      toast.success("JSON을 복사했습니다.");
    } catch {
      toast.error("JSON 복사 중 문제가 발생했습니다.");
    }
  }

  if (isOrdersError) {
    return <DataLoadErrorState title="관리자 주문 목록을 불러오지 못했습니다" />;
  }

  return (
    <section className={panelClass}>
      <AdminOrdersHeader
        filters={orderStatusFilters}
        orderCount={filteredOrders.length}
        selectedFilter={selectedStatusFilter}
        getCount={getStatusFilterCount}
        onSelectFilter={handleSelectStatusFilter}
      />

      <AdminOrderTable
        emptyDescription={emptyDescription}
        orders={paginatedOrders}
        selectedOrderIds={selectedOrderIds}
        onOpenOrder={setDetailOrder}
        onToggleOrder={handleToggleOrder}
        onToggleVisibleOrders={handleToggleVisibleOrders}
      />

      <AdminOrderPagination
        currentPage={currentPage}
        pageSize={orderPageSize}
        totalCount={filteredOrders.length}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <AdminOrderBulkActions
        isExporting={isBatchExporting}
        selectedCount={selectedOrders.length}
        onExportOrders={handleBatchExportOrders}
        onUpdateStatus={handleBatchUpdateStatus}
      />

      {detailOrder ? (
        <AdminOrderDetailModal
          exportingOrderId={exportingOrderId}
          order={detailOrder}
          onClose={() => setDetailOrder(null)}
          onExportOrder={handleExportOrder}
          onUpdateStatus={handleDetailUpdateStatus}
        />
      ) : null}

      {exportModalJson ? (
        <AdminOrderExportModal
          exportJson={exportModalJson}
          isCopied={isCopied}
          meta={exportModalMeta}
          title={exportModalTitle}
          onClose={handleCloseExportModal}
          onCopy={handleCopyExportJson}
        />
      ) : null}

      {cancelTargetOrder ? (
        <DeleteConfirmModal
          title="주문 취소"
          description={`${cancelTargetOrder.title} 주문을 취소 상태로 변경하시겠습니까?`}
          confirmLabel="주문 취소"
          loadingLabel="취소 중"
          isDeleting={isCanceling}
          onCancel={() => setCancelTargetOrder(null)}
          onConfirm={handleConfirmCancelOrder}
          variant="cancel"
        />
      ) : null}

      {cancelTargetOrders.length > 0 ? (
        <DeleteConfirmModal
          title="주문 일괄 취소"
          description={`선택한 ${cancelTargetOrders.length}건의 주문을 취소 상태로 변경하시겠습니까?`}
          confirmLabel="일괄 취소"
          loadingLabel="취소 중"
          isDeleting={isCanceling}
          onCancel={() => setCancelTargetOrders([])}
          onConfirm={handleConfirmCancelOrders}
          variant="cancel"
        />
      ) : null}
    </section>
  );
}
