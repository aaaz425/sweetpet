import { X } from "lucide-react";

type PetFilterSummaryProps = {
  selectedSpecies: string;
  resultCount: number;
  onRemoveSpecies?: () => void;
};

const summaryBadgeClass =
  "box-border inline-flex h-6 appearance-none items-center rounded-full border border-border-strong bg-primary-soft px-2.5 py-0 font-sans !text-xs font-semibold !leading-none text-primary";

export function PetFilterSummary({ selectedSpecies, resultCount, onRemoveSpecies }: PetFilterSummaryProps) {
  const speciesLabel = selectedSpecies === "all" ? "전체" : selectedSpecies;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-1">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-text-primary">현재 적용 조건</span>
        {onRemoveSpecies ? (
          <button
            aria-label="종류 조건 해제"
            className={`${summaryBadgeClass} max-w-full gap-1 transition duration-150 hover:border-primary hover:bg-surface`}
            onClick={onRemoveSpecies}
            type="button"
          >
            <span className="truncate font-sans !text-xs font-semibold !leading-none">종류: {speciesLabel}</span>
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        ) : (
          <span className={summaryBadgeClass}>
            <span className="truncate font-sans !text-xs font-semibold !leading-none">종류: {speciesLabel}</span>
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm font-medium text-text-secondary">{resultCount}마리</span>
      </div>
    </div>
  );
}
