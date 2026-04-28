import { ChevronDown, X } from "lucide-react";
import type { ReactNode } from "react";
import { secondaryButtonClass } from "../ui";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

type PetFiltersProps = {
  speciesOptions: string[];
  selectedSpecies: string;
  hasActiveFilters: boolean;
  summary?: ReactNode;
  onChangeSpecies: (value: string) => void;
  onResetFilters: () => void;
};

export function PetFilters({
  speciesOptions,
  selectedSpecies,
  hasActiveFilters,
  summary,
  onChangeSpecies,
  onResetFilters
}: PetFiltersProps) {
  const selectedSpeciesLabel = selectedSpecies === "all" ? "전체" : selectedSpecies;

  return (
    <div className="mb-5 grid gap-3 rounded-xl border border-border bg-surface p-3">
      <label className="grid max-w-sm gap-1.5 text-sm font-semibold text-text-secondary">
        종류
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full justify-between px-3" variant="secondary">
              <span className="truncate">{selectedSpeciesLabel}</span>
              <ChevronDown aria-hidden="true" size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-72 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto">
            <DropdownMenuLabel>종류</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={selectedSpecies === "all"} onSelect={() => onChangeSpecies("all")}>
              전체
            </DropdownMenuItem>
            {speciesOptions.map((species) => (
              <DropdownMenuItem disabled={selectedSpecies === species} key={species} onSelect={() => onChangeSpecies(species)}>
                {species}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </label>
      {hasActiveFilters ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-text-secondary">필터가 적용된 마이펫을 보고 있습니다.</span>
          <button className={`${secondaryButtonClass} min-h-9 px-3 py-2`} onClick={onResetFilters} type="button">
            <X className="h-4 w-4" aria-hidden="true" />
            필터 초기화
          </button>
        </div>
      ) : null}
      {summary}
    </div>
  );
}
