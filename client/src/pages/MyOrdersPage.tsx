import { OrderList } from "../components/orders/OrderList";
import type { Order } from "../types";

type MyOrdersPageProps = {
  orders: Order[];
};

export function MyOrdersPage({ orders }: MyOrdersPageProps) {
  return <OrderList orders={orders} />;
}
