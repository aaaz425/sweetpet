import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { PetFormState } from "../../types";
import { SectionTitle } from "../SectionTitle";
import { fieldClass, labelClass, panelClass, primaryButtonClass } from "../ui";
import { DatePicker } from "../ui/date-picker";

type PetFormProps = {
  form: PetFormState;
  setForm: Dispatch<SetStateAction<PetFormState>>;
  onSubmit: (event: FormEvent) => void;
};

export function PetForm({ form, setForm, onSubmit }: PetFormProps) {
  return (
    <div className={panelClass}>
      <SectionTitle title="새 마이펫" />
      <form className="grid gap-3" onSubmit={onSubmit}>
        <label className={labelClass}>
          이름
          <input className={fieldClass} required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </label>
        <label className={labelClass}>
          종류
          <input className={fieldClass} value={form.species} onChange={(event) => setForm({ ...form, species: event.target.value })} />
        </label>
        <label className={labelClass}>
          품종
          <input className={fieldClass} value={form.breed} onChange={(event) => setForm({ ...form, breed: event.target.value })} />
        </label>
        <label className={labelClass}>
          생일
          <DatePicker value={form.birthday} onChange={(birthday) => setForm({ ...form, birthday })} />
        </label>
        <label className={labelClass}>
          메모
          <textarea className={`${fieldClass} min-h-28 resize-y`} value={form.memo} onChange={(event) => setForm({ ...form, memo: event.target.value })} />
        </label>
        <label className={labelClass}>
          대표 사진
          <input
            accept="image/*"
            className={fieldClass}
            onChange={(event) => setForm({ ...form, photo: event.target.files?.[0] ?? null })}
            type="file"
          />
        </label>
        <button className={primaryButtonClass} type="submit">등록</button>
      </form>
    </div>
  );
}
