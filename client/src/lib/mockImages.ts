import { assetUrl } from "../api/http";
import type { Pet, RecordItem } from "../types";

const mockImages = {
  dog: "/mock-images/maltese-dog.jpg",
  cat: "/mock-images/domestic-cat.jpg",
  record: "/mock-images/dog-walking.jpg"
};

export function petImageUrl(pet: Pet) {
  if (pet.imagePath) return assetUrl(pet.imagePath);

  const species = pet.species.toLowerCase();
  if (species.includes("cat") || pet.species.includes("고양이")) return mockImages.cat;

  return mockImages.dog;
}

export function recordImageUrl(record: RecordItem) {
  return record.imagePath ? assetUrl(record.imagePath) : mockImages.record;
}
