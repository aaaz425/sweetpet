import { X } from "lucide-react";
import { useState } from "react";
import { PetForm } from "../components/pets/PetForm";
import { PetList } from "../components/pets/PetList";
import { primaryButtonClass } from "../components/ui";
import type { Pet, PetFormState } from "../types";

type PetsPageProps = {
  pets: Pet[];
  onCreatePet: (form: PetFormState) => Promise<void>;
  onDeletePet: (id: number) => Promise<void>;
};

export function PetsPage({ pets, onCreatePet, onDeletePet }: PetsPageProps) {
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);

  async function handleCreatePet(form: PetFormState) {
    await onCreatePet(form);
    setIsPetModalOpen(false);
  }

  return (
    <section className="grid min-w-0 gap-4">
      <PetList
        pets={pets}
        onDeletePet={onDeletePet}
        headerAction={
          <button className={primaryButtonClass} onClick={() => setIsPetModalOpen(true)} type="button">
            마이펫 등록
          </button>
        }
      />

      {isPetModalOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-text-primary/35 px-4 py-6"
          onClick={() => setIsPetModalOpen(false)}
        >
          <div
            className="grid max-h-full w-full max-w-[520px] gap-4 overflow-y-auto rounded-xl border border-border bg-background p-4 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-text-primary">마이펫 등록</h2>
              <button
                aria-label="닫기"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-secondary transition duration-150 hover:bg-primary-soft hover:text-primary active:scale-[0.99]"
                onClick={() => setIsPetModalOpen(false)}
                type="button"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <PetForm onSubmit={handleCreatePet} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
