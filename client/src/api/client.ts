import type { Order, OrderFormState, Pet, PetFormState, RecordFormState, RecordItem } from "../types";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, options);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getPets() {
  return request<Pet[]>("/api/pets");
}

export async function createPet(payload: PetFormState) {
  return request<Pet>("/api/pets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function getRecords() {
  return request<RecordItem[]>("/api/records");
}

export async function createRecord(petId: number, payload: RecordFormState) {
  return request<RecordItem>("/api/records", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      petId,
      recordDate: payload.recordDate,
      weight: payload.weight ? Number(payload.weight) : null,
      condition: payload.condition,
      memo: payload.memo,
      tags: payload.tags
    })
  });
}

export async function deleteRecord(id: number) {
  const response = await fetch(`${apiUrl}/api/records/${id}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
}

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

export async function updateOrderStatus(id: number, status: Order["status"]) {
  return request<Order>(`/api/orders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
}

export async function exportOrder(id: number) {
  return request<unknown>(`/api/orders/${id}/export`);
}
