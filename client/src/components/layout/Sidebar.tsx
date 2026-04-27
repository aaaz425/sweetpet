import { ChevronDown } from "lucide-react";
import { navItems, pageLabels } from "../../constants";
import type { Page, Pet } from "../../types";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

type SidebarProps = {
  activePage: Page;
  pets: Pet[];
  selectedPetId: number | null;
  onSelectPage: (page: Page) => void;
  onSelectPet: (petId: number) => void;
};

export function Sidebar({ activePage, pets, selectedPetId, onSelectPage, onSelectPet }: SidebarProps) {
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);

  return (
    <aside className="border-b border-border bg-surface px-4 py-4 md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r md:px-5 md:py-6">
      <div className="mb-5 flex items-center justify-between gap-4 md:mb-8 md:block">
        <div>
          <p className="text-xs font-semibold uppercase tracking-normal text-text-secondary">sweetpet</p>
          <strong className="mt-1 block text-lg font-bold text-text-primary">기록 관리</strong>
        </div>
        <div className="hidden rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary md:inline-flex">
          Record to Export
        </div>
      </div>

      <nav className="grid grid-cols-4 gap-2 md:grid-cols-1" aria-label="Main navigation">
        {navItems.map((page) => (
          <button
            className={`rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition duration-150 hover:bg-primary-soft active:scale-[0.99] ${
              activePage === page ? "bg-primary-soft text-primary" : "text-text-secondary"
            }`}
            key={page}
            onClick={() => onSelectPage(page)}
            type="button"
          >
            {pageLabels[page]}
          </button>
        ))}
      </nav>

      <div className="mt-4 grid gap-2 md:mt-8">
        <span className="text-xs font-semibold text-text-secondary" id="pet-switcher-label">
          현재 반려동물
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-labelledby="pet-switcher-label" className="w-full justify-between px-3 py-2.5" disabled={pets.length === 0}>
              <span>{selectedPet?.name ?? "반려동물 선택"}</span>
              <ChevronDown aria-hidden="true" size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[200px]">
            <DropdownMenuLabel>반려동물</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {pets.map((pet) => (
              <DropdownMenuItem disabled={pet.id === selectedPetId} key={pet.id} onSelect={() => onSelectPet(pet.id)}>
                {pet.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
