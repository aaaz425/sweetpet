import { mapBook } from "../print/print-model.js";
import * as repository from "../print/print-repository.js";

type ServiceResult<T> =
  | {
      ok: true;
      status: number;
      message: string;
      data: T;
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

type CreateBookInput = {
  petId?: number;
  title?: string;
  startDate?: string | null;
  endDate?: string | null;
  printOptions?: unknown;
};

function success<T>(status: number, message: string, data: T): ServiceResult<T> {
  return { ok: true, status, message, data };
}

function failure<T>(status: number, message: string): ServiceResult<T> {
  return { ok: false, status, message };
}

export function createBook(input: CreateBookInput) {
  if (!input.petId || !input.title) return failure(400, "petId and title are required");

  const pet = repository.findPet(Number(input.petId));
  if (!pet) return failure(404, "pet not found");

  const book = repository.createBookDraft({
    petId: Number(input.petId),
    title: input.title,
    startDate: input.startDate ?? null,
    endDate: input.endDate ?? null,
    printOptions: input.printOptions ?? {}
  });

  return success(201, "Book draft created", mapBook(book));
}

export function listBooks() {
  return repository.listBooks().map(mapBook);
}

export function getBook(bookUid: string) {
  const book = repository.findBook(bookUid);
  if (!book) return failure(404, "book not found");
  return success(200, "Success", { ...mapBook(book), records: repository.getBookRecords(book.id) });
}

export function updateBookContents(bookUid: string, body: unknown) {
  const book = repository.findBook(bookUid);
  if (!book) return failure(404, "book not found");
  if (book.status !== "draft") return failure(400, "only draft books can be edited");

  const records = repository.selectedRecordIds(book.pet_id, body);
  if (records.length === 0) return failure(400, "no records selected");

  repository.replaceBookContents(book.id, records);
  const updated = repository.findBook(bookUid);
  return success(200, "Book contents updated", { ...mapBook(updated), records: repository.getBookRecords(book.id) });
}

export function finalizeBook(bookUid: string) {
  const book = repository.findBook(bookUid);
  if (!book) return failure(404, "book not found");
  if (book.record_count < 1) return failure(400, "book contents are required before finalization");

  return success(200, "Book finalized", mapBook(repository.finalizeBook(book.id)));
}
