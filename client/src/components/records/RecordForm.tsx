import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { RecordFormState } from "../../types";
import { SectionTitle } from "../SectionTitle";
import { fieldClass, labelClass, panelClass, primaryButtonClass } from "../ui";
import { DatePicker } from "../ui/date-picker";

type RecordFormProps = {
  form: RecordFormState;
  setForm: Dispatch<SetStateAction<RecordFormState>>;
  selectedPetId: number | null;
  onSubmit: (event: FormEvent) => void;
};

export function RecordForm({ form, setForm, selectedPetId, onSubmit }: RecordFormProps) {
  return (
    <div className={panelClass}>
      <SectionTitle title="기록 작성" />
      <form onSubmit={onSubmit} className="grid gap-3">
        <label className={labelClass}>
          날짜
          <DatePicker value={form.recordDate} onChange={(recordDate) => setForm({ ...form, recordDate })} />
        </label>
        <label className={labelClass}>
          몸무게
          <input className={fieldClass} inputMode="decimal" placeholder="4.5" value={form.weight} onChange={(event) => setForm({ ...form, weight: event.target.value })} />
        </label>
        <label className={labelClass}>
          컨디션
          <select className={fieldClass} value={form.condition} onChange={(event) => setForm({ ...form, condition: event.target.value })}>
            <option value="아주 좋음">아주 좋음</option>
            <option value="좋음">좋음</option>
            <option value="보통">보통</option>
            <option value="피곤함">피곤함</option>
          </select>
        </label>
        <label className={labelClass}>
          메모
          <textarea className={`${fieldClass} min-h-28 resize-y`} required placeholder="오늘 있었던 일을 적어주세요." value={form.memo} onChange={(event) => setForm({ ...form, memo: event.target.value })} />
        </label>
        <label className={labelClass}>
          태그
          <input className={fieldClass} placeholder="산책, 미용" value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} />
        </label>
        <button className={primaryButtonClass} disabled={!selectedPetId} type="submit">기록 추가</button>
      </form>
    </div>
  );
}
