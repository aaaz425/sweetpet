import { Ban, Trash2, X } from "lucide-react";
import { primaryButtonClass } from "../ui";

type DeleteConfirmModalProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  loadingLabel?: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  variant?: "delete" | "cancel";
};

export function DeleteConfirmModal({
  title,
  description,
  confirmLabel = "삭제",
  loadingLabel = "삭제 중",
  isDeleting,
  onCancel,
  onConfirm,
  variant = "delete"
}: DeleteConfirmModalProps) {
  const ConfirmIcon = variant === "cancel" ? Ban : Trash2;

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-text-primary/35 px-4 py-6"
      onClick={(event) => {
        event.stopPropagation();
        if (!isDeleting) onCancel();
      }}
    >
      <div
        className="grid w-full max-w-[420px] gap-4 rounded-xl border border-border bg-surface p-4 shadow-[0_18px_44px_rgba(31,41,51,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="grid min-w-0 gap-1">
            <h2 className="break-words text-lg font-bold text-text-primary">{title}</h2>
            <p className="text-sm leading-6 text-text-secondary">{description}</p>
          </div>
          <button
            aria-label="닫기"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-secondary transition duration-150 hover:bg-primary-soft hover:text-primary active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isDeleting}
            onClick={onCancel}
            type="button"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            className={`${primaryButtonClass} inline-flex items-center justify-center gap-2`}
            disabled={isDeleting}
            onClick={onConfirm}
            type="button"
          >
            <ConfirmIcon className="h-4 w-4" aria-hidden="true" />
            {isDeleting ? loadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
