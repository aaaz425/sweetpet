import { CalendarDays, List, Pencil, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { recordImageUrl } from "../../lib/mockImages";
import { cn } from "../../lib/utils";
import type { RecordItem } from "../../types";
import { DeleteConfirmModal } from "../feedback/DeleteConfirmModal";
import { DataLoadErrorState } from "../feedback/PageState";
import { EmptyState } from "../feedback/EmptyState";
import { badgeClass, panelClass } from "../ui";
import { RecordCalendarView } from "./RecordCalendarView";

type RecordListProps = {
  records: RecordItem[];
  fetchNextPage: () => Promise<unknown>;
  hasNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  toolbarAction: ReactNode;
  toolbarStart: ReactNode;
  onDeleteRecord: (id: number) => Promise<void>;
  onEditRecord: (record: RecordItem) => void;
  onSelectRecord: (record: RecordItem) => void;
};

type RecordViewMode = "list" | "calendar";

export function RecordList({
  records,
  fetchNextPage,
  hasNextPage,
  isLoading,
  isError,
  isFetchingNextPage,
  toolbarAction,
  toolbarStart,
  onDeleteRecord,
  onEditRecord,
  onSelectRecord
}: RecordListProps) {
  const [viewMode, setViewMode] = useState<RecordViewMode>("list");
  const [deleteTargetRecord, setDeleteTargetRecord] = useState<RecordItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (viewMode !== "list" || !hasNextPage || isFetchingNextPage) return;

    const loadMoreElement = loadMoreRef.current;
    if (!loadMoreElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void fetchNextPage();
        }
      },
      { rootMargin: "240px 0px" }
    );

    observer.observe(loadMoreElement);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, viewMode]);

  useEffect(() => {
    if (viewMode !== "calendar" || !hasNextPage || isFetchingNextPage) return;
    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, viewMode]);

  async function handleConfirmDeleteRecord() {
    if (!deleteTargetRecord) return;

    setIsDeleting(true);
    try {
      await onDeleteRecord(deleteTargetRecord.id);
      setDeleteTargetRecord(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className={`${panelClass} grid min-w-0 gap-4`}>
      <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(220px,1fr)_auto_auto] lg:items-end">
        <div className="min-w-0">{toolbarStart}</div>
        <div
          className="grid grid-cols-2 rounded-xl border border-border bg-background p-1"
          aria-label="일상기록 보기 방식"
          role="tablist"
        >
          <button
            className={cn(
              "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition duration-150",
              viewMode === "list" ? "bg-surface text-primary shadow-sm" : "text-text-secondary hover:text-primary"
            )}
            onClick={() => setViewMode("list")}
            role="tab"
            aria-selected={viewMode === "list"}
            type="button"
          >
            <List className="h-4 w-4" aria-hidden="true" />
            리스트
          </button>
          <button
            className={cn(
              "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition duration-150",
              viewMode === "calendar" ? "bg-surface text-primary shadow-sm" : "text-text-secondary hover:text-primary"
            )}
            onClick={() => setViewMode("calendar")}
            role="tab"
            aria-selected={viewMode === "calendar"}
            type="button"
          >
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            캘린더
          </button>
        </div>
        <div className="grid min-w-0">{toolbarAction}</div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-border bg-background px-4 py-8 text-center text-sm font-medium text-text-secondary">
          일상기록을 불러오는 중입니다
        </div>
      ) : isError ? (
        <DataLoadErrorState title="일상기록을 불러오지 못했습니다" isFramed={false} />
      ) : records.length === 0 ? (
        <EmptyState
          title="작성된 일상기록이 없습니다"
          description="선택한 반려동물의 사진, 컨디션, 메모를 남기면 이곳에서 날짜순으로 확인할 수 있습니다."
        />
      ) : (
        <div className="grid min-w-0 gap-3">
          {viewMode === "list" ? (
            <>
              {records.map((record) => (
                <article
                  className="grid min-w-0 cursor-pointer gap-4 rounded-xl border border-border bg-surface p-4 transition duration-150 hover:border-primary hover:bg-primary-soft/30 active:scale-[0.99] md:grid-cols-[176px_minmax(0,1fr)_auto]"
                  key={record.id}
                  onClick={() => onSelectRecord(record)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelectRecord(record);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="grid content-start gap-3">
                    <time className="text-sm font-medium text-text-secondary">{record.recordDate}</time>
                    <h3 className="text-base font-bold text-text-primary">{record.condition}</h3>
                    {record.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {record.tags.map((tag) => <span className={badgeClass} key={tag}>{tag}</span>)}
                      </div>
                    ) : null}
                  </div>
                  <div className="grid min-w-0 gap-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start">
                    <button
                      className="w-full max-w-sm text-left sm:max-w-none"
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelectRecord(record);
                      }}
                      type="button"
                    >
                      <img
                        alt={`${record.recordDate} 일상기록 사진`}
                        className="aspect-[4/3] w-full rounded-lg border border-border object-cover"
                        src={recordImageUrl(record)}
                      />
                    </button>
                    <button
                      className="min-w-0 text-left text-sm leading-6 text-text-secondary transition duration-150 hover:text-text-primary"
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelectRecord(record);
                      }}
                      type="button"
                    >
                      {record.memo}
                    </button>
                  </div>
                  <div className="flex shrink-0 gap-1 self-start md:justify-end">
                    <button
                      aria-label={`${record.recordDate} 일상기록 편집`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition duration-150 hover:bg-primary-soft hover:text-primary active:scale-[0.99]"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEditRecord(record);
                      }}
                      type="button"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button
                      aria-label={`${record.recordDate} 일상기록 삭제`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition duration-150 hover:bg-primary-soft hover:text-primary active:scale-[0.99]"
                      onClick={(event) => {
                        event.stopPropagation();
                        setDeleteTargetRecord(record);
                      }}
                      type="button"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
              {hasNextPage ? <div ref={loadMoreRef} className="h-1" aria-hidden="true" /> : null}
              {isFetchingNextPage ? (
                <div className="rounded-xl border border-border bg-background px-4 py-3 text-center text-sm font-medium text-text-secondary">
                  일상기록을 더 불러오는 중입니다
                </div>
              ) : null}
            </>
          ) : <RecordCalendarView records={records} onSelectRecord={onSelectRecord} />}
        </div>
      )}
      {deleteTargetRecord ? (
        <DeleteConfirmModal
          title="일상기록 삭제"
          description={`${deleteTargetRecord.recordDate}의 일상기록을 삭제하시겠습니까? 삭제한 기록은 되돌릴 수 없습니다.`}
          isDeleting={isDeleting}
          onCancel={() => setDeleteTargetRecord(null)}
          onConfirm={handleConfirmDeleteRecord}
        />
      ) : null}
    </div>
  );
}
