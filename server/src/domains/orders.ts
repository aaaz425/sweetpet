import { Router } from "express";
import { db } from "../db.js";
import { ok, fail } from "../response.js";
import { parseJson } from "./records-model.js";
import { bookSelect, findBook, findOrder, getBookRecords, mapBook, mapOrder, orderSelect, uid } from "./print-model.js";

export const ordersRouter = Router();

ordersRouter.post("/", (req, res) => {
  const { bookUid } = req.body;
  if (!bookUid) return fail(res, 400, "bookUid is required");

  const book = findBook(bookUid);
  if (!book) return fail(res, 404, "book not found");
  if (book.status !== "finalized") return fail(res, 400, "book must be finalized before ordering");

  const existing = db.prepare(orderSelect("WHERE o.book_id = ?")).get(book.id);
  if (existing) return ok(res, "Order already exists", mapOrder(existing));

  const result = db
    .prepare(
      `INSERT INTO orders (order_uid, book_id, pet_id, title, start_date, end_date, status, print_options)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`
    )
    .run(uid("order"), book.id, book.pet_id, book.title, book.start_date, book.end_date, book.print_options);

  const order = db.prepare(orderSelect("WHERE o.id = ?")).get(result.lastInsertRowid);
  ok(res, "Order created", mapOrder(order), 201);
});

ordersRouter.get("/", (_req, res) => {
  const orders = db.prepare(orderSelect("")).all().map(mapOrder);
  ok(res, "Success", orders);
});

ordersRouter.get("/:orderUid", (req, res) => {
  const order = findOrder(req.params.orderUid);
  if (!order) return fail(res, 404, "order not found");
  ok(res, "Success", mapOrder(order));
});

ordersRouter.patch("/:orderUid/status", (req, res) => {
  const allowed = ["pending", "processing", "completed"];
  if (!allowed.includes(req.body.status)) return fail(res, 400, "invalid status");

  const order = findOrder(req.params.orderUid);
  if (!order) return fail(res, 404, "order not found");

  db.prepare("UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(req.body.status, order.id);
  const updated = db.prepare(orderSelect("WHERE o.id = ?")).get(order.id);
  ok(res, "Order status updated", mapOrder(updated));
});

ordersRouter.get("/:orderUid/export", (req, res) => {
  const order = findOrder(req.params.orderUid);
  if (!order) return fail(res, 404, "order not found");
  if (!order.book_id) return fail(res, 400, "order is not connected to a book");

  const book = db.prepare(bookSelect("WHERE b.id = ?")).get(order.book_id) as any;
  const pet = db.prepare("SELECT * FROM pets WHERE id = ?").get(order.pet_id);
  const records = getBookRecords(order.book_id);

  ok(res, "Order export generated", {
    service: "sweetpet",
    exportVersion: "1.0",
    generatedAt: new Date().toISOString(),
    order: mapOrder(order),
    book: mapBook(book),
    pet,
    selectedRecords: records,
    printOptions: parseJson(order.print_options, {})
  });
});
