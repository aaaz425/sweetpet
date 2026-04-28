type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="grid min-h-40 place-items-center rounded-xl border border-dashed border-border bg-background px-4 py-8 text-center">
      <div className="grid max-w-sm gap-2">
        <strong className="text-base text-text-primary">{title}</strong>
        <p className="text-sm leading-6 text-text-secondary">{description}</p>
      </div>
    </div>
  );
}
