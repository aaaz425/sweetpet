import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const databasePath = resolve(process.env.DATABASE_PATH ?? "./data/sweetpet.sqlite");
mkdirSync(dirname(databasePath), { recursive: true });

export const db = new DatabaseSync(databasePath);

type SeedRecord = {
  recordDate: string;
  condition: string;
  memo: string;
  tags: string[];
  imagePath: string;
};

type SeedOrder = {
  bookUid: string;
  orderUid: string;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  printOptions: {
    size: "a5" | "b5";
    binding: "softcover" | "hardcover";
    paper: "matte" | "glossy";
    quantity: number;
  };
};

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
  const legacySeedPets = db.prepare("SELECT id FROM pets WHERE name IN (?, ?) AND species = ?").all("몽이", "온달이", "강아지") as Array<{ id: number }>;
  for (const pet of legacySeedPets) {
    db.prepare("DELETE FROM orders WHERE pet_id = ?").run(pet.id);
    db.prepare("DELETE FROM book_records WHERE book_id IN (SELECT id FROM books WHERE pet_id = ?)").run(pet.id);
    db.prepare("DELETE FROM books WHERE pet_id = ?").run(pet.id);
    db.prepare("DELETE FROM records WHERE pet_id = ?").run(pet.id);
    db.prepare("DELETE FROM pets WHERE id = ?").run(pet.id);
  }

  const seedMemo = [
    "16살 먹은 할아버지지만 여전히 귀여운 온달이, 먹는걸 제일 좋아하는 바보 강아지",
    "성별: 남자",
    "성격: 귀차니즘",
    "좋아하는 것: 먹을 것",
    "싫어하는 것: 주사",
    "산책/놀이 습관: 아무데나 목 걸치기",
    "건강 특이사항: 노견이라 다리가 좀 불편",
    "기록 톤: 담백하게"
  ].join("\n");

  const existingSeedPet = db.prepare("SELECT id FROM pets WHERE name = ? AND species = ?").get("온달", "강아지") as
    | { id: number }
    | undefined;

  if (existingSeedPet) {
    db.prepare(
      "UPDATE pets SET breed = ?, birthday = ?, memo = ?, image_path = ? WHERE id = ?"
    ).run("스피츠", "2010-04-25", seedMemo, "/seed-images/ondal/thumbnail.jpeg", existingSeedPet.id);
    seedOndalContent(existingSeedPet.id);
    return;
  }

  const pet = db
    .prepare("INSERT INTO pets (name, species, breed, birthday, memo, image_path) VALUES (?, ?, ?, ?, ?, ?)")
    .run("온달", "강아지", "스피츠", "2010-04-25", seedMemo, "/seed-images/ondal/thumbnail.jpeg");
  const petId = Number(pet.lastInsertRowid);

  seedOndalContent(petId);
}

