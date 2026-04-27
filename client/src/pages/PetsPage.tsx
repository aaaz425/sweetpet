import type { Dispatch, FormEvent, SetStateAction } from "react";
import { PetForm } from "../components/pets/PetForm";
import { PetList } from "../components/pets/PetList";
import type { Pet, PetFormState } from "../types";

type PetsPageProps = {
  pets: Pet[];
  selectedPetId: number | null;
  petForm: PetFormState;
  setPetForm: Dispatch<SetStateAction<PetFormState>>;
  onSelectPet: (petId: number) => void;
  onCreatePet: (event: FormEvent) => void;
};

export function PetsPage({ pets, selectedPetId, petForm, setPetForm, onSelectPet, onCreatePet }: PetsPageProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <PetList pets={pets} selectedPetId={selectedPetId} onSelectPet={onSelectPet} />
      <PetForm form={petForm} setForm={setPetForm} onSubmit={onCreatePet} />
    </section>
  );
}
