import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataLoadErrorState } from "../components/feedback/PageState";
import { PetForm } from "../components/pets/PetForm";
import { PetList } from "../components/pets/PetList";
import { primaryButtonClass } from "../components/ui";
import type { Pet, PetFormState } from "../types";

type PetsPageProps = {
  pets: Pet[];
  isPetsError: boolean;
  onCreatePet: (form: PetFormState) => Promise<void>;
  onDeletePet: (id: number) => Promise<void>;
  onUpdatePet: (id: number, form: PetFormState) => Promise<void>;
};

function getPetFormState(pet: Pet): PetFormState {
  return {
    name: pet.name,
    species: pet.species,
    breed: pet.breed ?? "",
    birthday: pet.birthday ?? "",
    memo: pet.memo ?? "",
    photo: null
  };
}

function hasPetFormChanges(pet: Pet, form: PetFormState) {
  return (
    form.name.trim() !== pet.name ||
    form.species.trim() !== pet.species ||
    form.breed.trim() !== (pet.breed ?? "") ||
    form.birthday !== (pet.birthday ?? "") ||
    form.memo.trim() !== (pet.memo ?? "") ||
    form.photo !== null
  );
}

export function PetsPage({ pets, isPetsError, onCreatePet, onDeletePet, onUpdatePet }: PetsPageProps) {
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  async function handleCreatePet(form: PetFormState) {
    await onCreatePet(form);
    setIsPetModalOpen(false);
  }

  async function handleUpdatePet(form: PetFormState) {
    if (!editingPet) return;

    if (!hasPetFormChanges(editingPet, form)) {
      toast.info("변경된 내용이 없습니다.");
      return;
    }

    await onUpdatePet(editingPet.id, form);
    setEditingPet(null);
  }

  return (
    <section className="grid min-w-0 gap-4">
      {isPetsError ? (
        <DataLoadErrorState title="마이펫 정보를 불러오지 못했습니다" />
      ) : (
        <PetList
          pets={pets}
          onEditPet={setEditingPet}
          onDeletePet={onDeletePet}
          headerAction={
            <button className={primaryButtonClass} onClick={() => setIsPetModalOpen(true)} type="button">
              마이펫 등록
            </button>
          }
        />
      )}

      {!isPetsError && isPetModalOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-text-primary/35 px-4 py-6"
          onClick={() => setIsPetModalOpen(false)}
        >
          <div
            className="grid max-h-full w-full max-w-[640px] gap-4 overflow-y-auto rounded-xl border border-border bg-background px-6 py-6 shadow-lg sm:px-8 sm:py-7"
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

      {!isPetsError && editingPet ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-text-primary/35 px-4 py-6"
          onClick={() => setEditingPet(null)}
        >
          <div
            className="grid max-h-full w-full max-w-[640px] gap-4 overflow-y-auto rounded-xl border border-border bg-background px-6 py-6 shadow-lg sm:px-8 sm:py-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-text-primary">마이펫 편집</h2>
              <button
                aria-label="닫기"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-secondary transition duration-150 hover:bg-primary-soft hover:text-primary active:scale-[0.99]"
                onClick={() => setEditingPet(null)}
                type="button"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <PetForm initialValues={getPetFormState(editingPet)} submitLabel="저장" onSubmit={handleUpdatePet} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
