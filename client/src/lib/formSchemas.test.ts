import { describe, expect, it } from "vitest";
import { orderFormSchema } from "./formSchemas";

const validOrderForm = {
  title: "몽이의 4월 앨범",
  startDate: "2026-04-01",
  endDate: "2026-04-30",
  printOptions: {
    size: "a5",
    binding: "softcover",
    paper: "matte",
    quantity: 1
  }
} as const;

describe("orderFormSchema", () => {
  it("rejects an end date before the start date", () => {
    const result = orderFormSchema.safeParse({
      ...validOrderForm,
      startDate: "2026-04-30",
      endDate: "2026-04-01"
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["endDate"],
          message: "종료일은 시작일 이후여야 합니다."
        })
      ])
    );
  });

  it("rejects quantities outside the allowed range", () => {
    const tooSmall = orderFormSchema.safeParse({
      ...validOrderForm,
      printOptions: {
        ...validOrderForm.printOptions,
        quantity: 0
      }
    });
    const tooLarge = orderFormSchema.safeParse({
      ...validOrderForm,
      printOptions: {
        ...validOrderForm.printOptions,
        quantity: 21
      }
    });

    expect(tooSmall.success).toBe(false);
    expect(tooLarge.success).toBe(false);
  });
});
