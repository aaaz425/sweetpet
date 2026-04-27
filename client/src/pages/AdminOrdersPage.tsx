import { OrderList } from "../components/orders/OrderList";
import type { Order, OrderStatus } from "../types";

type AdminOrdersPageProps = {
  orders: Order[];
  onUpdateOrderStatus: (order: Order, status: OrderStatus) => void;
  onExportOrder: (order: Order) => void;
};

export function AdminOrdersPage({ orders, onUpdateOrderStatus, onExportOrder }: AdminOrdersPageProps) {
  return <OrderList orders={orders} onUpdateStatus={onUpdateOrderStatus} onExportOrder={onExportOrder} />;
}
