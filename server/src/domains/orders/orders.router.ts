import { Router } from "express";
import { ok, fail } from "../../response.js";
import * as orderService from "./order-service.js";

export const ordersRouter = Router();

ordersRouter.post("/", (req, res) => {
  const result = orderService.createOrder(req.body);
  if (!result.ok) return fail(res, result.status, result.message);
  ok(res, result.message, result.data, result.status);
});

ordersRouter.get("/", (_req, res) => {
  ok(res, "Success", orderService.listOrders());
});

ordersRouter.get("/:orderUid", (req, res) => {
  const result = orderService.getOrder(req.params.orderUid);
  if (!result.ok) return fail(res, result.status, result.message);
  ok(res, result.message, result.data, result.status);
});

ordersRouter.put("/:orderUid", (req, res) => {
  const result = orderService.updateOrder(req.params.orderUid, req.body);
  if (!result.ok) return fail(res, result.status, result.message);
  ok(res, result.message, result.data, result.status);
});

ordersRouter.patch("/:orderUid/status", (req, res) => {
  const result = orderService.updateOrderStatus(req.params.orderUid, req.body.status);
  if (!result.ok) return fail(res, result.status, result.message);
  ok(res, result.message, result.data, result.status);
});

ordersRouter.get("/:orderUid/export", (req, res) => {
  const result = orderService.exportOrder(req.params.orderUid);
  if (!result.ok) return fail(res, result.status, result.message);
  ok(res, result.message, result.data, result.status);
});
