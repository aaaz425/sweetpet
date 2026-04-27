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
  const activeSection = activePage === "admin-orders" || activePage === "export" ? "admin" : "user";
  const visibleNavItems = activeSection === "admin" ? adminNavItems : userNavItems;

  return (
    <header className="z-40 flex-none border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-[1120px] min-w-0 flex-col gap-3 px-4 py-4 md:px-8 lg:flex-row lg:items-center lg:gap-5">
        <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:gap-5">
          <button
            className="shrink-0 rounded-lg px-1 py-2 text-left text-lg font-bold uppercase tracking-normal text-text-primary transition duration-150 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary-soft"
            onClick={() => onSelectPage("records")}
            type="button"
          >
            SWEETPET
          </button>

          <nav className="min-w-0 flex-1" aria-label="주요 내비게이션">
            <div className="flex min-w-0 flex-wrap gap-2 lg:flex-nowrap">
              {visibleNavItems.map((page) => (
                <button
                  className={`whitespace-nowrap border-b-2 px-1 py-2 text-sm font-semibold transition duration-150 hover:border-primary hover:text-primary active:scale-[0.99] ${
                    activePage === page ? "border-primary text-primary" : "border-transparent text-text-secondary"
                  }`}
                  key={page}
                  onClick={() => onSelectPage(page)}
                  type="button"
                >
                  {pageLabels[page]}
                </button>
              ))}
            </div>
          </nav>
        </div>

        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full min-w-0 justify-center px-3 py-2 hover:border-primary hover:bg-primary-soft hover:text-primary sm:w-40" disabled={pets.length === 0}>
                <span className="min-w-0 truncate">{selectedPet?.name ?? "마이펫 선택"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[200px]">
              <DropdownMenuLabel>마이펫 선택</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {pets.map((pet) => (
                <DropdownMenuItem disabled={pet.id === selectedPetId} key={pet.id} onSelect={() => onSelectPet(pet.id)}>
                  {pet.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="grid grid-cols-2 rounded-lg border border-border bg-surface p-1" aria-label="앱 전환">
            <button
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition duration-150 hover:bg-primary-soft hover:text-primary active:scale-[0.99] ${
                activeSection === "user" ? "bg-primary-soft text-primary" : "text-text-secondary"
              }`}
              onClick={() => onSelectPage("records")}
              type="button"
            >
              사용자
            </button>
            <button
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition duration-150 hover:bg-primary-soft hover:text-primary active:scale-[0.99] ${
                activeSection === "admin" ? "bg-primary-soft text-primary" : "text-text-secondary"
              }`}
              onClick={() => onSelectPage("admin-orders")}
              type="button"
            >
              관리자
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
