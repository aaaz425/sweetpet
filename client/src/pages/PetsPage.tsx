import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DataLoadErrorState } from "../components/feedback/PageState";
import { PetFilterSummary } from "../components/pets/PetFilterSummary";
import { PetFilters } from "../components/pets/PetFilters";
import { PetForm } from "../components/pets/PetForm";
import { PetList } from "../components/pets/PetList";
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
  const [selectedSpecies, setSelectedSpecies] = useState("all");
  const speciesOptions = useMemo(
    () => Array.from(new Set(pets.map((pet) => pet.species))).sort((first, second) => first.localeCompare(second)),
    [pets]
  );
  const filteredPets = useMemo(
    () => pets.filter((pet) => selectedSpecies === "all" || pet.species === selectedSpecies),
    [pets, selectedSpecies]
  );
  const hasActiveFilters = selectedSpecies !== "all";
  const emptyTitle = pets.length === 0 ? "등록된 마이펫이 없습니다" : "조건에 맞는 마이펫이 없습니다";
  const emptyDescription =
    pets.length === 0
      ? "먼저 반려동물을 등록하면 일상기록과 앨범북 주문을 이어서 만들 수 있습니다."
      : "선택한 종류 조건에 맞는 마이펫이 없습니다.";

  useEffect(() => {
    if (selectedSpecies !== "all" && !speciesOptions.includes(selectedSpecies)) {
      setSelectedSpecies("all");
    }
  }, [selectedSpecies, speciesOptions]);

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
          pets={filteredPets}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
          onCreatePet={() => setIsPetModalOpen(true)}
          onEditPet={setEditingPet}
          onDeletePet={onDeletePet}
          filters={
            <PetFilters
              speciesOptions={speciesOptions}
              selectedSpecies={selectedSpecies}
              summary={
                <PetFilterSummary
                  selectedSpecies={selectedSpecies}
                  resultCount={filteredPets.length}
                  onRemoveSpecies={hasActiveFilters ? () => setSelectedSpecies("all") : undefined}
                />
              }
              onChangeSpecies={setSelectedSpecies}
            />
          }
        />
      )}

      {!isPetsError && isPetModalOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-text-primary/35 px-4 py-6"
          onClick={() => setIsPetModalOpen(false)}
        >
          <div
            className="grid max-h-full w-full max-w-[640px] gap-4 overflow-y-auto rounded-xl border border-border bg-surface px-6 py-6 shadow-[0_18px_44px_rgba(31,41,51,0.16)] sm:px-8 sm:py-7"
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
            className="grid max-h-full w-full max-w-[640px] gap-4 overflow-y-auto rounded-xl border border-border bg-surface px-6 py-6 shadow-[0_18px_44px_rgba(31,41,51,0.16)] sm:px-8 sm:py-7"
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
