import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { defaultPrintOptions, printOptionChoices } from "../../constants";
import { orderFormSchema } from "../../lib/formSchemas";
import type { OrderFormState, PrintOptions, RecordItem } from "../../types";
import { fieldClass, labelClass, primaryButtonClass } from "../ui";
import { DatePicker } from "../ui/date-picker";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type OrderFormProps = {
  selectedPetId: number | null;
  records: RecordItem[];
  initialValues?: OrderFormState;
  submitLabel?: string;
  onSubmit: (form: OrderFormState) => Promise<void>;
};

type SelectPrintOptionKey = Exclude<keyof PrintOptions, "quantity">;

const printOptionFields: Array<{ name: SelectPrintOptionKey; label: string }> = [
  { name: "size", label: "판형" },
  { name: "binding", label: "제본" },
  { name: "paper", label: "용지" }
];
const minOrderRecordCount = 5;
const maxOrderRecordCount = 30;

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

function countSelectedRecords(records: RecordItem[], selectedPetId: number | null, startDate: string, endDate: string) {
  if (selectedPetId === null || !startDate || !endDate || startDate > endDate) return 0;

  return records.filter(
    (record) =>
      record.petId === selectedPetId &&
      record.recordDate >= startDate &&
      record.recordDate <= endDate
  ).length;
}

function getRecordCountMessage(recordCount: number, selectedPetId: number | null) {
  if (selectedPetId === null) return "주문할 반려동물을 선택하면 기간 내 기록 수를 확인할 수 있습니다.";
  if (recordCount < minOrderRecordCount) return `기록이 ${minOrderRecordCount - recordCount}개 더 필요합니다.`;
  if (recordCount > maxOrderRecordCount) return `기록을 ${recordCount - maxOrderRecordCount}개 줄여야 합니다.`;
  return "주문 가능한 기록 수입니다.";
}

export function OrderForm({ selectedPetId, records, initialValues, submitLabel = "주문하기", onSubmit }: OrderFormProps) {
  const initialOrderForm = useMemo(() => initialValues ?? getInitialOrderForm(), [initialValues]);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    watch
  } = useForm<OrderFormState>({
    defaultValues: initialOrderForm,
    resolver: zodResolver(orderFormSchema)
  });

  useEffect(() => {
    reset(initialOrderForm);
  }, [initialOrderForm, reset]);
  const title = watch("title");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const selectedRecordCount = countSelectedRecords(records, selectedPetId, startDate, endDate);
  const hasValidRecordCount =
    selectedRecordCount >= minOrderRecordCount && selectedRecordCount <= maxOrderRecordCount;
  const recordCountRuleText = `기간 내 일상기록이 ${minOrderRecordCount}개 이상 ${maxOrderRecordCount}개 이하일 때만 주문할 수 있습니다.`;
  const recordCountStatusText = getRecordCountMessage(selectedRecordCount, selectedPetId);

  async function submitOrderForm(form: OrderFormState) {
    if (!selectedPetId) {
      toast.error("주문할 반려동물을 선택해주세요.");
      return;
    }

    if (!hasValidRecordCount) {
      toast.error(recordCountRuleText);
      return;
    }

    await onSubmit(form);
  }

  function handleInvalidSubmit() {
    toast.error("입력 내용을 확인해주세요.");
  }

  return (
    <form onSubmit={handleSubmit(submitOrderForm, handleInvalidSubmit)} className="grid gap-3">
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
      <div className="grid gap-1.5">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-sm font-medium text-text-secondary">
          <span>선택 기간 내 일상기록</span>
          <TooltipProvider delayDuration={120}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  aria-label={`${recordCountRuleText} ${recordCountStatusText}`}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-primary outline-none transition duration-150 hover:bg-primary-soft focus:bg-primary-soft focus:ring-2 focus:ring-primary-soft"
                  type="button"
                >
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{recordCountRuleText}</p>
                <p>{recordCountStatusText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <strong className="text-sm font-bold text-text-primary">{selectedRecordCount}개</strong>
        </div>
      </div>
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
      <button className={primaryButtonClass} disabled={isSubmitting} type="submit">{submitLabel}</button>
    </form>
  );
}
