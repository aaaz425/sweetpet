import { Pencil, Trash2, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { petImageUrl } from "../../lib/mockImages";
import type { Pet } from "../../types";
import { DeleteConfirmModal } from "../feedback/DeleteConfirmModal";
import { EmptyState } from "../feedback/EmptyState";
import { SectionTitle } from "../SectionTitle";
import { cardSurfaceClass, panelClass } from "../ui";

type PetListProps = {
  pets: Pet[];
  headerAction?: ReactNode;
  onEditPet?: (pet: Pet) => void;
  onDeletePet?: (id: number) => Promise<void>;
};

function formatPetAge(birthday: string | null) {
  if (!birthday) return "생일 미등록";

  const birthDate = new Date(birthday);
  if (Number.isNaN(birthDate.getTime())) return "생일 미등록";

  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  const hasNotReachedDay = today.getDate() < birthDate.getDate();

  if (hasNotReachedDay) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years >= 1) return `${years}살`;
  if (months <= 0) return "1개월 미만";
  return `${months + 1}개월 미만`;
}

export function PetList({ pets, headerAction, onEditPet, onDeletePet }: PetListProps) {
  const [selectedDetailPet, setSelectedDetailPet] = useState<Pet | null>(null);
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

  function handleEditPet(pet: Pet) {
    setSelectedDetailPet(null);
    onEditPet?.(pet);
  }

  function handleDeletePet(pet: Pet) {
    setSelectedDetailPet(null);
    setDeleteTargetPet(pet);
  }

  return (
    <div className={panelClass}>
      {headerAction ? (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="text-lg font-bold text-text-primary">등록된 마이펫</h2>
            <span className="text-sm font-medium text-text-secondary">{pets.length}마리</span>
          </div>
          {headerAction}
        </div>
      ) : (
        <SectionTitle title="등록된 마이펫" meta={`${pets.length}마리`} />
      )}
      {pets.length === 0 ? (
        <EmptyState
          title="등록된 마이펫이 없습니다"
          description="먼저 반려동물을 등록하면 일상기록과 앨범북 주문을 이어서 만들 수 있습니다."
        />
      ) : (
        <div className="grid min-w-0 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <article
              className={`relative grid w-full min-w-0 cursor-pointer gap-1 p-3.5 text-left transition duration-150 hover:border-border-strong hover:bg-surface-muted/45 active:scale-[0.99] ${cardSurfaceClass}`}
              key={pet.id}
              onClick={() => setSelectedDetailPet(pet)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedDetailPet(pet);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <img
                alt={`${pet.name} 대표 사진`}
                className="mb-2.5 aspect-[5/3] w-full rounded-lg border border-border object-cover"
                src={petImageUrl(pet)}
              />
              <div className="flex min-w-0 items-center justify-between gap-2">
                <strong className="min-w-0 truncate text-base text-text-primary">{pet.name}</strong>
                {onEditPet || onDeletePet ? (
                  <div className="flex shrink-0 gap-1">
                    {onEditPet ? (
                      <button
                        aria-label={`${pet.name} 편집`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition duration-150 hover:bg-primary-soft hover:text-primary active:scale-[0.99]"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleEditPet(pet);
                        }}
                        type="button"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    ) : null}
                    {onDeletePet ? (
                      <button
                        aria-label={`${pet.name} 삭제`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition duration-150 hover:bg-primary-soft hover:text-primary active:scale-[0.99]"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeletePet(pet);
                        }}
                        type="button"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <span className="text-sm text-text-secondary">{pet.breed || pet.species}</span>
              <span className="text-xs font-medium text-text-secondary">{formatPetAge(pet.birthday)}</span>
              <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-text-secondary">{pet.memo || "등록된 메모가 없습니다."}</p>
            </article>
          ))}
        </div>
      )}
      {selectedDetailPet ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-text-primary/35 px-4 py-6"
          onClick={() => setSelectedDetailPet(null)}
        >
          <div
            className="grid max-h-full w-full max-w-[640px] gap-4 overflow-y-auto rounded-xl border border-border bg-surface px-6 py-6 shadow-[0_18px_44px_rgba(31,41,51,0.16)] sm:px-8 sm:py-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="grid min-w-0 gap-1">
                <h2 className="break-words text-xl font-bold text-text-primary">{selectedDetailPet.name}</h2>
                <p className="text-sm text-text-secondary">{selectedDetailPet.breed || selectedDetailPet.species}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                {onEditPet ? (
                  <button
                    aria-label={`${selectedDetailPet.name} 편집`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition duration-150 hover:bg-primary-soft hover:text-primary active:scale-[0.99]"
                    onClick={() => handleEditPet(selectedDetailPet)}
                    type="button"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : null}
                {onDeletePet ? (
                  <button
                    aria-label={`${selectedDetailPet.name} 삭제`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition duration-150 hover:bg-primary-soft hover:text-primary active:scale-[0.99]"
                    onClick={() => handleDeletePet(selectedDetailPet)}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : null}
                <button
                  aria-label="닫기"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition duration-150 hover:bg-primary-soft hover:text-primary active:scale-[0.99]"
                  onClick={() => setSelectedDetailPet(null)}
                  type="button"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <img
              alt={`${selectedDetailPet.name} 대표 사진`}
              className="aspect-[16/9] w-full rounded-xl border border-border object-cover"
              src={petImageUrl(selectedDetailPet)}
            />
            <div className="grid gap-2 rounded-xl border border-border bg-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-text-secondary">종류</span>
                <strong className="text-text-primary">{selectedDetailPet.species}</strong>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-text-secondary">품종</span>
                <strong className="text-text-primary">{selectedDetailPet.breed || "미등록"}</strong>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-text-secondary">나이</span>
                <strong className="text-text-primary">{formatPetAge(selectedDetailPet.birthday)}</strong>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-text-secondary">생일</span>
                <strong className="text-text-primary">{selectedDetailPet.birthday || "미등록"}</strong>
              </div>
            </div>
            <section className="rounded-xl border border-border bg-surface p-4">
              <h3 className="text-sm font-semibold text-text-primary">메모</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-text-secondary">
                {selectedDetailPet.memo || "등록된 메모가 없습니다."}
              </p>
            </section>
          </div>
        </div>
      ) : null}
      {deleteTargetPet ? (
        <DeleteConfirmModal
          title="마이펫 삭제"
          description={`${deleteTargetPet.name}을(를) 삭제하면 연결된 일상기록과 주문도 함께 삭제됩니다.`}
          isDeleting={isDeleting}
          onCancel={() => setDeleteTargetPet(null)}
          onConfirm={handleConfirmDeletePet}
        />
      ) : null}
    </div>
  );
}
