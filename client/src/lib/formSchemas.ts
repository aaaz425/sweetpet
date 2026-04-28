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
  condition: z.string().trim().min(1, "컨디션을 선택해주세요."),
  memo: z.string().trim().min(1, "메모를 입력해주세요."),
  tags: textField,
  photo: fileField
});

export const orderFormSchema = z
  .object({
    title: z.string().trim().min(1, "제목을 입력해주세요."),
    startDate: z.string().trim().min(1, "시작일을 선택해주세요."),
    endDate: z.string().trim().min(1, "종료일을 선택해주세요."),
    printOptions: z.object({
      size: z.enum(["a5", "b5"]),
      binding: z.enum(["softcover", "hardcover"]),
      paper: z.enum(["matte", "glossy"]),
      quantity: z
        .number()
        .int("주문 수량은 정수로 입력해주세요.")
        .min(1, "주문 수량은 1권 이상이어야 합니다.")
        .max(20, "주문 수량은 20권 이하로 입력해주세요.")
    })
  })
  .refine((form) => !form.startDate || !form.endDate || form.startDate <= form.endDate, {
    message: "종료일은 시작일 이후여야 합니다.",
    path: ["endDate"]
  });
