import type { Order, OrderFormState } from "../types";
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

export async function updateOrderStatus(orderUid: string, status: Order["status"]) {
  return request<Order>(`/api/orders/${orderUid}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
}

export async function exportOrder(orderUid: string) {
  return request<unknown>(`/api/orders/${orderUid}/export`);
}

