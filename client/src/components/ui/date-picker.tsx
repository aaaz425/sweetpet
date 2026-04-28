import { CalendarIcon, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { Calendar } from "./calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(value: string) {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, index) => currentYear - index);
const months = Array.from({ length: 12 }, (_, index) => index);

export function DatePicker({
  value,
  onChange,
  placeholder = "날짜 선택",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = parseDate(value);
  const [month, setMonth] = useState(() =>
    startOfMonth(selectedDate ?? new Date()),
  );

  useEffect(() => {
    if (selectedDate) {
      setMonth(startOfMonth(selectedDate));
    }
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex min-h-10 w-full items-center justify-between rounded-xl border border-border bg-surface px-3 py-2.5 text-left text-sm text-text-primary outline-none transition duration-150 hover:border-primary hover:bg-primary-soft focus:border-primary focus:ring-2 focus:ring-primary-soft"
          type="button"
        >
          <span>{value || placeholder}</span>
          <CalendarIcon
            aria-hidden="true"
            className="text-text-secondary"
            size={16}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[304px]">
        <div className="mb-3 grid gap-2">
          <div className="grid grid-cols-2 gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="justify-between px-3" variant="secondary">
                  {month.getFullYear()}년
                  <ChevronDown aria-hidden="true" size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="max-h-64 min-w-28 overflow-y-auto"
              >
                <DropdownMenuLabel>연도 선택</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {years.map((year) => (
                  <DropdownMenuItem
                    disabled={year === month.getFullYear()}
                    key={year}
                    onSelect={() =>
                      setMonth(
                        (current) => new Date(year, current.getMonth(), 1),
                      )
                    }
                  >
                    {year}년
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="justify-between px-3" variant="secondary">
                  {month.getMonth() + 1}월
                  <ChevronDown aria-hidden="true" size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-44">
                <DropdownMenuLabel>월 선택</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="grid grid-cols-3 gap-1 p-1">
                  {months.map((monthIndex) => (
                    <DropdownMenuItem
                      className="justify-center px-2"
                      disabled={monthIndex === month.getMonth()}
                      key={monthIndex}
                      onSelect={() =>
                        setMonth(
                          (current) =>
                            new Date(current.getFullYear(), monthIndex, 1),
                        )
                      }
                    >
                      {monthIndex + 1}월
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Calendar
          hideNavigation
          mode="single"
          month={month}
          onMonthChange={setMonth}
          selected={selectedDate}
          onDayClick={(date) => {
            onChange(formatDate(date));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
