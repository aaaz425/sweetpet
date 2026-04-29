import { describe, expect, it } from "vitest";
import { normalizePrintOptions, updateOrderStatus } from "./order-service.js";

describe("normalizePrintOptions", () => {
  it("returns defaults for missing or invalid options", () => {
    expect(normalizePrintOptions(null)).toEqual({
      size: "a5",
      binding: "softcover",
      paper: "matte",
      quantity: 1
    });
  });

  it("clamps quantity to the allowed range", () => {
    expect(normalizePrintOptions({ quantity: 0 }).quantity).toBe(1);
    expect(normalizePrintOptions({ quantity: 30 }).quantity).toBe(20);
  });
});

describe("updateOrderStatus", () => {
  it("rejects invalid statuses before updating an order", () => {
    const result = updateOrderStatus("order_test", "archived");

    expect(result).toEqual({
      ok: false,
      status: 400,
      message: "invalid status"
    });
  });
});
