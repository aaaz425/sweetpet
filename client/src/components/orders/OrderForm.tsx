import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { defaultPrintOptions, printOptionChoices } from "../../constants";
import { orderFormSchema } from "../../lib/formSchemas";
import type { OrderFormState, PrintOptions } from "../../types";
import { fieldClass, labelClass, primaryButtonClass } from "../ui";
import { DatePicker } from "../ui/date-picker";

type OrderFormProps = {
  selectedPetId: number | null;
  onSubmit: (form: OrderFormState) => Promise<void>;
};

type SelectPrintOptionKey = Exclude<keyof PrintOptions, "quantity">;

const printOptionFields: Array<{ name: SelectPrintOptionKey; label: string }> = [
  { name: "size", label: "판형" },
  { name: "binding", label: "제본" },
  { name: "paper", label: "용지" }
];

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getInitialOrderForm(): OrderFormState {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 30);

  return {
    title: "",
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    printOptions: defaultPrintOptions
  };
}

export function OrderForm({ selectedPetId, onSubmit }: OrderFormProps) {
  const initialOrderForm = useMemo(() => getInitialOrderForm(), []);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    watch
  } = useForm<OrderFormState>({
    defaultValues: initialOrderForm,
    resolver: zodResolver(orderFormSchema)
  });
  const title = watch("title");
  const missingRequiredFields = [
    !selectedPetId ? "반려동물" : null,
    !title.trim() ? "제목" : null
  ].filter(Boolean);
  const isOrderDisabled = missingRequiredFields.length > 0 || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <label className={labelClass}>
        제목
        <input className={fieldClass} placeholder="제목을 입력하세요" {...register("title")} />
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
      <fieldset className="grid gap-2 rounded-xl border border-border bg-background p-3">
        <legend className="px-1 text-sm font-semibold text-text-primary">프린트 옵션</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {printOptionFields.map((field) => (
            <label className={labelClass} key={field.name}>
              {field.label}
              <select className={fieldClass} {...register(`printOptions.${field.name}`)}>
                {printOptionChoices[field.name].map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <label className={labelClass}>
          주문 수량
          <input className={fieldClass} min={1} max={20} type="number" {...register("printOptions.quantity", { valueAsNumber: true })} />
          {errors.printOptions?.quantity && <span className="text-xs font-medium text-primary">{errors.printOptions.quantity.message}</span>}
        </label>
      </fieldset>
      <button className={primaryButtonClass} disabled={isOrderDisabled} type="submit">주문하기</button>
    </form>
  );
}
