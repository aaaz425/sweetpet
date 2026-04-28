import { adminNavItems, pageLabels, userNavItems } from "../../constants";
import type { Page } from "../../types";
import { SectionToggle } from "./SectionToggle";

type GlobalHeaderProps = {
  activePage: Page | null;
  onSelectPage: (page: Page) => void;
};

export function GlobalHeader({ activePage, onSelectPage }: GlobalHeaderProps) {
  const activeSection = activePage === "admin-orders" || activePage === "export" ? "admin" : "user";
  const visibleNavItems = activeSection === "admin" ? adminNavItems : userNavItems;

  function handleLogoClick() {
    if (activeSection === "user") {
      onSelectPage("records");
    }
  }

  return (
    <header className="z-40 flex-none border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-[1120px] min-w-0 flex-col gap-3 px-4 py-4 md:px-8 lg:flex-row lg:items-center lg:gap-5">
        <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:gap-5">
          <button
            className="shrink-0 cursor-pointer rounded-lg px-1 py-2 text-left text-lg font-bold uppercase tracking-normal text-text-primary transition duration-150 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary-soft"
            onClick={(event) => {
              handleLogoClick();
              event.currentTarget.blur();
            }}
            type="button"
          >
            SWEETPET
          </button>

          <nav className="min-w-0 flex-1" aria-label="주요 내비게이션">
            <div className="flex min-w-0 flex-wrap gap-2 lg:flex-nowrap">
              {visibleNavItems.map((page) => (
                <button
                  className={`cursor-pointer whitespace-nowrap border-b-2 px-1 py-2 text-sm font-semibold transition duration-150 hover:border-primary hover:text-primary active:scale-[0.99] ${
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
          <SectionToggle activeSection={activeSection} onSelectSection={(page) => onSelectPage(page)} />
        </div>
      </div>
    </header>
  );
}
