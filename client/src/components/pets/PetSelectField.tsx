import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { petImageUrl } from "../../lib/mockImages";
import { cn } from "../../lib/utils";
import type { Pet } from "../../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

type PetSelectFieldProps = {
  pets: Pet[];
  selectedPetId: number | null;
  onSelectPet: (petId: number) => void;
  label?: string;
  helperText?: string;
};

type PetAvatarProps = {
  pet?: Pet;
};

function PetAvatar({ pet }: PetAvatarProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const label = pet?.name?.trim().slice(0, 1) || "?";

  useEffect(() => {
    setHasImageError(false);
  }, [pet?.id]);

  if (!pet || hasImageError) {
    return (
      <span
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary"
        aria-hidden="true"
      >
        {label}
      </span>
    );
  }

  return (
    <img
      className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-border"
      alt={`${pet.name} 대표 사진`}
      src={petImageUrl(pet)}
      onError={() => setHasImageError(true)}
    />
  );
}

export function PetSelectField({
  pets,
  selectedPetId,
  onSelectPet,
  label = "대상 반려동물",
  helperText
}: PetSelectFieldProps) {
  const labelId = useId();
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);

  return (
    <div className="grid min-w-0 gap-2">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <label className="text-sm font-semibold text-text-secondary" id={labelId}>
          {label}
        </label>
        {helperText ? <span className="text-xs font-medium text-text-secondary">{helperText}</span> : null}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex min-h-12 w-full min-w-0 cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 py-2 text-left transition duration-150 hover:border-primary hover:bg-primary-soft active:scale-[0.99]"
            aria-labelledby={labelId}
            disabled={pets.length === 0}
            type="button"
          >
            <span className="flex min-w-0 items-center gap-3">
              <PetAvatar pet={selectedPet} />
              <span className="grid min-w-0 gap-0.5">
                <span className="truncate text-sm font-bold text-text-primary">{selectedPet?.name ?? "반려동물 선택"}</span>
                <span className="truncate text-xs font-medium text-text-secondary">
                  {selectedPet ? selectedPet.breed || selectedPet.species : "기록과 주문에 사용할 반려동물을 선택하세요"}
                </span>
              </span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[min(22rem,calc(100vw-2rem))]">
          <DropdownMenuLabel>반려동물 선택</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {pets.map((pet) => {
            const isSelected = pet.id === selectedPetId;

            return (
              <DropdownMenuItem
                className={cn("gap-3 px-2 py-2.5", isSelected && "bg-primary-soft text-primary")}
                key={pet.id}
                onSelect={() => onSelectPet(pet.id)}
              >
                <PetAvatar pet={pet} />
                <span className="grid min-w-0 flex-1 gap-0.5">
                  <span className="truncate font-semibold">{pet.name}</span>
                  <span className="truncate text-xs text-text-secondary">{pet.breed || pet.species}</span>
                </span>
                {isSelected ? <Check className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
