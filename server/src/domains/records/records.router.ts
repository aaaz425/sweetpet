import { Router } from "express";
import { db } from "../../db.js";
import { ok, fail } from "../../response.js";
import { upload, uploadedPath } from "../../uploads.js";
import { mapRecord, parseTags } from "./records-model.js";

export const recordsRouter = Router();

recordsRouter.get("/", (req, res) => {
  const petId = req.query.petId ? Number(req.query.petId) : undefined;
  const requestedLimit = req.query.limit ? Number(req.query.limit) : undefined;
  const requestedPage = req.query.page ? Number(req.query.page) : 1;
  const limit = requestedLimit && Number.isFinite(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, 50)
    : undefined;
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  if (limit) {
    const offset = (Math.max(page, 1) - 1) * limit;
    const rows = petId
      ? db.prepare("SELECT * FROM records WHERE pet_id = ? ORDER BY record_date DESC, id DESC LIMIT ? OFFSET ?").all(petId, limit + 1, offset)
      : db.prepare("SELECT * FROM records ORDER BY record_date DESC, id DESC LIMIT ? OFFSET ?").all(limit + 1, offset);
    const hasNextPage = rows.length > limit;

    return ok(res, "Success", {
      items: rows.slice(0, limit).map(mapRecord),
      nextPage: hasNextPage ? page + 1 : null
    });
  }

  const rows = petId
    ? db.prepare("SELECT * FROM records WHERE pet_id = ? ORDER BY record_date DESC, id DESC").all(petId)
    : db.prepare("SELECT * FROM records ORDER BY record_date DESC, id DESC").all();
  ok(res, "Success", rows.map(mapRecord));
});

recordsRouter.post("/", upload.single("photo"), (req, res) => {
  const { petId, recordDate, condition, memo, tags = [] } = req.body;
  if (!petId || !recordDate || !condition || !memo) {
    return fail(res, 400, "petId, recordDate, condition, and memo are required");
  }

  const pet = db.prepare("SELECT * FROM pets WHERE id = ?").get(petId);
  if (!pet) return fail(res, 404, "pet not found");

  const result = db
    .prepare("INSERT INTO records (pet_id, record_date, condition, memo, tags, image_path) VALUES (?, ?, ?, ?, ?, ?)")
    .run(petId, recordDate, condition, memo, JSON.stringify(parseTags(tags)), uploadedPath(req.file));
  const record = db.prepare("SELECT * FROM records WHERE id = ?").get(result.lastInsertRowid);
  ok(res, "Record created", mapRecord(record), 201);
});

recordsRouter.put("/:id", upload.single("photo"), (req, res) => {
  const { recordDate, condition, memo, tags = [] } = req.body;
  if (!recordDate || !condition || !memo) {
    return fail(res, 400, "recordDate, condition, and memo are required");
  }

  const currentRecord = db.prepare("SELECT * FROM records WHERE id = ?").get(req.params.id);
  if (!currentRecord) return fail(res, 404, "record not found");

  const nextImagePath = uploadedPath(req.file) ?? currentRecord.image_path;
  db.prepare(
    "UPDATE records SET record_date = ?, condition = ?, memo = ?, tags = ?, image_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).run(recordDate, condition, memo, JSON.stringify(parseTags(tags)), nextImagePath, req.params.id);

  const record = db.prepare("SELECT * FROM records WHERE id = ?").get(req.params.id);
  ok(res, "Record updated", mapRecord(record));
});

recordsRouter.delete("/:id", (req, res) => {
  db.prepare("DELETE FROM records WHERE id = ?").run(req.params.id);
  ok(res, "Record deleted", { id: Number(req.params.id) });
});
