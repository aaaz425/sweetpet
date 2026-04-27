import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const databasePath = resolve(process.env.DATABASE_PATH ?? "./data/sweetpet.sqlite");
mkdirSync(dirname(databasePath), { recursive: true });

export const db = new DatabaseSync(databasePath);

export function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      species TEXT NOT NULL,
      breed TEXT,
      birthday TEXT,
      memo TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pet_id INTEGER NOT NULL,
      record_date TEXT NOT NULL,
      weight REAL,
      condition TEXT NOT NULL,
      memo TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pet_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS order_records (
      order_id INTEGER NOT NULL,
      record_id INTEGER NOT NULL,
      PRIMARY KEY (order_id, record_id),
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (record_id) REFERENCES records(id) ON DELETE CASCADE
    );
  `);
}

export function seed() {
  const row = db.prepare("SELECT COUNT(*) AS count FROM pets").get() as { count: number };
  if (row.count > 0) return;

  const pet = db
    .prepare("INSERT INTO pets (name, species, breed, birthday, memo) VALUES (?, ?, ?, ?, ?)")
    .run("Mong", "dog", "Maltese mix", "2023-05-12", "Calm, curious, and loves quiet walks.");
  const petId = Number(pet.lastInsertRowid);

  const insertRecord = db.prepare(
    "INSERT INTO records (pet_id, record_date, weight, condition, memo, tags) VALUES (?, ?, ?, ?, ?, ?)"
  );

  insertRecord.run(
    petId,
    "2026-04-01",
    4.2,
    "good",
    "Took a slow morning walk and ate breakfast well.",
    JSON.stringify(["walk", "morning"])
  );
  insertRecord.run(
    petId,
    "2026-04-10",
    4.3,
    "normal",
    "Visited the grooming salon. Looked tired but relaxed at home.",
    JSON.stringify(["grooming"])
  );
  insertRecord.run(
    petId,
    "2026-04-20",
    4.4,
    "great",
    "Learned to wait before treats. A small but memorable milestone.",
    JSON.stringify(["training", "milestone"])
  );
}
