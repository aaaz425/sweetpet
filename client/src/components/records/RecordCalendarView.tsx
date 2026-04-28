import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { recordImageUrl } from "../../lib/mockImages";
import { cn } from "../../lib/utils";
import type { RecordItem } from "../../types";
import { cardSurfaceClass, secondaryButtonClass } from "../ui";

type RecordCalendarViewProps = {
  records: RecordItem[];
  onSelectRecord: (record: RecordItem) => void;
};

const calendarWeekdays = ["일", "월", "화", "수", "목", "금", "토"];

function parseRecordDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatMonthLabel(date: Date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function getCalendarDays(activeMonth: Date) {
  const monthStart = startOfMonth(activeMonth);
  const firstCalendarDay = new Date(monthStart);
  firstCalendarDay.setDate(monthStart.getDate() - monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(firstCalendarDay);
    day.setDate(firstCalendarDay.getDate() + index);
    return day;
  });
}

function latestRecordMonth(records: RecordItem[]) {
  if (records.length === 0) return startOfMonth(new Date());

  return records.reduce((latestDate, record) => {
    const recordDate = parseRecordDate(record.recordDate);
    return recordDate > latestDate ? recordDate : latestDate;
  }, parseRecordDate(records[0].recordDate));
}

export function RecordCalendarView({ records, onSelectRecord }: RecordCalendarViewProps) {
  const [activeMonth, setActiveMonth] = useState(() => startOfMonth(latestRecordMonth(records)));

  const recordsByDate = useMemo(() => {
    const groupedRecords = new Map<string, RecordItem[]>();

    records.forEach((record) => {
      const dailyRecords = groupedRecords.get(record.recordDate) ?? [];
      groupedRecords.set(record.recordDate, [...dailyRecords, record]);
    });

    groupedRecords.forEach((dailyRecords) => {
      dailyRecords.sort((firstRecord, secondRecord) => secondRecord.id - firstRecord.id);
    });

    return groupedRecords;
  }, [records]);

  const calendarDays = useMemo(() => getCalendarDays(activeMonth), [activeMonth]);

  useEffect(() => {
    setActiveMonth(startOfMonth(latestRecordMonth(records)));
  }, [records]);

  return (
    <div className="grid min-w-0 gap-3.5">
      <div className={`flex items-center justify-between gap-3 px-3 py-2 ${cardSurfaceClass}`}>
        <button
          aria-label="이전 달"
          className={`${secondaryButtonClass} inline-flex h-9 w-9 items-center justify-center rounded-lg p-0`}
          onClick={() => setActiveMonth((currentMonth) => addMonths(currentMonth, -1))}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <h3 className="text-base font-bold text-text-primary">{formatMonthLabel(activeMonth)}</h3>
        <button
          aria-label="다음 달"
          className={`${secondaryButtonClass} inline-flex h-9 w-9 items-center justify-center rounded-lg p-0`}
          onClick={() => setActiveMonth((currentMonth) => addMonths(currentMonth, 1))}
          type="button"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className={`grid grid-cols-7 overflow-hidden ${cardSurfaceClass}`}>
        {calendarWeekdays.map((weekday) => (
          <div
            className="border-b border-border bg-surface-muted px-2 py-2 text-center text-xs font-bold text-text-secondary"
            key={weekday}
          >
            {weekday}
          </div>
        ))}
        {calendarDays.map((calendarDay) => {
          const dateKey = formatDateKey(calendarDay);
          const dailyRecords = recordsByDate.get(dateKey) ?? [];
          const representativeRecord = dailyRecords[0];
          const isActiveMonth = calendarDay.getMonth() === activeMonth.getMonth();

          return (
            <div
              className={cn(
                "min-h-[112px] border-b border-r border-border p-2.5 sm:min-h-[148px]",
                !isActiveMonth && "bg-surface-muted text-text-secondary"
              )}
              key={dateKey}
            >
              <time className="text-xs font-bold text-text-secondary">{calendarDay.getDate()}</time>
              {representativeRecord ? (
                <button
                  className="mt-2 grid min-w-0 rounded-lg text-left transition duration-150 hover:bg-primary-soft/30 hover:opacity-90 active:scale-[0.99]"
                  onClick={() => onSelectRecord(representativeRecord)}
                  type="button"
                >
                  <img
                    alt={`${representativeRecord.recordDate} 대표 사진`}
                    className="aspect-[4/3] w-full rounded-lg border border-border object-cover"
                    src={recordImageUrl(representativeRecord)}
                  />
                  {dailyRecords.length > 1 ? (
                    <span className="mx-1 mb-1 mt-1 inline-flex w-fit rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
                      +{dailyRecords.length - 1}
                    </span>
                  ) : null}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
