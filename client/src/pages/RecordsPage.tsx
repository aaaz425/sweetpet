import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DataLoadErrorState } from "../components/feedback/PageState";
import { PetSelectField } from "../components/pets/PetSelectField";
import { RecordDetailModal } from "../components/records/RecordDetailModal";
import { RecordFilterSummary, type RecordFilterSummaryItem } from "../components/records/RecordFilterSummary";
import { RecordFilters, type RecordSortOrder } from "../components/records/RecordFilters";
import { RecordForm } from "../components/records/RecordForm";
import { RecordList } from "../components/records/RecordList";
import { secondaryButtonClass } from "../components/ui";
import type { Pet, RecordFormState, RecordItem } from "../types";

type RecordsPageProps = {
  pets: Pet[];
  records: RecordItem[];
  isPetsError: boolean;
  isRecordsError: boolean;
  isRecordsLoading: boolean;
  onCreateRecord: (petId: number, form: RecordFormState) => Promise<void>;
  onDeleteRecord: (id: number) => Promise<void>;
  onUpdateRecord: (id: number, form: RecordFormState) => Promise<void>;
};

function firstRegisteredPetId(pets: Pet[]) {
  return pets.reduce<number | null>((currentId, pet) => {
    if (currentId === null) return pet.id;
    return pet.id < currentId ? pet.id : currentId;
  }, null);
}

function filterRecords({
  records,
  selectedPetId,
  startDate,
  endDate,
  selectedCondition,
  selectedTags
}: {
  records: RecordItem[];
  selectedPetId: number | null;
  startDate: string;
  endDate: string;
  selectedCondition: string;
  selectedTags: string[];
}) {
  return records.filter((record) => {
    if (selectedPetId !== null && record.petId !== selectedPetId) return false;
    if (startDate && record.recordDate < startDate) return false;
    if (endDate && record.recordDate > endDate) return false;
    if (selectedCondition !== "all" && record.condition !== selectedCondition) return false;
    if (selectedTags.length > 0 && !selectedTags.some((tag) => record.tags.includes(tag))) return false;

    return true;
  });
}

function sortRecords(records: RecordItem[], sortOrder: RecordSortOrder) {
  return [...records].sort((firstRecord, secondRecord) => {
    const dateComparison = firstRecord.recordDate.localeCompare(secondRecord.recordDate);
    const idComparison = firstRecord.id - secondRecord.id;
    const comparison = dateComparison || idComparison;

    return sortOrder === "newest" ? -comparison : comparison;
  });
}

function getDateRangeLabel(startDate: string, endDate: string) {
  if (startDate && endDate) return `${startDate} - ${endDate}`;
  if (startDate) return `${startDate} 이후`;
  return `${endDate} 이전`;
}

