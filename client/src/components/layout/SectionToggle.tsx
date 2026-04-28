import type { Page } from "../../types";
import { cn } from "../../lib/utils";

type SectionToggleProps = {
  activeSection: "user" | "admin";
  onSelectSection: (page: Page) => void;
};

const sectionOptions = [
  { key: "user", label: "사용자", page: "home" },
  { key: "admin", label: "관리자", page: "admin-orders" }
] as const;

export function SectionToggle({ activeSection, onSelectSection }: SectionToggleProps) {
  function handleSelect(section: (typeof sectionOptions)[number]) {
    if (section.key !== activeSection) {
      onSelectSection(section.page);
      return;
    }

    onSelectSection(activeSection === "user" ? "admin-orders" : "home");
  }

  return (
    <div
      className="relative grid grid-cols-2 rounded-full border border-border bg-background p-0.5"
      aria-label="앱 전환"
      role="tablist"
    >
      <span
        className={cn(
          "absolute left-0.5 top-0.5 h-[calc(100%-0.25rem)] w-[calc(50%-0.125rem)] rounded-full bg-primary shadow-sm transition-transform duration-[180ms] ease-out",
          activeSection === "admin" && "translate-x-full"
        )}
        aria-hidden="true"
      />
      {sectionOptions.map((option) => (
        <button
          className={cn(
            "relative z-10 min-h-8 cursor-pointer whitespace-nowrap rounded-full px-3 text-xs font-semibold transition-colors duration-[180ms] active:scale-[0.99]",
            activeSection === option.key ? "text-surface hover:text-surface" : "text-text-secondary hover:text-primary"
          )}
          key={option.key}
          onClick={() => handleSelect(option)}
          role="tab"
          aria-selected={activeSection === option.key}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
