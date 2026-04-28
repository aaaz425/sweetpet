import { SectionTitle } from "../components/SectionTitle";
import { badgeClass, cardSurfaceClass, panelClass } from "../components/ui";
import type { OrderExport } from "../types";

type ExportPageProps = {
  exportJson: string;
};

export function ExportPage({ exportJson }: ExportPageProps) {
  const exportData = parseExport(exportJson);
  const exportSummary = getExportSummary(exportData);

  return (
    <section className={panelClass}>
      <SectionTitle title="내보낸 JSON" meta="결과 보기" />
      {exportJson ? (
        <div className="grid min-w-0 gap-5">
          {exportSummary ? (
            <div className={`grid min-w-0 gap-3.5 p-4 md:p-5 ${cardSurfaceClass}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="grid min-w-0 gap-1">
                  <strong className="text-base text-text-primary">{exportSummary.title}</strong>
                  <span className="text-sm text-text-secondary">
                    {exportSummary.meta}
                  </span>
                </div>
                <span className={badgeClass}>{exportSummary.badge}</span>
              </div>
              <div className="grid gap-x-4 gap-y-2 text-sm leading-6 text-text-secondary sm:grid-cols-2">
                {exportSummary.items.map((item) => (
                  <span key={item.label}>{item.label}: {item.value}</span>
                ))}
              </div>
            </div>
          ) : null}
          <pre className={`min-h-[420px] whitespace-pre-wrap break-words p-4 text-sm leading-6 text-text-primary md:p-5 ${cardSurfaceClass}`}>{exportJson}</pre>
        </div>
      ) : (
        <div className={`p-6 ${cardSurfaceClass}`}>
          <strong className="text-base text-text-primary">아직 표시할 JSON 결과가 없습니다.</strong>
          <p className="mt-2 text-sm leading-6 text-text-secondary">주문 관리에서 JSON 보기를 선택하면 생성된 주문 데이터를 이곳에서 다시 확인할 수 있습니다.</p>
        </div>
      )}
    </section>
  );
}

type BatchOrderExport = {
  service?: string;
  exportVersion?: string;
  generatedAt?: string;
  orderCount?: number;
  orders: OrderExport[];
};

type ExportSummary = {
  title: string;
  meta: string;
  badge: string;
  items: Array<{ label: string; value: string }>;
};

function parseExport(exportJson: string): unknown {
  if (!exportJson) return null;

  try {
    return JSON.parse(exportJson) as unknown;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isOrderExport(value: unknown): value is OrderExport {
  return isRecord(value) && isRecord(value.order) && Array.isArray(value.selectedRecords);
}

function isBatchOrderExport(value: unknown): value is BatchOrderExport {
  return isRecord(value) && Array.isArray(value.orders);
}

function getExportSummary(exportData: unknown): ExportSummary | null {
  if (isOrderExport(exportData)) {
    return {
      title: exportData.order.title,
      meta: `${exportData.service} · v${exportData.exportVersion} · ${exportData.generatedAt}`,
      badge: exportData.order.status,
      items: [
        { label: "주문", value: exportData.order.orderUid ?? `#${exportData.order.id}` },
        { label: "도서", value: exportData.book?.bookUid ?? "없음" },
        { label: "마이펫", value: exportData.pet?.name ?? `#${exportData.order.petId}` },
        { label: "선택한 일상기록", value: `${exportData.selectedRecords.length}개` },
        { label: "기간", value: `${exportData.order.startDate} - ${exportData.order.endDate}` },
        { label: "인쇄 옵션", value: `${Object.keys(exportData.printOptions).length}개` }
      ]
    };
  }

  if (isBatchOrderExport(exportData)) {
    const generatedAt = typeof exportData.generatedAt === "string" ? exportData.generatedAt : "-";
    const service = typeof exportData.service === "string" ? exportData.service : "sweetpet";
    const exportVersion = typeof exportData.exportVersion === "string" ? exportData.exportVersion : "batch";
    const orderCount = typeof exportData.orderCount === "number" ? exportData.orderCount : exportData.orders.length;
    const recordCount = exportData.orders.reduce((total, orderExport) => total + orderExport.selectedRecords.length, 0);

    return {
      title: "선택 주문 JSON",
      meta: `${service} · v${exportVersion} · ${generatedAt}`,
      badge: `${orderCount}건`,
      items: [
        { label: "주문 수", value: `${orderCount}건` },
        { label: "선택한 일상기록", value: `${recordCount}개` },
        { label: "첫 주문", value: exportData.orders[0]?.order.title ?? "-" },
        { label: "생성일", value: generatedAt }
      ]
    };
  }

  return null;
}
