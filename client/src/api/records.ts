import type { CreateRecordInput, RecordItem, UpdateRecordInput } from "../types";
import { appendIfPresent, request } from "./http";

export type RecordsPageResponse = {
  items: RecordItem[];
  nextPage: number | null;
};

export async function getRecords(petId?: number) {
  const query = petId ? `?petId=${petId}` : "";
  return request<RecordItem[]>(`/api/records${query}`);
}

export async function getRecordsPage({
  limit,
  page,
  petId
}: {
  limit: number;
  page: number;
  petId?: number | null;
}) {
  const searchParams = new URLSearchParams({
    limit: String(limit),
    page: String(page)
  });

  if (petId) {
    searchParams.set("petId", String(petId));
  }

  return request<RecordsPageResponse>(`/api/records?${searchParams.toString()}`);
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

export async function updateRecord(id: number, payload: UpdateRecordInput) {
  const formData = new FormData();
  appendIfPresent(formData, "recordDate", payload.recordDate);
  appendIfPresent(formData, "condition", payload.condition);
  appendIfPresent(formData, "memo", payload.memo);
  appendIfPresent(formData, "tags", payload.tags?.join(", "));
  appendIfPresent(formData, "photo", payload.photo);

  return request<RecordItem>(`/api/records/${id}`, {
    method: "PUT",
    body: formData
  });
}

export async function deleteRecord(id: number) {
  await request<{ id: number }>(`/api/records/${id}`, { method: "DELETE" });
}
