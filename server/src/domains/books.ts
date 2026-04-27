import { Router } from "express";
import { db } from "../db.js";
import { ok, fail } from "../response.js";
import {
  bookSelect,
  bookSpecs,
  findBook,
  getBookRecords,
  mapBook,
  replaceBookContents,
  selectedRecordIds,
  templates,
  uid
} from "./print-model.js";

export const booksRouter = Router();
export const bookSpecsRouter = Router();
export const templatesRouter = Router();

bookSpecsRouter.get("/", (_req, res) => {
  ok(res, "Success", bookSpecs);
});

templatesRouter.get("/", (_req, res) => {
  ok(res, "Success", templates);
});

booksRouter.post("/", (req, res) => {
  const {
    petId,
    title,
    startDate = null,
    endDate = null,
    templateUid = templates[0].templateUid,
    bookSpecUid = bookSpecs[0].bookSpecUid,
    printOptions = {}
  } = req.body;

  if (!petId || !title) return fail(res, 400, "petId and title are required");
  const pet = db.prepare("SELECT * FROM pets WHERE id = ?").get(petId);
  if (!pet) return fail(res, 404, "pet not found");

  const result = db
    .prepare(
      `INSERT INTO books (book_uid, pet_id, title, start_date, end_date, template_uid, book_spec_uid, print_options)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(uid("book"), petId, title, startDate, endDate, templateUid, bookSpecUid, JSON.stringify(printOptions));

  const book = db.prepare(bookSelect("WHERE b.id = ?")).get(result.lastInsertRowid);
  ok(res, "Book draft created", mapBook(book), 201);
});

booksRouter.get("/", (_req, res) => {
  const books = db.prepare(bookSelect("")).all().map(mapBook);
  ok(res, "Success", books);
});

booksRouter.get("/:bookUid", (req, res) => {
  const book = findBook(req.params.bookUid);
  if (!book) return fail(res, 404, "book not found");
  ok(res, "Success", { ...mapBook(book), records: getBookRecords(book.id) });
});

booksRouter.post("/:bookUid/contents", (req, res) => {
  const book = findBook(req.params.bookUid);
  if (!book) return fail(res, 404, "book not found");
  if (book.status !== "draft") return fail(res, 400, "only draft books can be edited");

  const records = selectedRecordIds(book.pet_id, req.body);
  if (records.length === 0) return fail(res, 400, "no records selected");

  replaceBookContents(book.id, records);
  const updated = findBook(req.params.bookUid);
  ok(res, "Book contents updated", { ...mapBook(updated), records: getBookRecords(book.id) });
});

booksRouter.post("/:bookUid/finalization", (req, res) => {
  const book = findBook(req.params.bookUid);
  if (!book) return fail(res, 404, "book not found");
  if (book.record_count < 1) return fail(res, 400, "book contents are required before finalization");

  db.prepare("UPDATE books SET status = 'finalized', finalized_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(book.id);
  const finalized = findBook(req.params.bookUid);
  ok(res, "Book finalized", mapBook(finalized));
});
