import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ComponentProps } from "react";
import { DayPicker } from "react-day-picker";
import { ko } from "react-day-picker/locale";
import { cn } from "../../lib/utils";

type CalendarProps = ComponentProps<typeof DayPicker>;

export function Calendar({ className, classNames, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays
      className={cn("p-0", className)}
      classNames={{
        root: "",
        months: "block",
        month: "space-y-3",
        month_caption: "flex justify-center text-sm font-semibold text-text-primary",
        caption_label: "text-sm font-semibold text-text-primary",
        nav: "flex items-center justify-between",
        button_previous:
          "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition duration-150 hover:bg-primary-soft hover:text-primary disabled:pointer-events-none disabled:opacity-40",
        button_next:
          "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition duration-150 hover:bg-primary-soft hover:text-primary disabled:pointer-events-none disabled:opacity-40",
        month_grid: "border-collapse",
        weekdays: "",
        weekday: "h-8 text-center text-xs font-medium text-text-secondary",
        week: "",
        day: "h-9 w-9 p-0 text-center align-middle",
        day_button:
          "mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-sm text-text-primary transition duration-150 hover:bg-primary-soft hover:text-primary focus:bg-primary-soft focus:text-primary focus:outline-none",
        selected: "[&>button]:bg-primary [&>button]:text-surface [&>button]:hover:bg-primary [&>button]:hover:text-surface [&>button]:focus:bg-primary [&>button]:focus:text-surface",
        today: "[&>button]:font-bold [&>button]:text-primary",
        outside: "[&>button]:text-text-secondary [&>button]:opacity-40",
        disabled: "[&>button]:text-text-secondary [&>button]:opacity-30",
        range_middle: "[&>button]:bg-primary-soft",
        hidden: "invisible",
        ...classNames
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft aria-hidden="true" size={16} />
          ) : (
            <ChevronRight aria-hidden="true" size={16} />
          )
      }}
      locale={ko}
      {...props}
    />
  );
}
