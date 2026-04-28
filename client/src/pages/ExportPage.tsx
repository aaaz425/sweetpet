import { SectionTitle } from "../components/SectionTitle";
import { badgeClass, cardSurfaceClass, panelClass } from "../components/ui";
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
        <div className="grid min-w-0 gap-5">
          {exportData && (
            <div className={`grid min-w-0 gap-3.5 p-4 md:p-5 ${cardSurfaceClass}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="grid min-w-0 gap-1">
                  <strong className="text-base text-text-primary">{exportData.order.title}</strong>
                  <span className="text-sm text-text-secondary">
                    {exportData.service} · v{exportData.exportVersion} · {exportData.generatedAt}
                  </span>
                </div>
                <span className={badgeClass}>{exportData.order.status}</span>
              </div>
              <div className="grid gap-x-4 gap-y-2 text-sm leading-6 text-text-secondary sm:grid-cols-2">
                <span>주문: {exportData.order.orderUid ?? `#${exportData.order.id}`}</span>
                <span>도서: {exportData.book?.bookUid ?? "없음"}</span>
                <span>마이펫: {exportData.pet?.name ?? `#${exportData.order.petId}`}</span>
                <span>선택한 일상기록: {exportData.selectedRecords.length}개</span>
                <span>기간: {exportData.order.startDate} - {exportData.order.endDate}</span>
                <span>인쇄 옵션: {Object.keys(exportData.printOptions).length}개</span>
              </div>
            </div>
          )}
          <pre className={`min-h-[420px] whitespace-pre-wrap break-words p-4 text-sm leading-6 text-text-primary md:p-5 ${cardSurfaceClass}`}>{exportJson}</pre>
        </div>
      ) : (
        <div className={`p-6 ${cardSurfaceClass}`}>
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
