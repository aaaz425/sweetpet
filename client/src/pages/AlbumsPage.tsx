import { X } from "lucide-react";
import { useState } from "react";
import { DataLoadErrorState } from "../components/feedback/PageState";
import { OrderForm } from "../components/orders/OrderForm";
import { OrderList } from "../components/orders/OrderList";
import { PetSelectField } from "../components/pets/PetSelectField";
import type { Order, OrderFormState, Pet, RecordItem } from "../types";
import { primaryButtonClass, secondaryButtonClass } from "../components/ui";

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
          orders={orders}
          pets={pets}
          title="주문 내역"
          onCancelOrder={(order) => onUpdateOrderStatus(order, "canceled")}
          onEditOrder={openEditOrderModal}
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
            className="grid max-h-full w-full max-w-[520px] gap-4 overflow-y-auto rounded-xl border border-border bg-background p-4 shadow-lg"
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
