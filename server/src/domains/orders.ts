import { Router } from "express";
import { db } from "../db.js";
import { ok, fail } from "../response.js";
import { parseJson } from "./records-model.js";
import {
  bookSelect,
  bookSpecs,
  findBook,
  findOrder,
  getBookRecords,
  mapBook,
  mapOrder,
  orderSelect,
  replaceBookContents,
  selectedRecordIds,
  templates,
  uid
} from "./print-model.js";

export const ordersRouter = Router();

function createOrderFromBook(bookUid: string) {
  const book = findBook(bookUid);
  if (!book) return { error: { status: 404, message: "book not found" } };
  if (book.status !== "finalized") return { error: { status: 400, message: "book must be finalized before ordering" } };

  const existing = db.prepare(orderSelect("WHERE o.book_id = ?")).get(book.id);
  if (existing) return { order: mapOrder(existing), created: false };

  const result = db
    .prepare(
      `INSERT INTO orders (order_uid, book_id, pet_id, title, start_date, end_date, status, print_options)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`
    )
    .run(uid("order"), book.id, book.pet_id, book.title, book.start_date, book.end_date, book.print_options);

  const order = db.prepare(orderSelect("WHERE o.id = ?")).get(result.lastInsertRowid);
  return { order: mapOrder(order), created: true };
}

ordersRouter.post("/", (req, res) => {
  const {
    bookUid,
    petId,
    title,
    startDate,
    endDate,
    templateUid = templates[0].templateUid,
    bookSpecUid = bookSpecs[0].bookSpecUid,
    printOptions = {}
  } = req.body;

  if (bookUid) {
    const result = createOrderFromBook(bookUid);
    if (result.error) return fail(res, result.error.status, result.error.message);
    return ok(res, result.created ? "Order created" : "Order already exists", result.order, result.created ? 201 : 200);
  }

  if (!petId || !title || !startDate || !endDate) {
    return fail(res, 400, "petId, title, startDate, and endDate are required");
  }

  const pet = db.prepare("SELECT * FROM pets WHERE id = ?").get(petId);
  if (!pet) return fail(res, 404, "pet not found");

  const records = selectedRecordIds(Number(petId), { startDate, endDate });
  if (records.length === 0) return fail(res, 400, "no records selected");

  const bookResult = db
    .prepare(
      `INSERT INTO books (book_uid, pet_id, title, start_date, end_date, template_uid, book_spec_uid, print_options)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(uid("book"), petId, title, startDate, endDate, templateUid, bookSpecUid, JSON.stringify(printOptions));

  const book = db.prepare(bookSelect("WHERE b.id = ?")).get(bookResult.lastInsertRowid) as any;
  replaceBookContents(book.id, records);
  db.prepare("UPDATE books SET status = 'finalized', finalized_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(book.id);

  const result = createOrderFromBook(book.book_uid);
  if (result.error) return fail(res, result.error.status, result.error.message);
  ok(res, "Order created", result.order, 201);
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
