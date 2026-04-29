import { describe, expect, it } from "vitest";
import type { Order } from "../../types";
import { getOrderPrintOptions, getOrderQuantity } from "./orderViewUtils";

const baseOrder: Order = {
  id: 1,
  orderUid: "order_test",
  bookId: 1,
  petId: 1,
  title: "몽이의 4월 앨범",
  startDate: "2026-04-01",
  endDate: "2026-04-30",
  status: "pending",
  printOptions: {
    size: "b5",
    binding: "hardcover",
    paper: "glossy",
    quantity: 3
  },
  createdAt: "2026-04-01T00:00:00.000Z",
  updatedAt: "2026-04-01T00:00:00.000Z",
  recordCount: 5
};

describe("orderViewUtils", () => {
  it("returns the order quantity when it is numeric", () => {
    expect(getOrderQuantity(baseOrder)).toBe(3);
  });

  it("falls back to one when order quantity is missing", () => {
    expect(getOrderQuantity({ ...baseOrder, printOptions: {} })).toBe(1);
  });

  it("formats print option labels", () => {
    expect(getOrderPrintOptions(baseOrder)).toBe("B5 / 하드커버 / 유광 용지");
  });
});
