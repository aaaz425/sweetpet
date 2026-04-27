import type { Order, OrderFormState, Pet, PetFormState, RecordFormState, RecordItem } from "../types";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, options);
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.errors?.join(", ") || payload.message || `API request failed: ${response.status}`);
  }

  return payload.data;
}

function appendIfPresent(formData: FormData, key: string, value: string | number | File | null | undefined) {
  if (value === null || value === undefined || value === "") return;
  formData.append(key, value instanceof File ? value : String(value));
}

export async function getPets() {
  return request<Pet[]>("/api/pets");
}

export function assetUrl(path: string | null) {
  return path ? `${apiUrl}${path}` : "";
}

export async function createPet(payload: PetFormState) {
  const formData = new FormData();
  appendIfPresent(formData, "name", payload.name);
  appendIfPresent(formData, "species", payload.species);
  appendIfPresent(formData, "breed", payload.breed);
  appendIfPresent(formData, "birthday", payload.birthday);
  appendIfPresent(formData, "memo", payload.memo);
  appendIfPresent(formData, "photo", payload.photo);

  return request<Pet>("/api/pets", {
    method: "POST",
    body: formData
  });
}

export async function getRecords() {
  return request<RecordItem[]>("/api/records");
}

export async function createRecord(petId: number, payload: RecordFormState) {
  const formData = new FormData();
  appendIfPresent(formData, "petId", petId);
  appendIfPresent(formData, "recordDate", payload.recordDate);
  appendIfPresent(formData, "weight", payload.weight);
  appendIfPresent(formData, "condition", payload.condition);
  appendIfPresent(formData, "memo", payload.memo);
  appendIfPresent(formData, "tags", payload.tags);
  appendIfPresent(formData, "photo", payload.photo);

  return request<RecordItem>("/api/records", {
    method: "POST",
    body: formData
  });
}

export async function deleteRecord(id: number) {
  await request<{ id: number }>(`/api/records/${id}`, { method: "DELETE" });
}

export async function getOrders() {
  return request<Order[]>("/api/orders");
}

export async function createOrder(petId: number, payload: OrderFormState) {
  const book = await request<{ bookUid: string }>("/api/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ petId, ...payload })
  });

  await request(`/api/books/${book.bookUid}/contents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ startDate: payload.startDate, endDate: payload.endDate })
  });

  await request(`/api/books/${book.bookUid}/finalization`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });

  return request<Order>("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookUid: book.bookUid })
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
