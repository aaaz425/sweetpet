import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { petFormSchema } from "../../lib/formSchemas";
import { cn } from "../../lib/utils";
import type { PetFormState } from "../../types";
import { fieldClass, labelClass, primaryButtonClass, secondaryButtonClass } from "../ui";
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

type PetFormProps = {
  initialValues?: PetFormState;
  submitLabel?: string;
  onSubmit: (form: PetFormState) => Promise<void>;
};

const initialPetForm: PetFormState = {
  name: "",
  species: "",
  breed: "",
  birthday: "",
  memo: "",
  photo: null
};

const speciesOptions = ["강아지", "고양이", "토끼", "햄스터", "앵무새", "거북이", "물고기", "달팽이"];

function SpeciesCombobox({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const trimmedSearch = search.trim();
  const canUseCustomSpecies = trimmedSearch.length > 0 && !speciesOptions.includes(trimmedSearch);

  function selectSpecies(species: string) {
    onChange(species);
    setSearch("");
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="종류 선택"
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
            placeholder="종류 검색 또는 직접 입력"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>입력한 값으로 직접 입력하세요.</CommandEmpty>
            <CommandGroup>
              {speciesOptions.map((species) => (
                <CommandItem key={species} value={species} onSelect={() => selectSpecies(species)}>
                  <Check className={cn("h-4 w-4", value === species ? "opacity-100" : "opacity-0")} aria-hidden="true" />
                  {species}
                </CommandItem>
              ))}
              {canUseCustomSpecies ? (
                <CommandItem value={trimmedSearch} onSelect={() => selectSpecies(trimmedSearch)}>
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

export function PetForm({ initialValues = initialPetForm, submitLabel = "등록", onSubmit }: PetFormProps) {
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
    watch
  } = useForm<PetFormState>({
    defaultValues: initialPetForm,
    resolver: zodResolver(petFormSchema)
  });
  const selectedPhoto = watch("photo");

  useEffect(() => {
    reset(initialValues);
    if (photoInputRef.current) photoInputRef.current.value = "";
  }, [initialValues, reset]);

  function handleClearPhoto() {
    setValue("photo", null, { shouldDirty: true });
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  async function submitForm(form: PetFormState) {
    await onSubmit(form);
    reset(initialValues);
  }

  function handleInvalidSubmit() {
    toast.error("입력 내용을 확인해주세요.");
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit(submitForm, handleInvalidSubmit)}>
      <div className={labelClass}>
        <label htmlFor="pet-name">이름</label>
        <input className={fieldClass} id="pet-name" {...register("name")} />
        {errors.name && <span className="text-xs font-medium text-primary">{errors.name.message}</span>}
      </div>
      <div className={labelClass}>
        <label htmlFor="pet-species-trigger">종류</label>
        <Controller
          control={control}
          name="species"
          render={({ field }) => <SpeciesCombobox id="pet-species-trigger" value={field.value} onChange={field.onChange} />}
        />
        {errors.species && <span className="text-xs font-medium text-primary">{errors.species.message}</span>}
      </div>
      <div className={labelClass}>
        <label htmlFor="pet-breed">품종 (선택)</label>
        <input className={fieldClass} id="pet-breed" {...register("breed")} />
      </div>
      <div className={labelClass}>
        <span>생일 (선택)</span>
        <Controller control={control} name="birthday" render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} />} />
      </div>
      <div className={labelClass}>
        <label htmlFor="pet-memo">메모 (선택)</label>
        <textarea className={`${fieldClass} min-h-28 resize-none`} id="pet-memo" {...register("memo")} />
      </div>
      <div className={labelClass}>
        <span>대표 사진</span>
        <div className="flex min-w-0 flex-wrap items-center gap-2 rounded-xl border border-border bg-surface p-2">
          <label className={`${secondaryButtonClass} inline-flex min-h-9 shrink-0 items-center justify-center px-3 py-1.5 text-xs`}>
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
      <button className={primaryButtonClass} disabled={isSubmitting} type="submit">
        {isSubmitting ? "저장 중" : submitLabel}
      </button>
    </form>
  );
}
