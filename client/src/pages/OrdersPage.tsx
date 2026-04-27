import { OrderForm } from "../components/orders/OrderForm";
import type { OrderFormState } from "../types";

type OrdersPageProps = {
  selectedPetId: number | null;
  onCreateOrder: (form: OrderFormState) => Promise<void>;
};

export function OrdersPage({ selectedPetId, onCreateOrder }: OrdersPageProps) {
  return (
    <section className="min-w-0 max-w-[480px]">
      <OrderForm selectedPetId={selectedPetId} onSubmit={onCreateOrder} />
    </section>
  );
}
