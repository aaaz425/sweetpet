import type { CreateRecordInput, RecordItem } from "../types";
import { appendIfPresent, request } from "./http";

export async function getRecords(petId?: number) {
  const query = petId ? `?petId=${petId}` : "";
  return request<RecordItem[]>(`/api/records${query}`);
}

export async function createRecord(petId: number, payload: CreateRecordInput) {
  const formData = new FormData();
  appendIfPresent(formData, "petId", petId);
  appendIfPresent(formData, "recordDate", payload.recordDate);
  appendIfPresent(formData, "condition", payload.condition);
  appendIfPresent(formData, "memo", payload.memo);
  appendIfPresent(formData, "tags", payload.tags?.join(", "));
  appendIfPresent(formData, "photo", payload.photo);

  return request<RecordItem>("/api/records", {
    method: "POST",
    body: formData
  });
}

export async function deleteRecord(id: number) {
  await request<{ id: number }>(`/api/records/${id}`, { method: "DELETE" });
}
