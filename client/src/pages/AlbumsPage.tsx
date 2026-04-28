import { X } from "lucide-react";
import { useState } from "react";
import { OrderForm } from "../components/orders/OrderForm";
import { OrderList } from "../components/orders/OrderList";
import { PetSelectField } from "../components/pets/PetSelectField";
import type { Order, OrderFormState, Pet } from "../types";
import { primaryButtonClass, secondaryButtonClass } from "../components/ui";

type AlbumsPageProps = {
  pets: Pet[];
  orders: Order[];
  onCreateOrder: (petId: number, form: OrderFormState) => Promise<void>;
};

export function AlbumsPage({ pets, orders, onCreateOrder }: AlbumsPageProps) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  async function handleCreateOrder(form: OrderFormState) {
    if (selectedPetId === null) return;

    await onCreateOrder(selectedPetId, form);
    setIsOrderModalOpen(false);
  }

  return (
    <section className="grid min-w-0 gap-4">
      <OrderList
        orders={orders}
        title="주문 내역"
        headerAction={
          <button
            className={primaryButtonClass}
            disabled={pets.length === 0}
            onClick={() => setIsOrderModalOpen(true)}
            type="button"
          >
            주문하기
          </button>
        }
      />

      {isOrderModalOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-text-primary/35 px-4 py-6"
          onClick={() => setIsOrderModalOpen(false)}
        >
          <div
            className="grid max-h-full w-full max-w-[520px] gap-4 overflow-y-auto rounded-xl border border-border bg-background p-4 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-text-primary">앨범북 주문</h2>
              <button
                className={`${secondaryButtonClass} inline-flex h-9 w-9 items-center justify-center rounded-full p-0 border-none bg-transparent`}
                aria-label="닫기"
                onClick={() => setIsOrderModalOpen(false)}
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
            <OrderForm selectedPetId={selectedPetId} onSubmit={handleCreateOrder} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
