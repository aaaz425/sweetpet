import { getPrintOptionLabel } from "../../constants";
import type { Order } from "../../types";

export function getOrderQuantity(order: Order) {
  return typeof order.printOptions.quantity === "number" ? order.printOptions.quantity : 1;
}

export function getOrderPrintOptions(order: Order) {
  return [
    getPrintOptionLabel("size", order.printOptions.size),
    getPrintOptionLabel("binding", order.printOptions.binding),
    getPrintOptionLabel("paper", order.printOptions.paper)
  ].join(" / ");
}
