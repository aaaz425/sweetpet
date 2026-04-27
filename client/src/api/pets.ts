import type { Pet, PetFormState } from "../types";
import { appendIfPresent, request } from "./http";

export async function getPets() {
  return request<Pet[]>("/api/pets");
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

