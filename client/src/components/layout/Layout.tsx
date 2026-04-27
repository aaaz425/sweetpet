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
    <div className="flex min-h-screen flex-col bg-background text-text-primary">
      <GlobalHeader
        activePage={activePage}
        pets={pets}
        selectedPetId={selectedPetId}
        onSelectPage={onSelectPage}
        onSelectPet={onSelectPet}
      />
      <main className="mx-auto flex w-full max-w-[1120px] flex-1 flex-col px-4 py-6 md:px-8 md:py-8">
        <PageHeader activePage={activePage} selectedPet={selectedPet} recordCount={recordCount} orderCount={orderCount} />
        <div className="flex-1">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