function seedOndalContent(petId: number) {
  db.prepare("DELETE FROM orders WHERE pet_id = ?").run(petId);
  db.prepare("DELETE FROM book_records WHERE book_id IN (SELECT id FROM books WHERE pet_id = ?)").run(petId);
  db.prepare("DELETE FROM books WHERE pet_id = ?").run(petId);
  db.prepare("DELETE FROM records WHERE pet_id = ?").run(petId);

  const ondalRecords: SeedRecord[] = [
    {
      recordDate: "2026-01-05",
      condition: "보통",
      memo: "아침에는 오래 누워 있었다. 밥그릇 소리가 나자 바로 일어났다.",
      tags: ["식사", "휴식", "노견"],
      imagePath: "/seed-images/ondal/sleeping-on-cushion.jpeg"
    },
    {
      recordDate: "2026-01-18",
      condition: "좋음",
      memo: "담요 밑에 들어가 있다가 간식 봉지 소리에 고개를 내밀었다.",
      tags: ["간식", "휴식"],
      imagePath: "/seed-images/ondal/hiding-under-blanket.jpeg"
    },
    {
      recordDate: "2026-02-03",
      condition: "좋음",
      memo: "밥을 천천히 먹었다. 다 먹고도 그릇 주변을 한 번 더 확인했다.",
      tags: ["식사"],
      imagePath: "/seed-images/ondal/meal-with-bandana.jpeg"
    },
    {
      recordDate: "2026-02-14",
      condition: "보통",
      memo: "집 안에서 조금 걷다가 의자 아래에 자리를 잡았다. 다리는 무리하지 않게 봤다.",
      tags: ["건강", "휴식"],
      imagePath: "/seed-images/ondal/under-chair-rest.jpeg"
    },
    {
      recordDate: "2026-02-27",
      condition: "좋음",
      memo: "놀이방 매트 위에서 잠깐 웃는 표정을 보였다. 오래 놀지는 않았다.",
      tags: ["놀이", "노견"],
      imagePath: "/seed-images/ondal/playroom-smile.jpeg"
    },
    {
      recordDate: "2026-03-04",
      condition: "보통",
      memo: "산책 대신 유모차로 동네를 한 바퀴 돌았다. 바람 냄새는 오래 맡았다.",
      tags: ["산책", "유모차"],
      imagePath: "/seed-images/ondal/stroller-walk.jpeg"
    },
    {
      recordDate: "2026-03-10",
      condition: "좋음",
      memo: "빨간 후드티를 입고 짧게 걸었다. 중간에 멈춰 쉬는 시간이 많았다.",
      tags: ["산책", "옷", "건강"],
      imagePath: "/seed-images/ondal/red-hoodie-walk.jpeg"
    },
    {
      recordDate: "2026-03-16",
      condition: "좋음",
      memo: "소파에 턱을 걸치고 한참 쉬었다. 편한 자리를 찾는 데에는 여전히 정확하다.",
      tags: ["휴식", "습관"],
      imagePath: "/seed-images/ondal/sofa-smile.jpeg"
    },
    {
      recordDate: "2026-03-23",
      condition: "보통",
      memo: "병원 냄새가 나자 긴장했다. 주사는 싫어했지만 끝나고 간식은 잘 먹었다.",
      tags: ["병원", "주사", "간식"],
      imagePath: "/seed-images/ondal/close-up-with-towel.jpeg"
    },
    {
      recordDate: "2026-03-29",
      condition: "좋음",
      memo: "간식 앞에서는 오래 기다리지 못했다. 그래도 표정은 밝았다.",
      tags: ["간식", "식사"],
      imagePath: "/seed-images/ondal/treat-time.jpeg"
    },
    {
      recordDate: "2026-04-01",
      condition: "보통",
      memo: "다리가 조금 불편해 보여 산책은 짧게 했다. 집에 와서는 밥을 잘 먹었다.",
      tags: ["노견", "산책", "식사"],
      imagePath: "/seed-images/ondal/park-bench.jpeg"
    },
    {
      recordDate: "2026-04-05",
      condition: "좋음",
      memo: "간식 냄새를 맡고 천천히 다가왔다. 먹을 것 앞에서는 아직도 집중력이 좋다.",
      tags: ["간식", "식사"],
      imagePath: "/seed-images/ondal/sniffing-supplies.jpeg"
    },
    {
      recordDate: "2026-04-10",
      condition: "보통",
      memo: "주사 맞는 날이라 병원에서는 긴장했다. 돌아와서는 오래 쉬었다.",
      tags: ["병원", "주사", "휴식"],
      imagePath: "/seed-images/ondal/peek-under-cushion.jpeg"
    },
    {
      recordDate: "2026-04-15",
      condition: "좋음",
      memo: "아무데나 목을 걸치고 쉬었다. 불편해 보여도 본인은 편한 듯했다.",
      tags: ["휴식", "습관"],
      imagePath: "/seed-images/ondal/table-side.jpeg"
    },
    {
      recordDate: "2026-04-20",
      condition: "좋음",
      memo: "벚꽃 길을 유모차로 다녀왔다. 오래 걷지는 못했지만 바깥 공기는 잘 즐겼다.",
      tags: ["산책", "유모차", "노견"],
      imagePath: "/seed-images/ondal/cherry-blossom-stroller.jpeg"
    },
    {
      recordDate: "2026-04-25",
      condition: "아주 좋음",
      memo: "16번째 생일이라 좋아하는 간식을 챙겼다. 많이 움직이지는 않았지만 기분은 좋아 보였다.",
      tags: ["생일", "간식"],
      imagePath: "/seed-images/ondal/indoor-portrait.jpeg"
    }
  ];

  const insertRecord = db.prepare(
    "INSERT INTO records (pet_id, record_date, condition, memo, tags, image_path) VALUES (?, ?, ?, ?, ?, ?)"
  );
  ondalRecords.forEach((record) => {
    insertRecord.run(
      petId,
      record.recordDate,
      record.condition,
      record.memo,
      JSON.stringify(record.tags),
      record.imagePath
    );
  });

  const ondalOrders: SeedOrder[] = [
    {
      bookUid: "book_seed_ondal_winter",
      orderUid: "order_seed_ondal_winter",
      title: "온달의 겨울 낮잠 기록",
      startDate: "2026-01-05",
      endDate: "2026-02-27",
      status: "completed",
      printOptions: { size: "a5", binding: "softcover", paper: "matte", quantity: 1 }
    },
    {
      bookUid: "book_seed_ondal_march",
      orderUid: "order_seed_ondal_march",
      title: "온달의 3월 산책 앨범",
      startDate: "2026-03-04",
      endDate: "2026-03-29",
      status: "processing",
      printOptions: { size: "b5", binding: "hardcover", paper: "glossy", quantity: 2 }
    },
    {
      bookUid: "book_seed_ondal_april",
      orderUid: "order_seed_ondal_april",
      title: "온달의 16살 생일 앨범",
      startDate: "2026-04-01",
      endDate: "2026-04-25",
      status: "pending",
      printOptions: { size: "b5", binding: "hardcover", paper: "matte", quantity: 3 }
    },
    {
      bookUid: "book_seed_ondal_vet",
      orderUid: "order_seed_ondal_vet",
      title: "온달의 병원 다녀온 날들",
      startDate: "2026-03-23",
      endDate: "2026-04-20",
      status: "canceled",
      printOptions: { size: "a5", binding: "softcover", paper: "glossy", quantity: 1 }
    }
  ];

  const insertBook = db.prepare(
    `INSERT INTO books (book_uid, pet_id, title, start_date, end_date, status, print_options, finalized_at)
     VALUES (?, ?, ?, ?, ?, 'finalized', ?, CURRENT_TIMESTAMP)`
  );
  const insertBookRecord = db.prepare("INSERT INTO book_records (book_id, record_id) VALUES (?, ?)");
  const insertOrder = db.prepare(
    `INSERT INTO orders (order_uid, book_id, pet_id, title, start_date, end_date, status, print_options)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  ondalOrders.forEach((order) => {
    const book = insertBook.run(
      order.bookUid,
      petId,
      order.title,
      order.startDate,
      order.endDate,
      JSON.stringify(order.printOptions)
    );
    const bookId = Number(book.lastInsertRowid);
    const records = db
      .prepare("SELECT id FROM records WHERE pet_id = ? AND record_date BETWEEN ? AND ? ORDER BY record_date ASC, id ASC")
      .all(petId, order.startDate, order.endDate) as Array<{ id: number }>;
    records.forEach((record) => insertBookRecord.run(bookId, record.id));
    insertOrder.run(
      order.orderUid,
      bookId,
      petId,
      order.title,
      order.startDate,
      order.endDate,
      order.status,
      JSON.stringify(order.printOptions)
    );
  });
}
