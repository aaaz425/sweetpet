import { OrderList } from "../components/orders/OrderList";
import type { Order } from "../types";

type AdminOrdersPageProps = {
  orders: Order[];
  onUpdateOrderStatus: (order: Order, status: Order["status"]) => void;
  onExportOrder: (orderUid: string) => void;
};

export function AdminOrdersPage({ orders, onUpdateOrderStatus, onExportOrder }: AdminOrdersPageProps) {
  return <OrderList orders={orders} onUpdateStatus={onUpdateOrderStatus} onExportOrder={onExportOrder} />;
}
