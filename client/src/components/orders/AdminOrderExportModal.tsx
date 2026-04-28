import { Check, Copy, X } from "lucide-react";

type AdminOrderExportModalProps = {
  exportJson: string;
  isCopied: boolean;
  meta: string;
  title: string;
  onClose: () => void;
  onCopy: () => void;
};

export function AdminOrderExportModal({
  exportJson,
  isCopied,
  meta,
  title,
  onClose,
  onCopy
}: AdminOrderExportModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-text-primary/35 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="grid max-h-full w-full max-w-[760px] min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-3 overflow-hidden rounded-xl border border-border bg-surface p-4 shadow-[0_18px_44px_rgba(31,41,51,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="grid min-w-0 gap-1">
            <h2 className="truncate text-lg font-bold text-text-primary">{title}</h2>
            <p className="truncate text-sm text-text-secondary">{meta} JSON</p>
          </div>
          <div className="flex shrink-0 gap-1">
            <button
              aria-label="JSON 복사"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition duration-150 hover:border-primary hover:bg-primary-soft hover:text-primary active:scale-[0.99]"
              onClick={onCopy}
              type="button"
            >
              {isCopied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            </button>
            <button
              aria-label="닫기"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition duration-150 hover:border-primary hover:bg-primary-soft hover:text-primary active:scale-[0.99]"
              onClick={onClose}
              type="button"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <pre className="min-h-[360px] overflow-auto rounded-xl border border-border bg-surface p-4 text-sm leading-6 text-text-primary">{exportJson}</pre>
      </div>
    </div>
  );
}
