import crypto from "node:crypto";
import { db } from "../db.js";
import { mapRecord, parseJson } from "./records-model.js";

export const bookSpecs = [
  {
    bookSpecUid: "sweetpet-a5-softcover",
    name: "Sweetpet A5 Softcover",
    size: "A5",
    binding: "softcover",
    minPages: 20,
    maxPages: 80
  }
];

export const templates = [
  {
    templateUid: "sweetpet-basic-template",
    name: "Sweetpet Basic",
    category: "pet-records",
    bookSpecUid: "sweetpet-a5-softcover"
  }
];

export function uid(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

export function mapBook(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    bookUid: row.book_uid,
    pet_id: row.pet_id,
    petId: row.pet_id,
    title: row.title,
    start_date: row.start_date,
    startDate: row.start_date,
    end_date: row.end_date,
    endDate: row.end_date,
    status: row.status,
    templateUid: row.template_uid,
    bookSpecUid: row.book_spec_uid,
    printOptions: parseJson(row.print_options, {}),
    finalizedAt: row.finalized_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    recordCount: row.record_count ?? 0
  };
}

export function mapOrder(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    orderUid: row.order_uid,
    bookId: row.book_id,
    pet_id: row.pet_id,
    petId: row.pet_id,
    title: row.title,
    start_date: row.start_date,
    startDate: row.start_date,
    end_date: row.end_date,
    endDate: row.end_date,
    status: row.status,
    printOptions: parseJson(row.print_options, {}),
    created_at: row.created_at,
    updated_at: row.updated_at,
    recordCount: row.record_count ?? 0
  };
}

export function bookSelect(where: string) {
  return `
    SELECT b.*,
      COUNT(br.record_id) AS record_count
    FROM books b
    LEFT JOIN book_records br ON br.book_id = b.id
    ${where}
    GROUP BY b.id
  `;
}

export function orderSelect(where: string) {
  return `
    SELECT o.*,
      COUNT(br.record_id) AS record_count
    FROM orders o
    LEFT JOIN books b ON b.id = o.book_id
    LEFT JOIN book_records br ON br.book_id = b.id
    ${where}
    GROUP BY o.id
  `;
}

export function findBook(bookUid: string) {
  return db.prepare(bookSelect("WHERE b.book_uid = ?")).get(bookUid) as any;
}

export function findOrder(orderUid: string) {
  if (/^\d+$/.test(orderUid)) {
    return db.prepare(orderSelect("WHERE o.order_uid = ? OR o.id = ?")).get(orderUid, Number(orderUid)) as any;
  }
  return db.prepare(orderSelect("WHERE o.order_uid = ?")).get(orderUid) as any;
}

export function getBookRecords(bookId: number) {
  return db
    .prepare(
      `SELECT r.* FROM records r
       INNER JOIN book_records br ON br.record_id = r.id
       WHERE br.book_id = ?
       ORDER BY r.record_date ASC, r.id ASC`
    )
    .all(bookId)
    .map(mapRecord);
}

export function selectedRecordIds(petId: number, body: any) {
  if (Array.isArray(body.recordIds) && body.recordIds.length > 0) {
    return db
      .prepare(`SELECT id FROM records WHERE pet_id = ? AND id IN (${body.recordIds.map(() => "?").join(",")}) ORDER BY record_date ASC`)
      .all(petId, ...body.recordIds.map(Number)) as Array<{ id: number }>;
  }

  if (body.startDate && body.endDate) {
    return db
      .prepare("SELECT id FROM records WHERE pet_id = ? AND record_date BETWEEN ? AND ? ORDER BY record_date ASC, id ASC")
      .all(petId, body.startDate, body.endDate) as Array<{ id: number }>;
  }

  return [];
}

export function replaceBookContents(bookId: number, recordIds: Array<{ id: number }>) {
  db.prepare("DELETE FROM book_records WHERE book_id = ?").run(bookId);
  const insert = db.prepare("INSERT INTO book_records (book_id, record_id) VALUES (?, ?)");
  recordIds.forEach((record) => insert.run(bookId, record.id));
  db.prepare("UPDATE books SET updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(bookId);
}