export function RecordsPage({
  pets,
  records,
  isPetsError,
  isRecordsError,
  isRecordsLoading,
  onCreateRecord,
  onDeleteRecord,
  onUpdateRecord
}: RecordsPageProps) {
  const defaultPetId = useMemo(() => firstRegisteredPetId(pets), [pets]);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [shouldEditSelectedRecord, setShouldEditSelectedRecord] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<RecordSortOrder>("newest");
  const petRecords = useMemo(
    () => records.filter((record) => selectedPetId === null || record.petId === selectedPetId),
    [records, selectedPetId]
  );
  const conditionOptions = useMemo(
    () => Array.from(new Set(petRecords.map((record) => record.condition))).sort((first, second) => first.localeCompare(second)),
    [petRecords]
  );
  const tagOptions = useMemo(
    () => Array.from(new Set(petRecords.flatMap((record) => record.tags))).sort((first, second) => first.localeCompare(second)),
    [petRecords]
  );
  const filteredRecords = useMemo(
    () => filterRecords({ records, selectedPetId, startDate, endDate, selectedCondition, selectedTags }),
    [endDate, records, selectedCondition, selectedPetId, selectedTags, startDate]
  );
  const sortedRecords = useMemo(() => sortRecords(filteredRecords, sortOrder), [filteredRecords, sortOrder]);
  const selectedRecord = useMemo(
    () => records.find((record) => record.id === selectedRecordId) ?? null,
    [records, selectedRecordId]
  );
  const selectedPet = useMemo(() => pets.find((pet) => pet.id === selectedPetId) ?? null, [pets, selectedPetId]);
  const activeFilterSummaryItems = useMemo(() => {
    const nextFilters: RecordFilterSummaryItem[] = [];

    if (selectedPet) {
      nextFilters.push({ label: "마이펫", value: selectedPet.name });
    }
    if (startDate || endDate) {
      nextFilters.push({ label: "기간", value: getDateRangeLabel(startDate, endDate), onRemove: () => {
        setStartDate("");
        setEndDate("");
      } });
    }
    if (selectedCondition !== "all") {
      nextFilters.push({ label: "컨디션", value: selectedCondition, onRemove: () => setSelectedCondition("all") });
    }
    nextFilters.push({
      label: "정렬",
      value: sortOrder === "newest" ? "최신순" : "오래된순",
      onRemove: sortOrder === "oldest" ? () => setSortOrder("newest") : undefined
    });
    if (selectedTags.length > 0) {
      nextFilters.push({ label: "태그", value: selectedTags.join(", "), onRemove: () => setSelectedTags([]) });
    }

    return nextFilters;
  }, [endDate, selectedCondition, selectedPet, selectedTags, sortOrder, startDate]);
  const emptyTitle = petRecords.length === 0 ? "작성된 일상기록이 없습니다" : "조건에 맞는 일상기록이 없습니다";
  const emptyDescription =
    petRecords.length === 0
      ? "선택한 반려동물의 사진, 컨디션, 메모를 남기면 이곳에서 날짜순으로 확인할 수 있습니다."
      : "적용한 날짜, 컨디션, 태그 조건을 조정하면 더 많은 기록을 확인할 수 있습니다.";

  useEffect(() => {
    setSelectedPetId((currentPetId) => {
      const hasCurrentPet = pets.some((pet) => pet.id === currentPetId);
      return hasCurrentPet ? currentPetId : defaultPetId;
    });
  }, [defaultPetId, pets]);

  useEffect(() => {
    if (selectedCondition !== "all" && !conditionOptions.includes(selectedCondition)) {
      setSelectedCondition("all");
    }
    setSelectedTags((currentTags) => currentTags.filter((tag) => tagOptions.includes(tag)));
  }, [conditionOptions, selectedCondition, tagOptions]);

  function toggleSelectedTag(tag: string) {
    setSelectedTags((currentTags) =>
      currentTags.includes(tag) ? currentTags.filter((selectedTag) => selectedTag !== tag) : [...currentTags, tag]
    );
  }

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
      {isPetsError ? (
        <DataLoadErrorState title="마이펫 정보를 불러오지 못했습니다" />
      ) : (
        <RecordList
          records={sortedRecords}
          fetchNextPage={() => Promise.resolve()}
          hasNextPage={false}
          isLoading={isRecordsLoading}
          isError={isRecordsError}
          isFetchingNextPage={false}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
          onCreateRecord={pets.length > 0 ? () => setIsRecordModalOpen(true) : undefined}
          filters={(
            <RecordFilters
              conditionOptions={conditionOptions}
              tagOptions={tagOptions}
              startDate={startDate}
              endDate={endDate}
              selectedCondition={selectedCondition}
              selectedTags={selectedTags}
              sortOrder={sortOrder}
              petSelector={(
                <PetSelectField
                  pets={pets}
                  selectedPetId={selectedPetId}
                  onSelectPet={setSelectedPetId}
                  label="마이펫"
                  size="compact"
                />
              )}
              summary={(
                <RecordFilterSummary
                  filters={activeFilterSummaryItems}
                  resultCount={sortedRecords.length}
                />
              )}
              onChangeStartDate={setStartDate}
              onChangeEndDate={setEndDate}
              onChangeCondition={setSelectedCondition}
              onToggleTag={toggleSelectedTag}
              onClearTags={() => setSelectedTags([])}
              onChangeSortOrder={setSortOrder}
            />
          )}
          onDeleteRecord={onDeleteRecord}
          onEditRecord={handleEditRecord}
          onSelectRecord={handleSelectRecord}
        />
      )}

      {!isPetsError && selectedRecord ? (
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

      {!isPetsError && isRecordModalOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-text-primary/35 px-4 py-6"
          onClick={() => setIsRecordModalOpen(false)}
        >
          <div
            className="grid max-h-full w-full max-w-[640px] gap-4 overflow-y-auto rounded-xl border border-border bg-surface px-6 py-6 shadow-[0_18px_44px_rgba(31,41,51,0.16)] sm:px-8 sm:py-7"
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
