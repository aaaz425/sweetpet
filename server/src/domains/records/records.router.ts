import { Router } from "express";
import { db } from "../../db.js";
import { ok, fail } from "../../response.js";
import { upload, uploadedPath } from "../../uploads.js";
import { mapRecord, parseTags } from "./records-model.js";

export const recordsRouter = Router();

recordsRouter.get("/", (req, res) => {
  const petId = req.query.petId ? Number(req.query.petId) : undefined;
  const rows = petId
    ? db.prepare("SELECT * FROM records WHERE pet_id = ? ORDER BY record_date DESC, id DESC").all(petId)
    : db.prepare("SELECT * FROM records ORDER BY record_date DESC, id DESC").all();
  ok(res, "Success", rows.map(mapRecord));
});

recordsRouter.post("/", upload.single("photo"), (req, res) => {
  const { petId, recordDate, weight = null, condition, memo, tags = [] } = req.body;
  if (!petId || !recordDate || !condition || !memo) {
    return fail(res, 400, "petId, recordDate, condition, and memo are required");
  }

  const pet = db.prepare("SELECT * FROM pets WHERE id = ?").get(petId);
  if (!pet) return fail(res, 404, "pet not found");

  const normalizedWeight = weight === "" ? null : weight;
  const result = db
    .prepare("INSERT INTO records (pet_id, record_date, weight, condition, memo, tags, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run(petId, recordDate, normalizedWeight, condition, memo, JSON.stringify(parseTags(tags)), uploadedPath(req.file));
  const record = db.prepare("SELECT * FROM records WHERE id = ?").get(result.lastInsertRowid);
  ok(res, "Record created", mapRecord(record), 201);
});

recordsRouter.put("/:id", (req, res) => {
  const { recordDate, weight = null, condition, memo, tags = [] } = req.body;
  db.prepare(
    "UPDATE records SET record_date = ?, weight = ?, condition = ?, memo = ?, tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).run(recordDate, weight, condition, memo, JSON.stringify(parseTags(tags)), req.params.id);

  const record = db.prepare("SELECT * FROM records WHERE id = ?").get(req.params.id);
  if (!record) return fail(res, 404, "record not found");
  ok(res, "Record updated", mapRecord(record));
});

recordsRouter.delete("/:id", (req, res) => {
  db.prepare("DELETE FROM records WHERE id = ?").run(req.params.id);
  ok(res, "Record deleted", { id: Number(req.params.id) });
});
