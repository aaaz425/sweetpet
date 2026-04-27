import { zodResolver } from "@hookform/resolvers/zod";
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
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue
  } = useForm<RecordFormState>({
    defaultValues: initialRecordForm,
    resolver: zodResolver(recordFormSchema)
  });

  async function submitForm(form: RecordFormState) {
    await onSubmit(form);
    reset({ ...initialRecordForm, recordDate: form.recordDate, condition: form.condition });
  }

  return (
    <div className={panelClass}>
      <SectionTitle title="일상기록 작성" />
      <form onSubmit={handleSubmit(submitForm)} className="grid gap-3">
        <label className={labelClass}>
          날짜
          <Controller control={control} name="recordDate" render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} />} />
          {errors.recordDate && <span className="text-xs font-medium text-primary">{errors.recordDate.message}</span>}
        </label>
        <label className={labelClass}>
          몸무게
          <input className={fieldClass} inputMode="decimal" placeholder="4.5" {...register("weight")} />
          {errors.weight && <span className="text-xs font-medium text-primary">{errors.weight.message}</span>}
        </label>
        <label className={labelClass}>
          컨디션
          <select className={fieldClass} {...register("condition")}>
            <option value="아주 좋음">아주 좋음</option>
            <option value="좋음">좋음</option>
            <option value="보통">보통</option>
            <option value="피곤함">피곤함</option>
          </select>
          {errors.condition && <span className="text-xs font-medium text-primary">{errors.condition.message}</span>}
        </label>
        <label className={labelClass}>
          메모
          <textarea className={`${fieldClass} min-h-28 resize-y`} placeholder="오늘 있었던 일을 적어주세요." {...register("memo")} />
          {errors.memo && <span className="text-xs font-medium text-primary">{errors.memo.message}</span>}
        </label>
        <label className={labelClass}>
          태그
          <input className={fieldClass} placeholder="산책, 미용" {...register("tags")} />
        </label>
        <label className={labelClass}>
          사진
          <input
            accept="image/*"
            className={fieldClass}
            onChange={(event) => setValue("photo", event.target.files?.[0] ?? null)}
            type="file"
          />
        </label>
        <button className={primaryButtonClass} disabled={!selectedPetId || isSubmitting} type="submit">일상기록 추가</button>
      </form>
    </div>
  );
}
