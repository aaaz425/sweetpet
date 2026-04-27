type SectionTitleProps = {
  title: string;
  meta?: string;
};

export function SectionTitle({ title, meta }: SectionTitleProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-lg font-bold text-text-primary">{title}</h2>
      {meta ? <span className="text-sm font-medium text-text-secondary">{meta}</span> : null}
    </div>
  );
}
