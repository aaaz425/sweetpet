import { pageLabels, pageSummaries } from "../../constants";
import type { Page, Pet } from "../../types";
import { SummaryStat } from "./SummaryStat";

type PageHeaderProps = {
  activePage: Page;
  selectedPet?: Pet;
  recordCount: number;
  orderCount: number;
};

export function PageHeader({ activePage, selectedPet, recordCount, orderCount }: PageHeaderProps) {
  return (
    <header className="mb-6 grid min-w-0 gap-4 border-b border-border pb-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-secondary">{selectedPet ? selectedPet.name : "반려동물 선택 필요"}</p>
        <h1 className="mt-1 text-3xl font-bold leading-tight text-text-primary">{pageLabels[activePage]}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">{pageSummaries[activePage]}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:min-w-44">
        <SummaryStat label="기록" value={recordCount} />
        <SummaryStat label="주문" value={orderCount} />
      </div>
    </header>
  );
}
