import type { CreatePetInput, Pet, UpdatePetInput } from "../types";
import { appendIfPresent, request } from "./http";

export async function getPets() {
  return request<Pet[]>("/api/pets");
}

export async function createPet(payload: CreatePetInput) {
  return request<Pet>("/api/pets", {
    method: "POST",
    body: createPetFormData(payload)
  });
}

export async function updatePet(id: number, payload: UpdatePetInput) {
  return request<Pet>(`/api/pets/${id}`, {
    method: "PUT",
    body: createPetFormData(payload)
  });
}

function createPetFormData(payload: CreatePetInput | UpdatePetInput) {
  const formData = new FormData();
  appendIfPresent(formData, "name", payload.name);
  appendIfPresent(formData, "species", payload.species);
  appendIfPresent(formData, "breed", payload.breed);
  appendIfPresent(formData, "birthday", payload.birthday);
  appendIfPresent(formData, "memo", payload.memo);
  appendIfPresent(formData, "photo", payload.photo);

  return formData;
}

export async function deletePet(id: number) {
  await request<{ id: number }>(`/api/pets/${id}`, { method: "DELETE" });
}
