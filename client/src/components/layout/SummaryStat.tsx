type SummaryStatProps = {
  label: string;
  value: number;
};

export function SummaryStat({ label, value }: SummaryStatProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <strong className="block text-xl font-bold text-text-primary">{value}</strong>
      <span className="text-xs font-medium text-text-secondary">{label}</span>
    </div>
  );
}
