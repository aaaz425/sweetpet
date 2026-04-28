import type { CreatePetInput, Pet } from "../types";
import { appendIfPresent, request } from "./http";

export async function getPets() {
  return request<Pet[]>("/api/pets");
}

export async function createPet(payload: CreatePetInput) {
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

export async function deletePet(id: number) {
  await request<{ id: number }>(`/api/pets/${id}`, { method: "DELETE" });
}
