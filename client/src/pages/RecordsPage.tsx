import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PetSelectField } from "../components/pets/PetSelectField";
import { RecordDetailModal } from "../components/records/RecordDetailModal";
import { RecordForm } from "../components/records/RecordForm";
import { RecordList } from "../components/records/RecordList";
import { primaryButtonClass, secondaryButtonClass } from "../components/ui";
import { useInfiniteRecords } from "../hooks/useRecords";
import type { Pet, RecordFormState, RecordItem } from "../types";

type RecordsPageProps = {
  pets: Pet[];
  onCreateRecord: (petId: number, form: RecordFormState) => Promise<void>;
  onDeleteRecord: (id: number) => void;
  onUpdateRecord: (id: number, form: RecordFormState) => Promise<void>;
};

function firstRegisteredPetId(pets: Pet[]) {
  return pets.reduce<number | null>((currentId, pet) => {
    if (currentId === null) return pet.id;
    return pet.id < currentId ? pet.id : currentId;
  }, null);
}

export function RecordsPage({ pets, onCreateRecord, onDeleteRecord, onUpdateRecord }: RecordsPageProps) {
  const defaultPetId = useMemo(() => firstRegisteredPetId(pets), [pets]);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [shouldEditSelectedRecord, setShouldEditSelectedRecord] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const records = useInfiniteRecords(selectedPetId);
  const selectedRecord = useMemo(
    () => records.records.find((record) => record.id === selectedRecordId) ?? null,
    [records.records, selectedRecordId]
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
    setIsRecordModalOpen(false);
  }

  function handleSelectRecord(record: RecordItem) {
    setShouldEditSelectedRecord(false);
    setSelectedRecordId(record.id);
  }

  function handleEditRecord(record: RecordItem) {
    setShouldEditSelectedRecord(true);
    setSelectedRecordId(record.id);
  }

  return (
    <section className="grid min-w-0 gap-4">
      <RecordList
        records={records.records}
        fetchNextPage={records.fetchNextPage}
        hasNextPage={records.hasNextPage}
        isLoading={records.isLoading}
        isFetchingNextPage={records.isFetchingNextPage}
        toolbarStart={(
          <PetSelectField
            pets={pets}
            selectedPetId={selectedPetId}
            onSelectPet={setSelectedPetId}
            hideHeader
          />
        )}
        toolbarAction={(
          <button
            className={primaryButtonClass}
            disabled={pets.length === 0}
            onClick={() => setIsRecordModalOpen(true)}
            type="button"
          >
            일상기록 작성
          </button>
        )}
        onDeleteRecord={onDeleteRecord}
        onEditRecord={handleEditRecord}
        onSelectRecord={handleSelectRecord}
      />

      {selectedRecord ? (
        <RecordDetailModal
          record={selectedRecord}
          initialIsEditing={shouldEditSelectedRecord}
          onClose={() => {
            setSelectedRecordId(null);
            setShouldEditSelectedRecord(false);
          }}
          onDeleteRecord={onDeleteRecord}
          onUpdateRecord={onUpdateRecord}
        />
      ) : null}

      {isRecordModalOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-text-primary/35 px-4 py-6"
          onClick={() => setIsRecordModalOpen(false)}
        >
          <div
            className="grid max-h-full w-full max-w-[640px] gap-4 overflow-y-auto rounded-xl border border-border bg-background px-6 py-6 shadow-lg sm:px-8 sm:py-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-text-primary">일상기록 작성</h2>
              <button
                aria-label="닫기"
                className={`${secondaryButtonClass} inline-flex h-9 w-9 items-center justify-center rounded-full border-none bg-transparent p-0`}
                onClick={() => setIsRecordModalOpen(false)}
                type="button"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <PetSelectField
              pets={pets}
              selectedPetId={selectedPetId}
              onSelectPet={setSelectedPetId}
              helperText="기록 대상"
            />
            <RecordForm
              selectedPetId={selectedPetId}
              isFramed={false}
              showTitle={false}
              onSubmit={handleCreateRecord}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
