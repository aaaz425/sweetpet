import { RecordForm } from "../components/records/RecordForm";
import { RecordList } from "../components/records/RecordList";
import type { RecordFormState, RecordItem } from "../types";

type RecordsPageProps = {
  records: RecordItem[];
  selectedPetId: number | null;
  onCreateRecord: (form: RecordFormState) => Promise<void>;
  onDeleteRecord: (id: number) => void;
};

export function RecordsPage({ records, selectedPetId, onCreateRecord, onDeleteRecord }: RecordsPageProps) {
  return (
    <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
      <RecordList records={records} onDeleteRecord={onDeleteRecord} />
      <RecordForm selectedPetId={selectedPetId} onSubmit={onCreateRecord} />
    </section>
  );
}
