import { recordImageUrl } from "../../lib/mockImages";
import type { RecordItem } from "../../types";
import { EmptyState } from "../feedback/EmptyState";
import { badgeClass, panelClass, secondaryButtonClass } from "../ui";

type RecordListProps = {
  records: RecordItem[];
  onDeleteRecord: (id: number) => void;
};

export function RecordList({ records, onDeleteRecord }: RecordListProps) {
  return (
    <div className={panelClass}>
      {records.length === 0 ? (
        <EmptyState
          title="작성된 일상기록이 없습니다"
          description="선택한 반려동물의 사진, 컨디션, 메모를 남기면 이곳에서 날짜순으로 확인할 수 있습니다."
        />
      ) : (
        <div className="grid min-w-0 gap-3">
          {records.map((record) => (
            <article
              className="grid min-w-0 gap-4 rounded-xl border border-border bg-surface p-4 transition duration-150 hover:border-primary sm:grid-cols-[112px_minmax(0,1fr)_auto]"
              key={record.id}
            >
              <div className="grid content-start gap-2">
                <time className="text-sm font-medium text-text-secondary">{record.recordDate}</time>
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-text-primary">{record.condition}</h3>
                <img
                  alt={`${record.recordDate} 일상기록 사진`}
                  className="mt-3 aspect-[4/3] w-full max-w-sm rounded-lg border border-border object-cover"
                  src={recordImageUrl(record)}
                />
                <p className="mt-2 text-sm leading-6 text-text-secondary">{record.memo}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {record.tags.map((tag) => <span className={badgeClass} key={tag}>{tag}</span>)}
                </div>
              </div>
              <button className={`${secondaryButtonClass} self-start`} onClick={() => onDeleteRecord(record.id)} type="button">삭제</button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
