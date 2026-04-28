import crypto from "node:crypto";
import { parseJson } from "../records/records-model.js";

export function uid(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

export function mapBook(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    bookUid: row.book_uid,
    petId: row.pet_id,
    title: row.title,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
    printOptions: parseJson(row.print_options, {}),
    finalizedAt: row.finalized_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    recordCount: row.record_count ?? 0
  };
}

export function mapOrder(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    orderUid: row.order_uid,
    bookId: row.book_id,
    petId: row.pet_id,
    title: row.title,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
    printOptions: parseJson(row.print_options, {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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
