import { z } from "zod";

const textField = z.string();
const fileField = z.custom<File | null>();

export const petFormSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요."),
  species: z.string().trim().min(1, "종류를 입력해주세요."),
  breed: textField,
  birthday: textField,
  memo: textField,
  photo: fileField
});

export const recordFormSchema = z.object({
  recordDate: z.string().trim().min(1, "날짜를 선택해주세요."),
  weight: z
    .string()
    .trim()
    .refine((value) => value === "" || !Number.isNaN(Number(value)), "몸무게는 숫자로 입력해주세요.")
    .refine((value) => value === "" || Number(value) >= 0, "몸무게는 0 이상이어야 합니다."),
  condition: z.string().trim().min(1, "컨디션을 선택해주세요."),
  memo: z.string().trim().min(1, "메모를 입력해주세요."),
  tags: textField,
  photo: fileField
});

export const orderFormSchema = z
  .object({
    title: z.string().trim().min(1, "제목을 입력해주세요."),
    startDate: z.string().trim().min(1, "시작일을 선택해주세요."),
    endDate: z.string().trim().min(1, "종료일을 선택해주세요.")
  })
  .refine((form) => !form.startDate || !form.endDate || form.startDate <= form.endDate, {
    message: "종료일은 시작일 이후여야 합니다.",
    path: ["endDate"]
  });
