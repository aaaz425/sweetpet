import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
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
  summary?: ReactNode;
  onChangeSpecies: (value: string) => void;
};

export function PetFilters({
  speciesOptions,
  selectedSpecies,
  summary,
  onChangeSpecies
}: PetFiltersProps) {
  const selectedSpeciesLabel = selectedSpecies === "all" ? "전체" : selectedSpecies;

  return (
    <div className="grid gap-3 rounded-xl border border-border bg-surface p-3">
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
      {summary}
    </div>
  );
}
