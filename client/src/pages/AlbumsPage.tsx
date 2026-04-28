import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { DataLoadErrorState } from "../components/feedback/PageState";
import { OrderFilters, type OrderSortOrder, type OrderStatusFilter } from "../components/orders/OrderFilters";
import { OrderForm } from "../components/orders/OrderForm";
import { OrderList } from "../components/orders/OrderList";
import { PetSelectField } from "../components/pets/PetSelectField";
import { primaryButtonClass, secondaryButtonClass } from "../components/ui";
import type { Order, OrderFormState, Pet, RecordItem } from "../types";

type AlbumsPageProps = {
  pets: Pet[];
  records: RecordItem[];
  orders: Order[];
  isOrdersError: boolean;
  onCreateOrder: (petId: number, form: OrderFormState) => Promise<void>;
  onUpdateOrder: (order: Order, form: OrderFormState) => Promise<void>;
  onUpdateOrderStatus: (order: Order, status: Order["status"]) => Promise<void>;
};

function firstRegisteredPetId(pets: Pet[]) {
  return pets.reduce<number | null>((currentId, pet) => {
    if (currentId === null) return pet.id;
    return pet.id < currentId ? pet.id : currentId;
  }, null);
}

function orderToFormState(order: Order): OrderFormState {
  return {
    title: order.title,
    startDate: order.startDate,
    endDate: order.endDate,
    printOptions: {
      size: order.printOptions.size === "b5" ? "b5" : "a5",
      binding: order.printOptions.binding === "hardcover" ? "hardcover" : "softcover",
      paper: order.printOptions.paper === "glossy" ? "glossy" : "matte",
      quantity: typeof order.printOptions.quantity === "number" ? order.printOptions.quantity : 1
    }
  };
}

function filterOrders(orders: Order[], selectedStatus: OrderStatusFilter, selectedFilterPetId: number | null) {
  return orders.filter((order) => {
    if (selectedFilterPetId !== null && order.petId !== selectedFilterPetId) return false;
    if (selectedStatus !== "all" && order.status !== selectedStatus) return false;

    return true;
  });
}

function sortOrders(orders: Order[], sortOrder: OrderSortOrder) {
  return [...orders].sort((firstOrder, secondOrder) => {
    const dateComparison = firstOrder.createdAt.localeCompare(secondOrder.createdAt);
    const idComparison = firstOrder.id - secondOrder.id;
    const comparison = dateComparison || idComparison;

    return sortOrder === "newest" ? -comparison : comparison;
  });
}

export function AlbumsPage({
  pets,
  records,
  orders,
  isOrdersError,
  onCreateOrder,
  onUpdateOrder,
  onUpdateOrderStatus
}: AlbumsPageProps) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [selectedFilterPetId, setSelectedFilterPetId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatusFilter>("all");
  const [sortOrder, setSortOrder] = useState<OrderSortOrder>("newest");
  const filteredOrders = useMemo(
    () => filterOrders(orders, selectedStatus, selectedFilterPetId),
    [orders, selectedFilterPetId, selectedStatus]
  );
  const sortedOrders = useMemo(() => sortOrders(filteredOrders, sortOrder), [filteredOrders, sortOrder]);
  const emptyOrderTitle = orders.length === 0 ? "생성된 앨범북 주문이 없습니다" : "조건에 맞는 주문이 없습니다";
  const emptyOrderDescription =
    orders.length === 0
      ? "일상기록을 남긴 뒤 기간을 선택해 앨범북 주문을 만들 수 있습니다."
      : "선택한 마이펫 또는 주문 상태 조건에 맞는 주문이 없습니다.";

  function openCreateOrderModal() {
    setEditingOrder(null);
    setSelectedPetId(firstRegisteredPetId(pets));
    setIsOrderModalOpen(true);
  }

  function openEditOrderModal(order: Order) {
    setEditingOrder(order);
    setSelectedPetId(order.petId);
    setIsOrderModalOpen(true);
  }

  function closeOrderModal() {
    setIsOrderModalOpen(false);
    setEditingOrder(null);
  }

  async function handleCreateOrder(form: OrderFormState) {
    if (selectedPetId === null) return;

    if (editingOrder) {
      await onUpdateOrder(editingOrder, form);
    } else {
      await onCreateOrder(selectedPetId, form);
    }
    closeOrderModal();
  }

  return (
    <section className="grid min-w-0 gap-4">
      {isOrdersError ? (
        <DataLoadErrorState title="주문 내역을 불러오지 못했습니다" />
      ) : (
        <OrderList
          displayMode="album"
          orders={sortedOrders}
          pets={pets}
          title="주문 내역"
          emptyTitle={emptyOrderTitle}
          emptyDescription={emptyOrderDescription}
          onCancelOrder={(order) => onUpdateOrderStatus(order, "canceled")}
          onEditOrder={openEditOrderModal}
          filters={(
            <OrderFilters
              pets={pets}
              selectedPetId={selectedFilterPetId}
              selectedStatus={selectedStatus}
              sortOrder={sortOrder}
              onChangePetId={setSelectedFilterPetId}
              onChangeStatus={setSelectedStatus}
              onChangeSortOrder={setSortOrder}
            />
          )}
          headerAction={
            <button
              className={primaryButtonClass}
              disabled={pets.length === 0}
              onClick={openCreateOrderModal}
              type="button"
            >
              주문하기
            </button>
          }
        />
      )}

      {!isOrdersError && isOrderModalOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-text-primary/35 px-4 py-6"
          onClick={closeOrderModal}
        >
          <div
            className="grid max-h-full w-full max-w-[520px] gap-4 overflow-y-auto rounded-xl border border-border bg-surface p-4 shadow-[0_18px_44px_rgba(31,41,51,0.16)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-text-primary">{editingOrder ? "앨범북 주문 수정" : "앨범북 주문"}</h2>
              <button
                className={`${secondaryButtonClass} inline-flex h-9 w-9 items-center justify-center rounded-full p-0 border-none bg-transparent`}
                aria-label="닫기"
                onClick={closeOrderModal}
                type="button"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <PetSelectField
              pets={pets}
              selectedPetId={selectedPetId}
              onSelectPet={setSelectedPetId}
              helperText="주문 대상"
            />
            <OrderForm
              initialValues={editingOrder ? orderToFormState(editingOrder) : undefined}
              records={records}
              selectedPetId={selectedPetId}
              submitLabel={editingOrder ? "주문 수정" : "주문하기"}
              onSubmit={handleCreateOrder}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
