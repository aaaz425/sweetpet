import { SectionTitle } from "../components/SectionTitle";
import { panelClass } from "../components/ui";

type ExportPageProps = {
  exportJson: string;
};

export function ExportPage({ exportJson }: ExportPageProps) {
  return (
    <section className={panelClass}>
      <SectionTitle title="주문 데이터" meta="JSON" />
      {exportJson ? (
        <pre className="min-h-[420px] overflow-auto rounded-xl border border-border bg-background p-4 text-sm leading-6 text-text-primary">{exportJson}</pre>
      ) : (
        <div className="rounded-xl border border-border bg-background p-6">
          <strong className="text-base text-text-primary">아직 내보낸 주문이 없습니다.</strong>
          <p className="mt-2 text-sm leading-6 text-text-secondary">주문 화면에서 JSON 보기를 선택하면 이곳에서 구조화된 주문 데이터를 확인할 수 있습니다.</p>
        </div>
      )}
    </section>
  );
}
