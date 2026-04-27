import { SectionTitle } from "../components/SectionTitle";
import { badgeClass, panelClass } from "../components/ui";
import type { OrderExport } from "../types";

type ExportPageProps = {
  exportJson: string;
};

export function ExportPage({ exportJson }: ExportPageProps) {
  const exportData = parseExport(exportJson);

  return (
    <section className={panelClass}>
      <SectionTitle title="주문 데이터" meta="JSON" />
      {exportJson ? (
        <div className="grid min-w-0 gap-4">
          {exportData && (
            <div className="grid min-w-0 gap-3 rounded-xl border border-border bg-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="grid min-w-0 gap-1">
                  <strong className="text-base text-text-primary">{exportData.order.title}</strong>
                  <span className="text-sm text-text-secondary">
                    {exportData.service} · v{exportData.exportVersion} · {exportData.generatedAt}
                  </span>
                </div>
                <span className={badgeClass}>{exportData.order.status}</span>
              </div>
              <div className="grid gap-2 text-sm text-text-secondary sm:grid-cols-2">
                <span>주문: {exportData.order.orderUid ?? `#${exportData.order.id}`}</span>
                <span>도서: {exportData.book?.bookUid ?? "없음"}</span>
                <span>반려동물: {exportData.pet?.name ?? `#${exportData.order.petId}`}</span>
                <span>선택 기록: {exportData.selectedRecords.length}개</span>
                <span>기간: {exportData.order.startDate} - {exportData.order.endDate}</span>
                <span>인쇄 옵션: {Object.keys(exportData.printOptions).length}개</span>
              </div>
            </div>
          )}
          <pre className="min-h-[420px] whitespace-pre-wrap break-words rounded-xl border border-border bg-background p-4 text-sm leading-6 text-text-primary">{exportJson}</pre>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-background p-6">
          <strong className="text-base text-text-primary">아직 내보낸 주문이 없습니다.</strong>
          <p className="mt-2 text-sm leading-6 text-text-secondary">주문 화면에서 JSON 보기를 선택하면 이곳에서 구조화된 주문 데이터를 확인할 수 있습니다.</p>
        </div>
      )}
    </section>
  );
}

function parseExport(exportJson: string): OrderExport | null {
  if (!exportJson) return null;

  try {
    return JSON.parse(exportJson) as OrderExport;
  } catch {
    return null;
  }
}
