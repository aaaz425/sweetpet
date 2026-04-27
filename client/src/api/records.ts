import type { RecordFormState, RecordItem } from "../types";
import { appendIfPresent, request } from "./http";

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

