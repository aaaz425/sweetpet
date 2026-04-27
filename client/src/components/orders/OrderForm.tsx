import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { orderFormSchema } from "../../lib/formSchemas";
import type { OrderFormState } from "../../types";
import { SectionTitle } from "../SectionTitle";
import { fieldClass, labelClass, panelClass, primaryButtonClass } from "../ui";
import { DatePicker } from "../ui/date-picker";

type OrderFormProps = {
  selectedPetId: number | null;
  onSubmit: (form: OrderFormState) => Promise<void>;
};

const initialOrderForm: OrderFormState = {
  title: "몽이의 4월 앨범",
  startDate: "2026-04-01",
  endDate: "2026-04-30"
};

export function OrderForm({ selectedPetId, onSubmit }: OrderFormProps) {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register
  } = useForm<OrderFormState>({
    defaultValues: initialOrderForm,
    resolver: zodResolver(orderFormSchema)
  });

  return (
    <div className={panelClass}>
      <SectionTitle title="주문하기" meta="기간 기준" />
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
        <label className={labelClass}>
          제목
          <input className={fieldClass} {...register("title")} />
          {errors.title && <span className="text-xs font-medium text-primary">{errors.title.message}</span>}
        </label>
        <label className={labelClass}>
          시작일
          <Controller control={control} name="startDate" render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} />} />
          {errors.startDate && <span className="text-xs font-medium text-primary">{errors.startDate.message}</span>}
        </label>
        <label className={labelClass}>
          종료일
          <Controller control={control} name="endDate" render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} />} />
          {errors.endDate && <span className="text-xs font-medium text-primary">{errors.endDate.message}</span>}
        </label>
        <button className={primaryButtonClass} disabled={!selectedPetId || isSubmitting} type="submit">주문하기</button>
      </form>
    </div>
  );
}
