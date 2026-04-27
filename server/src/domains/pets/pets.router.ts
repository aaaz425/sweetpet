import { Router } from "express";
import { db } from "../../db.js";
import { ok, fail } from "../../response.js";
import { upload, uploadedPath } from "../../uploads.js";
import { mapPet } from "./pets-model.js";

export const petsRouter = Router();

petsRouter.get("/", (_req, res) => {
  const pets = db.prepare("SELECT * FROM pets ORDER BY id DESC").all();
  ok(res, "Success", pets.map(mapPet));
});

petsRouter.post("/", upload.single("photo"), (req, res) => {
  const { name, species, breed = "", birthday = "", memo = "" } = req.body;
  if (!name || !species) return fail(res, 400, "name and species are required");

  const result = db
    .prepare("INSERT INTO pets (name, species, breed, birthday, memo, image_path) VALUES (?, ?, ?, ?, ?, ?)")
    .run(name, species, breed, birthday, memo, uploadedPath(req.file));
  const pet = db.prepare("SELECT * FROM pets WHERE id = ?").get(result.lastInsertRowid);
  ok(res, "Pet created", mapPet(pet), 201);
});
