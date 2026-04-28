import { useEffect, useMemo, useState } from "react";
import { PetSelectField } from "../components/pets/PetSelectField";
import { RecordForm } from "../components/records/RecordForm";
import { RecordList } from "../components/records/RecordList";
import type { Pet, RecordFormState, RecordItem } from "../types";

type RecordsPageProps = {
  pets: Pet[];
  records: RecordItem[];
  onCreateRecord: (petId: number, form: RecordFormState) => Promise<void>;
  onDeleteRecord: (id: number) => void;
};

function firstRegisteredPetId(pets: Pet[]) {
  return pets.reduce<number | null>((currentId, pet) => {
    if (currentId === null) return pet.id;
    return pet.id < currentId ? pet.id : currentId;
  }, null);
}

export function RecordsPage({ pets, records, onCreateRecord, onDeleteRecord }: RecordsPageProps) {
  const defaultPetId = useMemo(() => firstRegisteredPetId(pets), [pets]);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const visibleRecords = useMemo(
    () => records.filter((record) => selectedPetId !== null && record.petId === selectedPetId),
    [records, selectedPetId]
  );

  useEffect(() => {
    setSelectedPetId((currentPetId) => {
      const hasCurrentPet = pets.some((pet) => pet.id === currentPetId);
      return hasCurrentPet ? currentPetId : defaultPetId;
    });
  }, [defaultPetId, pets]);

  async function handleCreateRecord(form: RecordFormState) {
    if (selectedPetId === null) return;
    await onCreateRecord(selectedPetId, form);
  }

  return (
    <section className="grid min-w-0 gap-4">
      <PetSelectField
        pets={pets}
        selectedPetId={selectedPetId}
        onSelectPet={setSelectedPetId}
        helperText={`${visibleRecords.length}개 기록`}
      />
      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <RecordList records={visibleRecords} onDeleteRecord={onDeleteRecord} />
        <RecordForm selectedPetId={selectedPetId} onSubmit={handleCreateRecord} />
      </div>
    </section>
  );
}
