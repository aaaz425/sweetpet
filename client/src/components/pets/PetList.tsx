import { petImageUrl } from "../../lib/mockImages";
import type { Pet } from "../../types";
import { SectionTitle } from "../SectionTitle";
import { panelClass } from "../ui";

type PetListProps = {
  pets: Pet[];
};

export function PetList({ pets }: PetListProps) {
  return (
    <div className={panelClass}>
      <SectionTitle title="등록된 마이펫" meta={`${pets.length}마리`} />
      <div className="grid min-w-0 gap-3">
        {pets.map((pet) => (
          <article
            className="grid w-full min-w-0 gap-1 rounded-xl border border-border bg-surface p-4 text-left transition duration-150 hover:border-primary"
            key={pet.id}
          >
            <img
              alt={`${pet.name} 대표 사진`}
              className="mb-2 aspect-[4/3] w-full rounded-lg border border-border object-cover"
              src={petImageUrl(pet)}
            />
            <strong className="text-base text-text-primary">{pet.name}</strong>
            <span className="text-sm text-text-secondary">{pet.breed || pet.species}</span>
            <p className="mt-1 text-sm leading-6 text-text-secondary">{pet.memo || "등록된 메모가 없습니다."}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
