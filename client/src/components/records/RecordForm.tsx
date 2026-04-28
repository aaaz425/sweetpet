import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { recordFormSchema } from "../../lib/formSchemas";
import { cn } from "../../lib/utils";
import type { RecordFormState } from "../../types";
import { SectionTitle } from "../SectionTitle";
import { fieldClass, labelClass, panelClass, primaryButtonClass, secondaryButtonClass } from "../ui";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "../ui/command";
import { DatePicker } from "../ui/date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type RecordFormProps = {
  selectedPetId: number | null;
  onSubmit: (form: RecordFormState) => Promise<void>;
  isFramed?: boolean;
  showTitle?: boolean;
};

const conditionOptions = ["최고", "신남", "보통", "안좋음", "피곤함", "아픔"];
const tagOptions = ["산책", "식사", "간식", "놀이", "훈련", "미용", "병원", "수면"];
const maxSelectedTagCount = 5;

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getInitialRecordForm(): RecordFormState {
  return {
    recordDate: formatDate(new Date()),
    condition: "보통",
    memo: "",
    tags: "",
    photo: null
  };
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function stringifyTags(tags: string[]) {
  return tags.join(", ");
}

function ConditionCombobox({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const trimmedSearch = search.trim();
  const canUseCustomCondition = trimmedSearch.length > 0 && !conditionOptions.includes(trimmedSearch);

  function selectCondition(condition: string) {
    onChange(condition);
    setSearch("");
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="컨디션 선택"
          className={cn(secondaryButtonClass, "min-h-11 w-full justify-between px-3 py-2.5 text-left font-normal")}
          id={id}
          role="combobox"
          type="button"
        >
          <span className={cn("truncate", !value && "text-text-secondary")}>{value || "선택안함"}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="컨디션 검색 또는 직접 입력"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>입력한 값으로 직접 입력하세요.</CommandEmpty>
            <CommandGroup>
              {conditionOptions.map((condition) => (
                <CommandItem key={condition} value={condition} onSelect={() => selectCondition(condition)}>
                  <Check className={cn("h-4 w-4", value === condition ? "opacity-100" : "opacity-0")} aria-hidden="true" />
                  {condition}
                </CommandItem>
              ))}
              {canUseCustomCondition ? (
                <CommandItem value={trimmedSearch} onSelect={() => selectCondition(trimmedSearch)}>
                  <Check className="h-4 w-4 opacity-0" aria-hidden="true" />
                  "{trimmedSearch}" 직접 입력
                </CommandItem>
              ) : null}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function TagCombobox({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selectedTags = parseTags(value);
  const trimmedSearch = search.trim();
  const hasReachedTagLimit = selectedTags.length >= maxSelectedTagCount;
  const canUseCustomTag =
    trimmedSearch.length > 0 &&
    !hasReachedTagLimit &&
    !selectedTags.includes(trimmedSearch) &&
    !tagOptions.includes(trimmedSearch);

  function updateTags(nextTags: string[]) {
    onChange(stringifyTags(nextTags));
  }

  function selectTag(tag: string) {
    if (selectedTags.includes(tag)) {
      updateTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
    } else if (!hasReachedTagLimit) {
      updateTags([...selectedTags, tag]);
    }
    setSearch("");
  }

  function removeTag(tag: string) {
    updateTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
  }

  return (
    <div className="grid gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            aria-label="태그 선택"
            className={cn(secondaryButtonClass, "min-h-11 w-full justify-between px-3 py-2.5 text-left font-normal")}
            id={id}
            role="combobox"
            type="button"
          >
            <span className="truncate text-text-secondary">태그를 선택하세요 (최대 5개)</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput
              placeholder="태그 검색 또는 직접 입력"
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>입력한 값으로 직접 입력하세요.</CommandEmpty>
              <CommandGroup>
                {tagOptions.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  const isDisabled = !isSelected && hasReachedTagLimit;

                  return (
                    <CommandItem disabled={isDisabled} key={tag} value={tag} onSelect={() => selectTag(tag)}>
                      <Check className={cn("h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} aria-hidden="true" />
                      {tag}
                    </CommandItem>
                  );
                })}
                {canUseCustomTag ? (
                  <CommandItem value={trimmedSearch} onSelect={() => selectTag(trimmedSearch)}>
                    <Check className="h-4 w-4 opacity-0" aria-hidden="true" />
                    "{trimmedSearch}" 직접 입력
                  </CommandItem>
                ) : null}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedTags.length > 0 ? (
        <div className="flex min-w-0 flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <span
              className="inline-flex min-h-8 items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary"
              key={tag}
            >
              {tag}
              <button
                aria-label={`${tag} 태그 제거`}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full transition duration-150 hover:bg-surface active:scale-[0.99]"
                onClick={() => removeTag(tag)}
                type="button"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function RecordForm({ selectedPetId, onSubmit, isFramed = true, showTitle = true }: RecordFormProps) {
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const initialRecordForm = useMemo(() => getInitialRecordForm(), []);
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

  const containerClass = isFramed ? panelClass : "min-w-0";

  return (
    <div className={containerClass}>
      {showTitle ? <SectionTitle title="일상기록 작성" /> : null}
      <form onSubmit={handleSubmit(submitForm)} className="grid gap-3">
        <div className={labelClass}>
          <span>날짜</span>
          <Controller control={control} name="recordDate" render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} />} />
          {errors.recordDate && <span className="text-xs font-medium text-primary">{errors.recordDate.message}</span>}
        </div>
        <div className={labelClass}>
          <span>컨디션</span>
          <Controller
            control={control}
            name="condition"
            render={({ field }) => (
              <ConditionCombobox id="record-condition-trigger" value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.condition && <span className="text-xs font-medium text-primary">{errors.condition.message}</span>}
        </div>
        <div className={labelClass}>
          <span>메모</span>
          <textarea className={`${fieldClass} min-h-28 resize-none`} id="record-memo" placeholder="이날 있었던 일을 적어주세요." {...register("memo")} />
          {errors.memo && <span className="text-xs font-medium text-primary">{errors.memo.message}</span>}
        </div>
        <div className={labelClass}>
          <span>태그</span>
          <Controller
            control={control}
            name="tags"
            render={({ field }) => <TagCombobox id="record-tags-trigger" value={field.value} onChange={field.onChange} />}
          />
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
