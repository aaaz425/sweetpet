import type { Dispatch, FormEvent, SetStateAction } from "react";
import { OrderForm } from "../components/orders/OrderForm";
import { OrderList } from "../components/orders/OrderList";
import type { Order, OrderFormState } from "../types";

type OrdersPageProps = {
  orders: Order[];
  orderForm: OrderFormState;
  selectedPetId: number | null;
  setOrderForm: Dispatch<SetStateAction<OrderFormState>>;
  onCreateOrder: (event: FormEvent) => void;
  onUpdateOrderStatus: (order: Order, status: Order["status"]) => void;
  onExportOrder: (orderUid: string) => void;
};

export function OrdersPage({
  orders,
  orderForm,
  selectedPetId,
  setOrderForm,
  onCreateOrder,
  onUpdateOrderStatus,
  onExportOrder
}: OrdersPageProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
      <OrderForm form={orderForm} selectedPetId={selectedPetId} setForm={setOrderForm} onSubmit={onCreateOrder} />
      <OrderList orders={orders} onUpdateStatus={onUpdateOrderStatus} onExportOrder={onExportOrder} />
    </section>
  );
}
