type SectionTitleProps = {
  title: string;
  meta?: string;
};

export function SectionTitle({ title, meta }: SectionTitleProps) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="text-xl font-bold text-text-primary">{title}</h2>
      {meta ? <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-text-secondary">{meta}</span> : null}
    </div>
  );
}
