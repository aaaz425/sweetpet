import { assetUrl } from "../api/http";
import type { Pet, RecordItem } from "../types";

export const speciesOptions = ["강아지", "고양이", "토끼", "햄스터", "앵무새", "거북이", "물고기", "달팽이"];

const representativeImages = {
  dog: "/mock-images/maltese-dog.jpg",
  cat: "/mock-images/domestic-cat.jpg",
  rabbit: "/mock-images/rabbit.jpg",
  hamster: "/mock-images/hamster.jpg",
  bird: "/mock-images/budgerigar.jpg",
  turtle: "/mock-images/turtle.jpg",
  fish: "/mock-images/aquarium-fish.jpg",
  snail: "/mock-images/snail.jpg"
};

function representativeImageUrl(speciesValue: string) {
  const species = speciesValue.toLowerCase();
  if (species.includes("cat") || speciesValue.includes("고양이")) return representativeImages.cat;
  if (species.includes("rabbit") || speciesValue.includes("토끼")) return representativeImages.rabbit;
  if (species.includes("hamster") || speciesValue.includes("햄스터")) return representativeImages.hamster;
  if (
    species.includes("bird") ||
    species.includes("parrot") ||
    species.includes("budgerigar") ||
    speciesValue.includes("앵무새")
  ) return representativeImages.bird;
  if (species.includes("turtle") || species.includes("tortoise") || speciesValue.includes("거북이")) {
    return representativeImages.turtle;
  }
  if (species.includes("fish") || speciesValue.includes("물고기")) return representativeImages.fish;
  if (species.includes("snail") || speciesValue.includes("달팽이")) return representativeImages.snail;

  return representativeImages.dog;
}

export function petImageUrl(pet: Pet) {
  return pet.imagePath ? assetUrl(pet.imagePath) : representativeImageUrl(pet.species);
}

export function recordImageUrl(record: RecordItem, pet?: Pet | null) {
  if (record.imagePath) return assetUrl(record.imagePath);
  return pet ? petImageUrl(pet) : representativeImages.dog;
}
