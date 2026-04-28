import { Router } from "express";
import { ok, fail } from "../../response.js";
import * as bookService from "./book-service.js";

export const booksRouter = Router();

booksRouter.post("/", (req, res) => {
  const result = bookService.createBook(req.body);
  if (!result.ok) return fail(res, result.status, result.message);
  ok(res, result.message, result.data, result.status);
});

booksRouter.get("/", (_req, res) => {
  ok(res, "Success", bookService.listBooks());
});

booksRouter.get("/:bookUid", (req, res) => {
  const result = bookService.getBook(req.params.bookUid);
  if (!result.ok) return fail(res, result.status, result.message);
  ok(res, result.message, result.data, result.status);
});

booksRouter.post("/:bookUid/contents", (req, res) => {
  const result = bookService.updateBookContents(req.params.bookUid, req.body);
  if (!result.ok) return fail(res, result.status, result.message);
  ok(res, result.message, result.data, result.status);
});

booksRouter.post("/:bookUid/finalization", (req, res) => {
  const result = bookService.finalizeBook(req.params.bookUid);
  if (!result.ok) return fail(res, result.status, result.message);
  ok(res, result.message, result.data, result.status);
});
