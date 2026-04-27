import { assetUrl } from "../../api/http";
import type { Pet } from "../../types";
import { SectionTitle } from "../SectionTitle";
import { panelClass } from "../ui";

type PetListProps = {
  pets: Pet[];
  selectedPetId: number | null;
  onSelectPet: (petId: number) => void;
};

export function PetList({ pets, selectedPetId, onSelectPet }: PetListProps) {
  return (
    <div className={panelClass}>
      <SectionTitle title="등록된 반려동물" meta={`${pets.length}마리`} />
      <div className="grid gap-3">
        {pets.map((pet) => (
          <button
            className={`grid w-full gap-1 rounded-xl border p-4 text-left transition duration-150 hover:border-primary hover:bg-background active:scale-[0.99] ${
              pet.id === selectedPetId ? "border-primary bg-primary-soft" : "border-border bg-surface"
            }`}
            key={pet.id}
            onClick={() => onSelectPet(pet.id)}
            type="button"
          >
            {pet.imagePath && (
              <img
                alt={`${pet.name} 대표 사진`}
                className="mb-2 aspect-[4/3] w-full rounded-lg border border-border object-cover"
                src={assetUrl(pet.imagePath)}
              />
            )}
            <strong className="text-base text-text-primary">{pet.name}</strong>
            <span className="text-sm text-text-secondary">{pet.breed || pet.species}</span>
            <p className="mt-1 text-sm leading-6 text-text-secondary">{pet.memo || "등록된 메모가 없습니다."}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
