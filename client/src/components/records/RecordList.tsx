import { CalendarDays, List } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { recordImageUrl } from "../../lib/mockImages";
import { cn } from "../../lib/utils";
import type { RecordItem } from "../../types";
import { EmptyState } from "../feedback/EmptyState";
import { badgeClass, panelClass, secondaryButtonClass } from "../ui";
import { RecordCalendarView } from "./RecordCalendarView";

type RecordListProps = {
  records: RecordItem[];
  fetchNextPage: () => Promise<unknown>;
  hasNextPage: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  toolbarAction: ReactNode;
  toolbarStart: ReactNode;
  onDeleteRecord: (id: number) => void;
  onSelectRecord: (record: RecordItem) => void;
};

type RecordViewMode = "list" | "calendar";

export function RecordList({
  records,
  fetchNextPage,
  hasNextPage,
  isLoading,
  isFetchingNextPage,
  toolbarAction,
  toolbarStart,
  onDeleteRecord,
  onSelectRecord
}: RecordListProps) {
  const [viewMode, setViewMode] = useState<RecordViewMode>("list");
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
                  className="grid min-w-0 gap-4 rounded-xl border border-border bg-surface p-4 transition duration-150 hover:border-primary md:grid-cols-[176px_minmax(0,1fr)_auto]"
                  key={record.id}
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
                      className="w-full max-w-sm text-left transition duration-150 hover:opacity-80 sm:max-w-none"
                      onClick={() => onSelectRecord(record)}
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
                      onClick={() => onSelectRecord(record)}
                      type="button"
                    >
                      {record.memo}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 self-start md:justify-end">
                    <button className={secondaryButtonClass} onClick={() => onSelectRecord(record)} type="button">상세</button>
                    <button className={secondaryButtonClass} onClick={() => onDeleteRecord(record.id)} type="button">삭제</button>
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
    </div>
  );
}
