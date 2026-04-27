import { ChevronDown } from "lucide-react";
import { adminNavItems, pageLabels, userNavItems } from "../../constants";
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

type GlobalHeaderProps = {
  activePage: Page;
  pets: Pet[];
  selectedPetId: number | null;
  onSelectPage: (page: Page) => void;
  onSelectPet: (petId: number) => void;
};

export function GlobalHeader({ activePage, pets, selectedPetId, onSelectPage, onSelectPet }: GlobalHeaderProps) {
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4 px-4 py-4 md:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <button
            className="w-fit rounded-lg text-left transition duration-150 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary-soft"
            onClick={() => onSelectPage("records")}
            type="button"
          >
            <span className="block text-xs font-semibold uppercase tracking-normal text-text-secondary">Sweetpet</span>
            <strong className="block text-lg font-bold text-text-primary">기록 관리</strong>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <div className="grid gap-1">
              <span className="text-xs font-semibold text-text-secondary" id="pet-switcher-label">
                현재 반려동물
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-labelledby="pet-switcher-label" className="min-w-44 justify-between px-3 py-2" disabled={pets.length === 0}>
                    <span>{selectedPet?.name ?? "반려동물 선택"}</span>
                    <ChevronDown aria-hidden="true" size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[200px]">
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
          </div>
        </div>

        <nav className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]" aria-label="Primary navigation">
          <HeaderNavGroup activePage={activePage} label="User App" items={userNavItems} onSelectPage={onSelectPage} />
          <HeaderNavGroup activePage={activePage} label="Admin Console" items={adminNavItems} onSelectPage={onSelectPage} />
        </nav>
      </div>
    </header>
  );
}

type HeaderNavGroupProps = {
  activePage: Page;
  label: string;
  items: Page[];
  onSelectPage: (page: Page) => void;
};

function HeaderNavGroup({ activePage, label, items, onSelectPage }: HeaderNavGroupProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="min-w-fit text-xs font-semibold text-text-secondary">{label}</span>
      <div className="flex flex-wrap gap-2">
        {items.map((page) => (
          <button
            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition duration-150 hover:border-primary hover:bg-primary-soft hover:text-primary active:scale-[0.99] ${
              activePage === page ? "border-primary bg-primary-soft text-primary" : "border-border bg-surface text-text-secondary"
            }`}
            key={page}
            onClick={() => onSelectPage(page)}
            type="button"
          >
            {pageLabels[page]}
          </button>
        ))}
      </div>
    </div>
  );
}
