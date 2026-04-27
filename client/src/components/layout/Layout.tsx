import type { ReactNode } from "react";
import type { Page, Pet } from "../../types";
import { Footer } from "./Footer";
import { GlobalHeader } from "./GlobalHeader";
import { PageHeader } from "./PageHeader";

type LayoutProps = {
  activePage: Page;
  pets: Pet[];
  selectedPet?: Pet;
  selectedPetId: number | null;
  recordCount: number;
  orderCount: number;
  onSelectPage: (page: Page) => void;
  onSelectPet: (petId: number) => void;
  children: ReactNode;
};

export function Layout({
  activePage,
  pets,
  selectedPet,
  selectedPetId,
  recordCount,
  orderCount,
  onSelectPage,
  onSelectPet,
  children
}: LayoutProps) {
  return (
    <div className="flex h-dvh min-w-0 flex-col overflow-hidden bg-background text-text-primary">
      <GlobalHeader
        activePage={activePage}
        pets={pets}
        selectedPetId={selectedPetId}
        onSelectPage={onSelectPage}
        onSelectPet={onSelectPet}
      />
      <main className="min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto flex min-h-full w-full max-w-[1120px] min-w-0 flex-col px-4 py-6 md:px-8 md:py-8">
          <PageHeader activePage={activePage} selectedPet={selectedPet} recordCount={recordCount} orderCount={orderCount} />
          <div className="min-w-0 flex-1">{children}</div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
