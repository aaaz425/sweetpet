import type { ReactNode } from "react";
import type { Page, Pet } from "../../types";
import { Footer } from "./Footer";
import { PageHeader } from "./PageHeader";
import { Sidebar } from "./Sidebar";

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
    <div className="min-h-screen bg-background text-text-primary md:grid md:grid-cols-[240px_minmax(0,1fr)]">
      <Sidebar
        activePage={activePage}
        pets={pets}
        selectedPetId={selectedPetId}
        onSelectPage={onSelectPage}
        onSelectPet={onSelectPet}
      />
      <main className="mx-auto flex min-h-screen w-full max-w-[1120px] flex-col px-4 py-6 md:px-8 md:py-8">
        <PageHeader activePage={activePage} selectedPet={selectedPet} recordCount={recordCount} orderCount={orderCount} />
        <div className="flex-1">{children}</div>
        <Footer />
      </main>
    </div>
  );
}
