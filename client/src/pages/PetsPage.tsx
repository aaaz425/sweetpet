import { PetForm } from "../components/pets/PetForm";
import { PetList } from "../components/pets/PetList";
import type { Pet, PetFormState } from "../types";

type PetsPageProps = {
  pets: Pet[];
  onCreatePet: (form: PetFormState) => Promise<void>;
};

export function PetsPage({ pets, onCreatePet }: PetsPageProps) {
  return (
    <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <PetList pets={pets} />
      <PetForm onSubmit={onCreatePet} />
    </section>
  );
}
