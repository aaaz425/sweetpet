import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { recordImageUrl } from "../../lib/mockImages";
import { cn } from "../../lib/utils";
import type { Pet, RecordItem } from "../../types";
import { cardSurfaceClass } from "../ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

type RecordCalendarViewProps = {
  records: RecordItem[];
  pets: Pet[];
  onSelectRecord: (record: RecordItem) => void;
};

const calendarWeekdays = ["일", "월", "화", "수", "목", "금", "토"];
const calendarMonths = Array.from({ length: 12 }, (_, index) => index);
type CalendarPickerStep = "year" | "month";

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

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isAfterMonth(date: Date, maxDate: Date) {
  return startOfMonth(date) > startOfMonth(maxDate);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function getCalendarDays(activeMonth: Date) {
  const monthStart = startOfMonth(activeMonth);
  const monthEnd = new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 0);
  const firstCalendarDay = new Date(monthStart);
  const lastCalendarDay = new Date(monthEnd);
  firstCalendarDay.setDate(monthStart.getDate() - monthStart.getDay());
  lastCalendarDay.setDate(monthEnd.getDate() + (6 - monthEnd.getDay()));
  const calendarDayCount = Math.round((lastCalendarDay.getTime() - firstCalendarDay.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return Array.from({ length: calendarDayCount }, (_, index) => {
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

export function RecordCalendarView({ records, pets, onSelectRecord }: RecordCalendarViewProps) {
  const maxCalendarMonth = useMemo(() => startOfMonth(new Date()), []);
  const [activeMonth, setActiveMonth] = useState(() => startOfMonth(latestRecordMonth(records)));
  const [isCalendarPickerOpen, setIsCalendarPickerOpen] = useState(false);
  const [calendarPickerStep, setCalendarPickerStep] = useState<CalendarPickerStep>("year");
  const [selectedPickerYear, setSelectedPickerYear] = useState(() => activeMonth.getFullYear());
  const calendarYears = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return Array.from({ length: 100 }, (_, index) => currentYear - index);
  }, []);

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
  const petsById = useMemo(() => new Map(pets.map((pet) => [pet.id, pet])), [pets]);

  const calendarDays = useMemo(() => getCalendarDays(activeMonth), [activeMonth]);
  const isNextMonthDisabled = isAfterMonth(addMonths(activeMonth, 1), maxCalendarMonth);

  useEffect(() => {
    const latestMonth = startOfMonth(latestRecordMonth(records));
    setActiveMonth(isAfterMonth(latestMonth, maxCalendarMonth) ? maxCalendarMonth : latestMonth);
  }, [maxCalendarMonth, records]);

  useEffect(() => {
    if (!isCalendarPickerOpen) return;
    setCalendarPickerStep("year");
    setSelectedPickerYear(activeMonth.getFullYear());
  }, [activeMonth, isCalendarPickerOpen]);

  return (
    <div className="grid min-w-0 gap-3.5">
      <div className="flex items-center justify-center gap-1.5">
        <button
          aria-label="이전 달"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition duration-150 hover:bg-surface-muted hover:text-primary active:scale-[0.98]"
          onClick={() => setActiveMonth((currentMonth) => addMonths(currentMonth, -1))}
          type="button"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <DropdownMenu open={isCalendarPickerOpen} onOpenChange={setIsCalendarPickerOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className="inline-flex h-9 items-center justify-center gap-1 rounded-lg px-3 text-base font-bold text-text-primary transition duration-150 hover:bg-surface-muted active:scale-[0.99]"
              type="button"
            >
              {activeMonth.getFullYear()}년 {activeMonth.getMonth() + 1}월
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-80 w-56 overflow-y-auto">
            <DropdownMenuLabel>
              {calendarPickerStep === "year" ? "연도 선택" : `${selectedPickerYear}년 월 선택`}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="grid grid-cols-3 gap-1 p-1">
              {calendarPickerStep === "year"
                ? calendarYears.map((year) => (
                    <DropdownMenuItem
                      className="aspect-square justify-center px-2 text-center font-semibold"
                      key={year}
                      onSelect={(event) => {
                        event.preventDefault();
                        setSelectedPickerYear(year);
                        setCalendarPickerStep("month");
                      }}
                    >
                      {year}
                    </DropdownMenuItem>
                  ))
                : calendarMonths.map((monthIndex) => (
                    <DropdownMenuItem
                      className="aspect-square justify-center px-2 text-center font-semibold"
                      disabled={
                        isAfterMonth(new Date(selectedPickerYear, monthIndex, 1), maxCalendarMonth) ||
                        (selectedPickerYear === activeMonth.getFullYear() && monthIndex === activeMonth.getMonth())
                      }
                      key={monthIndex}
                      onSelect={() => {
                        setActiveMonth(new Date(selectedPickerYear, monthIndex, 1));
                        setIsCalendarPickerOpen(false);
                      }}
                    >
                      {monthIndex + 1}월
                    </DropdownMenuItem>
                  ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          aria-label="다음 달"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition duration-150 hover:bg-surface-muted hover:text-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-text-secondary"
          disabled={isNextMonthDisabled}
          onClick={() => {
            setActiveMonth((currentMonth) => {
              const nextMonth = addMonths(currentMonth, 1);
              return isAfterMonth(nextMonth, maxCalendarMonth) ? currentMonth : nextMonth;
            });
          }}
          type="button"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
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
                    src={recordImageUrl(representativeRecord, petsById.get(representativeRecord.petId))}
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
