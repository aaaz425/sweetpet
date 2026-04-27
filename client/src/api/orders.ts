import type { Order, OrderExport, OrderFormState } from "../types";
import { request } from "./http";

export async function getOrders() {
  return request<Order[]>("/api/orders");
}

export async function createOrder(petId: number, payload: OrderFormState) {
  return request<Order>("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ petId, ...payload })
  });
}

export async function updateOrderStatus(orderId: string | number, status: Order["status"]) {
  return request<Order>(`/api/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
}

export async function exportOrder(orderId: string | number) {
  return request<OrderExport>(`/api/orders/${orderId}/export`);
}
