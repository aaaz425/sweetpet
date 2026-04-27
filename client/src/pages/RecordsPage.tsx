import type { Dispatch, FormEvent, SetStateAction } from "react";
import { RecordForm } from "../components/records/RecordForm";
import { RecordList } from "../components/records/RecordList";
import type { RecordFormState, RecordItem } from "../types";

type RecordsPageProps = {
  records: RecordItem[];
  recordForm: RecordFormState;
  selectedPetId: number | null;
  setRecordForm: Dispatch<SetStateAction<RecordFormState>>;
  onCreateRecord: (event: FormEvent) => void;
  onDeleteRecord: (id: number) => void;
};

export function RecordsPage({ records, recordForm, selectedPetId, setRecordForm, onCreateRecord, onDeleteRecord }: RecordsPageProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
      <RecordList records={records} onDeleteRecord={onDeleteRecord} />
      <RecordForm form={recordForm} setForm={setRecordForm} selectedPetId={selectedPetId} onSubmit={onCreateRecord} />
    </section>
  );
}
