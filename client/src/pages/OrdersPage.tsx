import { useState } from "react";
import { OrderForm } from "../components/orders/OrderForm";
import { PetSelectField } from "../components/pets/PetSelectField";
import type { OrderFormState, Pet } from "../types";

type OrdersPageProps = {
  pets: Pet[];
  onCreateOrder: (petId: number, form: OrderFormState) => Promise<void>;
};

export function OrdersPage({ pets, onCreateOrder }: OrdersPageProps) {
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  async function handleCreateOrder(form: OrderFormState) {
    if (selectedPetId === null) return;
    await onCreateOrder(selectedPetId, form);
  }

  return (
    <section className="grid min-w-0 max-w-[480px] gap-4">
      <PetSelectField
        pets={pets}
        selectedPetId={selectedPetId}
        onSelectPet={setSelectedPetId}
        helperText="주문 대상"
      />
      <OrderForm selectedPetId={selectedPetId} onSubmit={handleCreateOrder} />
    </section>
  );
}
