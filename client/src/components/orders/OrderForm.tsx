import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { OrderFormState } from "../../types";
import { SectionTitle } from "../SectionTitle";
import { fieldClass, labelClass, panelClass, primaryButtonClass } from "../ui";
import { DatePicker } from "../ui/date-picker";

type OrderFormProps = {
  form: OrderFormState;
  selectedPetId: number | null;
  setForm: Dispatch<SetStateAction<OrderFormState>>;
  onSubmit: (event: FormEvent) => void;
};

export function OrderForm({ form, selectedPetId, setForm, onSubmit }: OrderFormProps) {
  return (
    <div className={panelClass}>
      <SectionTitle title="주문하기" meta="기간 기준" />
      <form onSubmit={onSubmit} className="grid gap-3">
        <label className={labelClass}>
          제목
          <input className={fieldClass} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        </label>
        <label className={labelClass}>
          시작일
          <DatePicker value={form.startDate} onChange={(startDate) => setForm({ ...form, startDate })} />
        </label>
        <label className={labelClass}>
          종료일
          <DatePicker value={form.endDate} onChange={(endDate) => setForm({ ...form, endDate })} />
        </label>
        <button className={primaryButtonClass} disabled={!selectedPetId} type="submit">주문하기</button>
      </form>
    </div>
  );
}
