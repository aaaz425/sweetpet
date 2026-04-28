import { Trash2, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { petImageUrl } from "../../lib/mockImages";
import type { Pet } from "../../types";
import { SectionTitle } from "../SectionTitle";
import { panelClass, primaryButtonClass, secondaryButtonClass } from "../ui";

type PetListProps = {
  pets: Pet[];
  headerAction?: ReactNode;
  onDeletePet?: (id: number) => Promise<void>;
};

export function PetList({ pets, headerAction, onDeletePet }: PetListProps) {
  const [deleteTargetPet, setDeleteTargetPet] = useState<Pet | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDeletePet() {
    if (!deleteTargetPet || !onDeletePet) return;

    setIsDeleting(true);
    try {
      await onDeletePet(deleteTargetPet.id);
      setDeleteTargetPet(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className={panelClass}>
      {headerAction ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="text-lg font-bold text-text-primary">등록된 마이펫</h2>
            <span className="text-sm font-medium text-text-secondary">{pets.length}마리</span>
          </div>
          {headerAction}
        </div>
      ) : (
        <SectionTitle title="등록된 마이펫" meta={`${pets.length}마리`} />
      )}
      <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet) => (
          <article
            className="grid w-full min-w-0 gap-1 rounded-xl border border-border bg-surface p-3 text-left transition duration-150 hover:border-primary hover:bg-primary-soft/30"
            key={pet.id}
          >
            <img
              alt={`${pet.name} 대표 사진`}
              className="mb-2 aspect-[5/3] w-full rounded-lg border border-border object-cover"
              src={petImageUrl(pet)}
            />
            <strong className="text-base text-text-primary">{pet.name}</strong>
            <span className="text-sm text-text-secondary">{pet.breed || pet.species}</span>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-text-secondary">{pet.memo || "등록된 메모가 없습니다."}</p>
            {onDeletePet ? (
              <button
                aria-label={`${pet.name} 삭제`}
                className={`${secondaryButtonClass} mt-2 inline-flex min-h-9 items-center justify-center gap-1.5 px-3 py-1.5 text-xs`}
                onClick={() => setDeleteTargetPet(pet)}
                type="button"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                삭제
              </button>
            ) : null}
          </article>
        ))}
      </div>
      {deleteTargetPet ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-text-primary/35 px-4 py-6"
          onClick={() => {
            if (!isDeleting) setDeleteTargetPet(null);
          }}
        >
          <div
            className="grid w-full max-w-[420px] gap-4 rounded-xl border border-border bg-background p-4 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="grid min-w-0 gap-1">
                <h2 className="break-words text-lg font-bold text-text-primary">마이펫 삭제</h2>
                <p className="text-sm leading-6 text-text-secondary">
                  {deleteTargetPet.name}을(를) 삭제하면 연결된 일상기록과 주문도 함께 삭제됩니다.
                </p>
              </div>
              <button
                aria-label="닫기"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-secondary transition duration-150 hover:bg-primary-soft hover:text-primary active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isDeleting}
                onClick={() => setDeleteTargetPet(null)}
                type="button"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button
                className={secondaryButtonClass}
                disabled={isDeleting}
                onClick={() => setDeleteTargetPet(null)}
                type="button"
              >
                취소
              </button>
              <button
                className={`${primaryButtonClass} inline-flex items-center justify-center gap-2`}
                disabled={isDeleting}
                onClick={handleConfirmDeletePet}
                type="button"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                {isDeleting ? "삭제 중" : "삭제"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
