import { OrderList } from "../components/orders/OrderList";
import type { Order } from "../types";

type MyOrdersPageProps = {
  orders: Order[];
  onExportOrder: (orderUid: string) => void;
};

export function MyOrdersPage({ orders, onExportOrder }: MyOrdersPageProps) {
  return <OrderList orders={orders} onExportOrder={onExportOrder} />;
}
