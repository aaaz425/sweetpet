import { CalendarDays, List, Pencil, Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { recordImageUrl } from "../../lib/mockImages";
import { cn } from "../../lib/utils";
import type { RecordItem } from "../../types";
import { DeleteConfirmModal } from "../feedback/DeleteConfirmModal";
import { DataLoadErrorState } from "../feedback/PageState";
import { EmptyState } from "../feedback/EmptyState";
import { badgeClass, cardSurfaceClass, panelClass } from "../ui";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { RecordCalendarView } from "./RecordCalendarView";

type RecordListProps = {
  records: RecordItem[];
  fetchNextPage: () => Promise<unknown>;
  hasNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  filters?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  onCreateRecord?: () => void;
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
  filters,
  emptyTitle = "작성된 일상기록이 없습니다",
  emptyDescription = "선택한 반려동물의 사진, 컨디션, 메모를 남기면 이곳에서 날짜순으로 확인할 수 있습니다.",
  onCreateRecord,
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

  function toggleViewMode(selectedViewMode: RecordViewMode) {
    setViewMode((currentViewMode) => {
      if (currentViewMode !== selectedViewMode) return selectedViewMode;
      return currentViewMode === "list" ? "calendar" : "list";
    });
  }

  const viewModeToggle = (
    <TooltipProvider delayDuration={120}>
      <div
        className="relative grid grid-cols-2 rounded-full border border-white/50 bg-white/60 p-0.5 shadow-sm backdrop-blur-xl"
        aria-label="일상기록 보기 방식"
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 h-[calc(100%-0.25rem)] w-[calc(50%-0.125rem)] rounded-full bg-primary shadow transition-transform duration-200 ease-out",
            viewMode === "calendar" && "translate-x-full"
          )}
          aria-hidden="true"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              aria-label="리스트 보기"
              aria-pressed={viewMode === "list"}
              className={cn(
                "relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-[180ms] active:scale-[0.98]",
                viewMode === "list" ? "text-surface hover:text-surface" : "text-text-secondary hover:text-primary"
              )}
              onClick={() => toggleViewMode("list")}
              type="button"
            >
              <List className="h-4 w-4" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent>리스트 보기</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              aria-label="캘린더 보기"
              aria-pressed={viewMode === "calendar"}
              className={cn(
                "relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-[180ms] active:scale-[0.98]",
                viewMode === "calendar" ? "text-surface hover:text-surface" : "text-text-secondary hover:text-primary"
              )}
              onClick={() => toggleViewMode("calendar")}
              type="button"
            >
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent>캘린더 보기</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );

  const createRecordButton = onCreateRecord ? (
    <button
      aria-label="일상기록 작성"
      className="fixed bottom-5 right-5 z-40 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary bg-primary px-4 py-3 text-sm font-bold text-surface shadow-[0_14px_32px_rgba(25,23,20,0.22)] transition duration-150 hover:border-accent hover:bg-accent active:scale-[0.98] sm:bottom-10 sm:right-10 lg:right-[calc((100vw-1120px)/4+2rem)]"
      onClick={onCreateRecord}
      type="button"
    >
      <Plus className="h-5 w-5" aria-hidden="true" />
      <span>일상기록 작성</span>
    </button>
  ) : null;

  return (
    <div className={`${panelClass} grid min-w-0 gap-5`}>
      {filters}

      {isLoading ? (
        <div className="rounded-xl border border-border bg-surface-muted px-4 py-8 text-center text-sm font-medium text-text-secondary">
          일상기록을 불러오는 중입니다
        </div>
      ) : isError ? (
        <DataLoadErrorState title="일상기록을 불러오지 못했습니다" isFramed={false} />
      ) : (
        <div className={`overflow-hidden ${cardSurfaceClass}`}>
          <div className="flex justify-start bg-surface px-2.5 py-1.5">
            {viewModeToggle}
          </div>
          <div className="min-w-0">
            {records.length === 0 ? (
              <div className="p-3">
                <EmptyState
                  title={emptyTitle}
                  description={emptyDescription}
                />
              </div>
            ) : null}
            {viewMode === "list" ? (
              <div className="grid min-w-0">
              {records.map((record) => (
                <article
                  className="grid min-w-0 cursor-pointer gap-3.5 border-b border-border p-4 transition duration-150 last:border-b-0 hover:bg-surface-muted/45 active:scale-[0.99] sm:grid-cols-[144px_minmax(0,1fr)_auto] sm:items-start sm:gap-4 md:grid-cols-[156px_minmax(0,1fr)_auto] md:p-5"
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
                    className="grid h-full min-w-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-2 text-left transition duration-150 hover:text-text-primary"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectRecord(record);
                    }}
                    type="button"
                  >
                    <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                      <time className="text-sm font-medium leading-5 text-text-secondary">{record.recordDate}</time>
                      <h3 className="min-w-0 truncate text-base font-bold leading-6 text-text-primary">{record.condition}</h3>
                    </div>
                    <p className="line-clamp-3 max-w-3xl self-start text-sm leading-6 text-text-secondary">{record.memo}</p>
                    {record.tags.length > 0 ? (
                      <div className="flex flex-wrap content-end gap-2 self-end">
                        {record.tags.map((tag) => <span className={badgeClass} key={tag}>{tag}</span>)}
                      </div>
                    ) : <span aria-hidden="true" />}
                  </button>
                  <div className="flex shrink-0 gap-1 self-start sm:justify-end">
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
                <div className="border-t border-border bg-surface-muted px-4 py-3 text-center text-sm font-medium text-text-secondary">
                  일상기록을 더 불러오는 중입니다
                </div>
              ) : null}
              </div>
            ) : records.length > 0 ? (
              <div className="p-5 sm:p-6">
                <RecordCalendarView records={records} onSelectRecord={onSelectRecord} />
              </div>
            ) : null}
          </div>
        </div>
      )}
      {createRecordButton}
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
