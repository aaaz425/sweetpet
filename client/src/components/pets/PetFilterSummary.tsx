import { badgeClass } from "../ui";

type PetFilterSummaryProps = {
  selectedSpecies: string;
  resultCount: number;
};

export function PetFilterSummary({ selectedSpecies, resultCount }: PetFilterSummaryProps) {
  const speciesLabel = selectedSpecies === "all" ? "전체" : selectedSpecies;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-1">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-text-primary">현재 적용 조건</span>
        <span className={badgeClass}>종류: {speciesLabel}</span>
      </div>
      <span className="text-sm font-medium text-text-secondary">{resultCount}마리</span>
    </div>
  );
}
