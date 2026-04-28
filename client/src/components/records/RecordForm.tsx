import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { recordFormSchema } from "../../lib/formSchemas";
import type { RecordFormState } from "../../types";
import { SectionTitle } from "../SectionTitle";
import { fieldClass, labelClass, panelClass, primaryButtonClass } from "../ui";
import { DatePicker } from "../ui/date-picker";

type RecordFormProps = {
  selectedPetId: number | null;
  onSubmit: (form: RecordFormState) => Promise<void>;
};

const initialRecordForm: RecordFormState = {
  recordDate: "2026-04-27",
  weight: "",
  condition: "좋음",
  memo: "",
  tags: "",
  photo: null
};

export function RecordForm({ selectedPetId, onSubmit }: RecordFormProps) {
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
    watch
  } = useForm<RecordFormState>({
    defaultValues: initialRecordForm,
    resolver: zodResolver(recordFormSchema)
  });
  const selectedPhoto = watch("photo");

  function handleClearPhoto() {
    setValue("photo", null, { shouldDirty: true });
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  async function submitForm(form: RecordFormState) {
    await onSubmit(form);
    if (photoInputRef.current) photoInputRef.current.value = "";
    reset({ ...initialRecordForm, recordDate: form.recordDate, condition: form.condition });
  }

  return (
    <div className={panelClass}>
      <SectionTitle title="일상기록 작성" />
      <form onSubmit={handleSubmit(submitForm)} className="grid gap-3">
        <div className={labelClass}>
          <span>날짜</span>
          <Controller control={control} name="recordDate" render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} />} />
          {errors.recordDate && <span className="text-xs font-medium text-primary">{errors.recordDate.message}</span>}
        </div>
        <div className={labelClass}>
          <label htmlFor="record-weight">몸무게</label>
          <input className={fieldClass} id="record-weight" inputMode="decimal" placeholder="4.5" {...register("weight")} />
          {errors.weight && <span className="text-xs font-medium text-primary">{errors.weight.message}</span>}
        </div>
        <div className={labelClass}>
          <label htmlFor="record-condition">컨디션</label>
          <select className={fieldClass} id="record-condition" {...register("condition")}>
            <option value="아주 좋음">아주 좋음</option>
            <option value="좋음">좋음</option>
            <option value="보통">보통</option>
            <option value="피곤함">피곤함</option>
          </select>
          {errors.condition && <span className="text-xs font-medium text-primary">{errors.condition.message}</span>}
        </div>
        <div className={labelClass}>
          <label htmlFor="record-memo">메모</label>
          <textarea className={`${fieldClass} min-h-28 resize-none`} id="record-memo" placeholder="오늘 있었던 일을 적어주세요." {...register("memo")} />
          {errors.memo && <span className="text-xs font-medium text-primary">{errors.memo.message}</span>}
        </div>
        <div className={labelClass}>
          <label htmlFor="record-tags">태그</label>
          <input className={fieldClass} id="record-tags" placeholder="산책, 미용" {...register("tags")} />
        </div>
        <div className={labelClass}>
          <span>사진</span>
          <div className="flex min-w-0 flex-wrap items-center gap-2 rounded-xl border border-border bg-surface p-2">
            <label className="inline-flex min-h-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary transition duration-150 hover:border-primary hover:bg-primary-soft active:scale-[0.99]">
              사진 선택
              <input
                accept="image/*"
                className="sr-only"
                ref={photoInputRef}
                onChange={(event) => setValue("photo", event.target.files?.[0] ?? null)}
                type="file"
              />
            </label>
            <span className="min-w-0 flex-1 truncate text-sm text-text-secondary">
              {selectedPhoto ? selectedPhoto.name : "선택된 사진이 없습니다."}
            </span>
            {selectedPhoto ? (
              <button
                aria-label="선택한 사진 제거"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-secondary transition duration-150 hover:bg-primary-soft hover:text-primary active:scale-[0.99]"
                onClick={handleClearPhoto}
                type="button"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>
        <button className={primaryButtonClass} disabled={!selectedPetId || isSubmitting} type="submit">일상기록 추가</button>
      </form>
    </div>
  );
}
