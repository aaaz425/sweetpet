import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const databasePath = resolve(process.env.DATABASE_PATH ?? "./data/sweetpet.sqlite");
mkdirSync(dirname(databasePath), { recursive: true });

export const db = new DatabaseSync(databasePath);

function hasColumn(table: string, column: string) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
  return columns.some((item) => item.name === column);
}

export function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      species TEXT NOT NULL,
      breed TEXT,
      birthday TEXT,
      memo TEXT,
      image_path TEXT,
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
      image_path TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_uid TEXT NOT NULL UNIQUE,
      pet_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      start_date TEXT,
      end_date TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      print_options TEXT NOT NULL DEFAULT '{}',
      finalized_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS book_records (
      book_id INTEGER NOT NULL,
      record_id INTEGER NOT NULL,
      PRIMARY KEY (book_id, record_id),
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (record_id) REFERENCES records(id) ON DELETE CASCADE
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
  `);

  if (!hasColumn("orders", "order_uid")) {
    db.exec("ALTER TABLE orders ADD COLUMN order_uid TEXT");
  }
  if (!hasColumn("orders", "book_id")) {
    db.exec("ALTER TABLE orders ADD COLUMN book_id INTEGER");
  }
  if (!hasColumn("orders", "print_options")) {
    db.exec("ALTER TABLE orders ADD COLUMN print_options TEXT NOT NULL DEFAULT '{}'");
  }
  if (!hasColumn("pets", "image_path")) {
    db.exec("ALTER TABLE pets ADD COLUMN image_path TEXT");
  }
  if (!hasColumn("records", "image_path")) {
    db.exec("ALTER TABLE records ADD COLUMN image_path TEXT");
  }
}

export function seed() {
  const row = db.prepare("SELECT COUNT(*) AS count FROM pets").get() as { count: number };
  if (row.count > 0) {
    db.prepare(
      "UPDATE pets SET name = ?, species = ?, breed = ?, memo = ? WHERE name = ? AND species = ?"
    ).run("몽이", "강아지", "말티즈 믹스", "조용한 산책을 좋아하고 호기심이 많은 반려견입니다.", "Mong", "dog");
    db.prepare("UPDATE records SET condition = ?, memo = ?, tags = ? WHERE memo = ?").run(
      "좋음",
      "아침 산책을 천천히 다녀왔고 밥도 잘 먹었습니다.",
      JSON.stringify(["산책", "아침"]),
      "Took a slow morning walk and ate breakfast well."
    );
    db.prepare("UPDATE records SET condition = ?, memo = ?, tags = ? WHERE memo = ?").run(
      "보통",
      "미용실에 다녀왔습니다. 조금 피곤해 보였지만 집에서는 편하게 쉬었습니다.",
      JSON.stringify(["미용"]),
      "Visited the grooming salon. Looked tired but relaxed at home."
    );
    db.prepare("UPDATE records SET condition = ?, memo = ?, tags = ? WHERE memo = ?").run(
      "아주 좋음",
      "간식 앞에서 기다리기를 배웠습니다. 작지만 기억하고 싶은 성장 순간입니다.",
      JSON.stringify(["훈련", "성장"]),
      "Learned to wait before treats. A small but memorable milestone."
    );
    return;
  }

  const pet = db
    .prepare("INSERT INTO pets (name, species, breed, birthday, memo) VALUES (?, ?, ?, ?, ?)")
    .run("몽이", "강아지", "말티즈 믹스", "2023-05-12", "조용한 산책을 좋아하고 호기심이 많은 반려견입니다.");
  const petId = Number(pet.lastInsertRowid);

  const insertRecord = db.prepare(
    "INSERT INTO records (pet_id, record_date, weight, condition, memo, tags) VALUES (?, ?, ?, ?, ?, ?)"
  );

  insertRecord.run(
    petId,
    "2026-04-01",
    4.2,
    "좋음",
    "아침 산책을 천천히 다녀왔고 밥도 잘 먹었습니다.",
    JSON.stringify(["산책", "아침"])
  );
  insertRecord.run(
    petId,
    "2026-04-10",
    4.3,
    "보통",
    "미용실에 다녀왔습니다. 조금 피곤해 보였지만 집에서는 편하게 쉬었습니다.",
    JSON.stringify(["미용"])
  );
  insertRecord.run(
    petId,
    "2026-04-20",
    4.4,
    "아주 좋음",
    "간식 앞에서 기다리기를 배웠습니다. 작지만 기억하고 싶은 성장 순간입니다.",
    JSON.stringify(["훈련", "성장"])
  );
}
