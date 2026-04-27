import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { petFormSchema } from "../../lib/formSchemas";
import type { PetFormState } from "../../types";
import { SectionTitle } from "../SectionTitle";
import { fieldClass, labelClass, panelClass, primaryButtonClass } from "../ui";
import { DatePicker } from "../ui/date-picker";

type PetFormProps = {
  onSubmit: (form: PetFormState) => Promise<void>;
};

const initialPetForm: PetFormState = {
  name: "",
  species: "강아지",
  breed: "",
  birthday: "",
  memo: "",
  photo: null
};

export function PetForm({ onSubmit }: PetFormProps) {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue
  } = useForm<PetFormState>({
    defaultValues: initialPetForm,
    resolver: zodResolver(petFormSchema)
  });

  async function submitForm(form: PetFormState) {
    await onSubmit(form);
    reset(initialPetForm);
  }

  return (
    <div className={panelClass}>
      <SectionTitle title="새 마이펫" />
      <form className="grid gap-3" onSubmit={handleSubmit(submitForm)}>
        <label className={labelClass}>
          이름
          <input className={fieldClass} {...register("name")} />
          {errors.name && <span className="text-xs font-medium text-primary">{errors.name.message}</span>}
        </label>
        <label className={labelClass}>
          종류
          <input className={fieldClass} {...register("species")} />
          {errors.species && <span className="text-xs font-medium text-primary">{errors.species.message}</span>}
        </label>
        <label className={labelClass}>
          품종
          <input className={fieldClass} {...register("breed")} />
        </label>
        <label className={labelClass}>
          생일
          <Controller control={control} name="birthday" render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} />} />
        </label>
        <label className={labelClass}>
          메모
          <textarea className={`${fieldClass} min-h-28 resize-y`} {...register("memo")} />
        </label>
        <label className={labelClass}>
          대표 사진
          <input
            accept="image/*"
            className={fieldClass}
            onChange={(event) => setValue("photo", event.target.files?.[0] ?? null)}
            type="file"
          />
        </label>
        <button className={primaryButtonClass} disabled={isSubmitting} type="submit">등록</button>
      </form>
    </div>
  );
}
