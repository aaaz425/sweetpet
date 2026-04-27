import type { Dispatch, FormEvent, SetStateAction } from "react";
import { OrderForm } from "../components/orders/OrderForm";
import type { OrderFormState } from "../types";

type OrdersPageProps = {
  orderForm: OrderFormState;
  selectedPetId: number | null;
  setOrderForm: Dispatch<SetStateAction<OrderFormState>>;
  onCreateOrder: (event: FormEvent) => void;
};

export function OrdersPage({ orderForm, selectedPetId, setOrderForm, onCreateOrder }: OrdersPageProps) {
  return (
    <section className="max-w-[480px]">
      <OrderForm form={orderForm} selectedPetId={selectedPetId} setForm={setOrderForm} onSubmit={onCreateOrder} />
    </section>
  );
}
