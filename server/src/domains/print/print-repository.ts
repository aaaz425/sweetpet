import { db } from "../../db.js";
import { mapRecord } from "../records/records-model.js";
import { bookSelect, orderSelect, uid } from "./print-model.js";

type CreateBookInput = {
  petId: number;
  title: string;
  startDate: string | null;
  endDate: string | null;
  printOptions: unknown;
};

export function findPet(petId: number) {
  return db.prepare("SELECT * FROM pets WHERE id = ?").get(petId);
}

export function createBookDraft(input: CreateBookInput) {
  const result = db
    .prepare(
      `INSERT INTO books (book_uid, pet_id, title, start_date, end_date, print_options)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(
      uid("book"),
      input.petId,
      input.title,
      input.startDate,
      input.endDate,
      JSON.stringify(input.printOptions)
    );

  return db.prepare(bookSelect("WHERE b.id = ?")).get(result.lastInsertRowid) as any;
}

export function listBooks() {
  return db.prepare(bookSelect("")).all() as any[];
}

export function findBook(bookUid: string) {
  return db.prepare(bookSelect("WHERE b.book_uid = ?")).get(bookUid) as any;
}

export function findBookById(bookId: number) {
  return db.prepare(bookSelect("WHERE b.id = ?")).get(bookId) as any;
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

export function finalizeBook(bookId: number) {
  db.prepare("UPDATE books SET status = 'finalized', finalized_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(bookId);
  return findBookById(bookId);
}

export function listOrders() {
  return db.prepare(orderSelect("")).all() as any[];
}

export function findOrder(orderUid: string) {
  if (/^\d+$/.test(orderUid)) {
    return db.prepare(orderSelect("WHERE o.order_uid = ? OR o.id = ?")).get(orderUid, Number(orderUid)) as any;
  }
  return db.prepare(orderSelect("WHERE o.order_uid = ?")).get(orderUid) as any;
}

export function findOrderByBookId(bookId: number) {
  return db.prepare(orderSelect("WHERE o.book_id = ?")).get(bookId) as any;
}

export function createOrderFromBook(book: any) {
  const result = db
    .prepare(
      `INSERT INTO orders (order_uid, book_id, pet_id, title, start_date, end_date, status, print_options)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`
    )
    .run(uid("order"), book.id, book.pet_id, book.title, book.start_date, book.end_date, book.print_options);

  return db.prepare(orderSelect("WHERE o.id = ?")).get(result.lastInsertRowid) as any;
}

export function updateOrderStatus(orderId: number, status: string) {
  db.prepare("UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(status, orderId);
  return db.prepare(orderSelect("WHERE o.id = ?")).get(orderId) as any;
}

export function updatePendingOrder(order: any, input: CreateBookInput, recordIds: Array<{ id: number }>) {
  db.prepare(
    `UPDATE books
     SET title = ?, start_date = ?, end_date = ?, print_options = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).run(input.title, input.startDate, input.endDate, JSON.stringify(input.printOptions), order.book_id);

  replaceBookContents(order.book_id, recordIds);

  db.prepare(
    `UPDATE orders
     SET title = ?, start_date = ?, end_date = ?, print_options = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).run(input.title, input.startDate, input.endDate, JSON.stringify(input.printOptions), order.id);

  return db.prepare(orderSelect("WHERE o.id = ?")).get(order.id) as any;
}
