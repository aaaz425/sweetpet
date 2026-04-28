import type { CreateOrderInput, Order, OrderExport, OrderStatus, UpdateOrderInput } from "../types";
import { request } from "./http";

export async function getOrders() {
  return request<Order[]>("/api/orders");
}

export async function createOrder(payload: CreateOrderInput) {
  return request<Order>("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function updateOrder(orderUid: string, payload: UpdateOrderInput) {
  return request<Order>(`/api/orders/${orderUid}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function updateOrderStatus(orderUid: string, status: OrderStatus) {
  return request<Order>(`/api/orders/${orderUid}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
}

export async function exportOrder(orderUid: string) {
  return request<OrderExport>(`/api/orders/${orderUid}/export`);
}
