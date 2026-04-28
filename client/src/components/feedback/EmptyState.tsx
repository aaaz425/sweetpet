type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="grid min-h-36 place-items-center rounded-2xl border border-dashed border-border-strong bg-surface/70 px-4 py-7 text-center">
      <div className="grid max-w-sm gap-1.5">
        <strong className="text-base text-text-primary">{title}</strong>
        <p className="text-sm leading-6 text-text-secondary">{description}</p>
      </div>
    </div>
  );
}
