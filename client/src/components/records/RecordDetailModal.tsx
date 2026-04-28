import { Pencil, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { recordImageUrl } from "../../lib/mockImages";
import type { RecordFormState, RecordItem } from "../../types";
import { DeleteConfirmModal } from "../feedback/DeleteConfirmModal";
import { badgeClass } from "../ui";
import { RecordForm } from "./RecordForm";

type RecordDetailModalProps = {
  record: RecordItem;
  initialIsEditing?: boolean;
  onClose: () => void;
  onDeleteRecord: (id: number) => Promise<void>;
  onUpdateRecord: (id: number, form: RecordFormState) => Promise<void>;
};

function toRecordFormState(record: RecordItem): RecordFormState {
  return {
    recordDate: record.recordDate,
    condition: record.condition,
    memo: record.memo,
    tags: record.tags.join(", "),
    photo: null
  };
}

export function RecordDetailModal({
  record,
  initialIsEditing = false,
  onClose,
  onDeleteRecord,
  onUpdateRecord
}: RecordDetailModalProps) {
  const [isEditing, setIsEditing] = useState(initialIsEditing);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const initialValues = useMemo(() => toRecordFormState(record), [record]);

  useEffect(() => {
    setIsEditing(initialIsEditing);
  }, [initialIsEditing, record.id]);

  async function handleUpdateRecord(form: RecordFormState) {
    await onUpdateRecord(record.id, form);
    setIsEditing(false);
  }

  async function handleConfirmDeleteRecord() {
    setIsDeleting(true);
    try {
      await onDeleteRecord(record.id);
      setIsDeleteConfirmOpen(false);
    } finally {
      setIsDeleting(false);
    }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-text-primary/35 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="grid max-h-full w-full max-w-[760px] gap-4 overflow-y-auto rounded-xl border border-border bg-surface px-6 py-6 shadow-[0_18px_44px_rgba(31,41,51,0.16)] sm:px-8 sm:py-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-secondary">{record.recordDate}</p>
            <h2 className="truncate text-lg font-bold text-text-primary">{record.condition}</h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition duration-150 hover:bg-primary-soft hover:text-primary active:scale-[0.99]"
              onClick={() => setIsEditing((currentValue) => !currentValue)}
              aria-label={isEditing ? "상세 보기" : "일상기록 편집"}
              type="button"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition duration-150 hover:bg-primary-soft hover:text-primary active:scale-[0.99]"
              onClick={() => setIsDeleteConfirmOpen(true)}
              aria-label="일상기록 삭제"
              type="button"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              aria-label="닫기"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition duration-150 hover:bg-primary-soft hover:text-primary active:scale-[0.99]"
              onClick={onClose}
              type="button"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {isEditing ? (
          <RecordForm
            selectedPetId={record.petId}
            initialValues={initialValues}
            isFramed={false}
            showTitle={false}
            submitLabel="수정 저장"
            onSubmit={handleUpdateRecord}
          />
        ) : (
          <div className="grid min-w-0 gap-4 md:grid-cols-[280px_minmax(0,1fr)]">
            <img
              alt={`${record.recordDate} 일상기록 사진`}
              className="aspect-[4/3] w-full rounded-lg border border-border object-cover"
              src={recordImageUrl(record)}
            />
            <div className="grid content-start gap-4">
              <div className="grid gap-2">
                <span className="text-xs font-bold text-text-secondary">메모</span>
                <p className="whitespace-pre-wrap text-sm leading-6 text-text-primary">{record.memo}</p>
              </div>
              {record.tags.length > 0 ? (
                <div className="grid gap-2">
                  <span className="text-xs font-bold text-text-secondary">태그</span>
                  <div className="flex flex-wrap gap-2">
                    {record.tags.map((tag) => <span className={badgeClass} key={tag}>{tag}</span>)}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
      {isDeleteConfirmOpen ? (
        <DeleteConfirmModal
          title="일상기록 삭제"
          description={`${record.recordDate}의 일상기록을 삭제하시겠습니까? 삭제한 기록은 되돌릴 수 없습니다.`}
          isDeleting={isDeleting}
          onCancel={() => setIsDeleteConfirmOpen(false)}
          onConfirm={handleConfirmDeleteRecord}
        />
      ) : null}
    </div>
  );
}
