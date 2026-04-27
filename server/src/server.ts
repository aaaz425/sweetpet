import cors from "cors";
import "dotenv/config";
import express from "express";
import { db, migrate, seed } from "./db.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

migrate();
seed();

function parseTags(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((tag) => tag.trim()).filter(Boolean);
  return [];
}

function mapRecord(row: any) {
  return { ...row, tags: JSON.parse(row.tags ?? "[]") };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "sweetpet" });
});

app.get("/api/pets", (_req, res) => {
  const pets = db.prepare("SELECT * FROM pets ORDER BY id DESC").all();
  res.json(pets);
});

app.post("/api/pets", (req, res) => {
  const { name, species, breed = "", birthday = "", memo = "" } = req.body;
  if (!name || !species) return res.status(400).json({ message: "name and species are required" });

  const result = db
    .prepare("INSERT INTO pets (name, species, breed, birthday, memo) VALUES (?, ?, ?, ?, ?)")
    .run(name, species, breed, birthday, memo);
  const pet = db.prepare("SELECT * FROM pets WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(pet);
});

app.get("/api/records", (req, res) => {
  const petId = req.query.petId ? Number(req.query.petId) : undefined;
  const rows = petId
    ? db.prepare("SELECT * FROM records WHERE pet_id = ? ORDER BY record_date DESC, id DESC").all(petId)
    : db.prepare("SELECT * FROM records ORDER BY record_date DESC, id DESC").all();
  res.json(rows.map(mapRecord));
});

app.post("/api/records", (req, res) => {
  const { petId, recordDate, weight = null, condition, memo, tags = [] } = req.body;
  if (!petId || !recordDate || !condition || !memo) {
    return res.status(400).json({ message: "petId, recordDate, condition, and memo are required" });
  }

  const result = db
    .prepare("INSERT INTO records (pet_id, record_date, weight, condition, memo, tags) VALUES (?, ?, ?, ?, ?, ?)")
    .run(petId, recordDate, weight, condition, memo, JSON.stringify(parseTags(tags)));
  const record = db.prepare("SELECT * FROM records WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(mapRecord(record));
});

app.put("/api/records/:id", (req, res) => {
  const { recordDate, weight = null, condition, memo, tags = [] } = req.body;
  db.prepare(
    "UPDATE records SET record_date = ?, weight = ?, condition = ?, memo = ?, tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).run(recordDate, weight, condition, memo, JSON.stringify(parseTags(tags)), req.params.id);

  const record = db.prepare("SELECT * FROM records WHERE id = ?").get(req.params.id);
  if (!record) return res.status(404).json({ message: "record not found" });
  res.json(mapRecord(record));
});

app.delete("/api/records/:id", (req, res) => {
  db.prepare("DELETE FROM records WHERE id = ?").run(req.params.id);
  res.status(204).end();
});

app.get("/api/orders", (_req, res) => {
  const orders = db.prepare("SELECT * FROM orders ORDER BY id DESC").all();
  res.json(orders);
});

app.post("/api/orders", (req, res) => {
  const { petId, title, startDate, endDate } = req.body;
  if (!petId || !title || !startDate || !endDate) {
    return res.status(400).json({ message: "petId, title, startDate, and endDate are required" });
  }

  const result = db
    .prepare("INSERT INTO orders (pet_id, title, start_date, end_date) VALUES (?, ?, ?, ?)")
    .run(petId, title, startDate, endDate);
  const orderId = Number(result.lastInsertRowid);

  const records = db
    .prepare("SELECT id FROM records WHERE pet_id = ? AND record_date BETWEEN ? AND ? ORDER BY record_date ASC")
    .all(petId, startDate, endDate) as Array<{ id: number }>;
  const link = db.prepare("INSERT INTO order_records (order_id, record_id) VALUES (?, ?)");
  records.forEach((record) => link.run(orderId, record.id));

  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
  res.status(201).json({ ...order, recordCount: records.length });
});

app.patch("/api/orders/:id/status", (req, res) => {
  const allowed = ["pending", "processing", "completed"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "invalid status" });

  db.prepare("UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(req.body.status, req.params.id);
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id);
  if (!order) return res.status(404).json({ message: "order not found" });
  res.json(order);
});

app.get("/api/orders/:id/export", (req, res) => {
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id) as any;
  if (!order) return res.status(404).json({ message: "order not found" });

  const pet = db.prepare("SELECT * FROM pets WHERE id = ?").get(order.pet_id);
  const records = db
    .prepare(
      `SELECT r.* FROM records r
       INNER JOIN order_records ors ON ors.record_id = r.id
       WHERE ors.order_id = ?
       ORDER BY r.record_date ASC`
    )
    .all(order.id)
    .map(mapRecord);

  res.json({
    service: "sweetpet",
    exportVersion: "1.0",
    generatedAt: new Date().toISOString(),
    order,
    pet,
    records
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`sweetpet api listening on ${port}`);
});
