import { mapBook, mapOrder } from "../print/print-model.js";
import { mapPet } from "../pets/pets-model.js";
import { parseJson } from "../records/records-model.js";
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

type CreateOrderInput = {
  bookUid?: string;
  petId?: number;
  title?: string;
  startDate?: string;
  endDate?: string;
  printOptions?: unknown;
};

type PrintOptions = {
  size: "a5" | "b5";
  binding: "softcover" | "hardcover";
  paper: "matte" | "glossy";
  quantity: number;
};

type ValidatedOrderInput = {
  petId: number;
  title: string;
  startDate: string;
  endDate: string;
  records: Array<{ id: number }>;
  printOptions: PrintOptions;
};

const defaultPrintOptions: PrintOptions = {
  size: "a5",
  binding: "softcover",
  paper: "matte",
  quantity: 1
};
const minOrderRecordCount = 5;
const maxOrderRecordCount = 30;

function success<T>(status: number, message: string, data: T): ServiceResult<T> {
  return { ok: true, status, message, data };
}

function failure<T>(status: number, message: string): ServiceResult<T> {
  return { ok: false, status, message };
}

export function normalizePrintOptions(printOptions: unknown): PrintOptions {
  if (!printOptions || typeof printOptions !== "object" || Array.isArray(printOptions)) {
    return defaultPrintOptions;
  }

  const options = printOptions as Partial<Record<keyof PrintOptions, unknown>>;

  return {
    size: options.size === "b5" ? "b5" : defaultPrintOptions.size,
    binding: options.binding === "hardcover" ? "hardcover" : defaultPrintOptions.binding,
    paper: options.paper === "glossy" ? "glossy" : defaultPrintOptions.paper,
    quantity: normalizeQuantity(options.quantity)
  };
}

function normalizeQuantity(quantity: unknown) {
  const numericQuantity = Number(quantity);
  if (!Number.isInteger(numericQuantity)) return defaultPrintOptions.quantity;
  return Math.min(Math.max(numericQuantity, 1), 20);
}

function createOrderFromFinalizedBook(bookUid: string) {
  const book = repository.findBook(bookUid);
  if (!book) return failure(404, "book not found");
  if (book.status !== "finalized") return failure(400, "book must be finalized before ordering");

  const existing = repository.findOrderByBookId(book.id);
  if (existing) return success(200, "Order already exists", mapOrder(existing));

  return success(201, "Order created", mapOrder(repository.createOrderFromBook(book)));
}

function validateOrderInput(input: CreateOrderInput): ServiceResult<ValidatedOrderInput> {
  if (!input.petId || !input.title || !input.startDate || !input.endDate) {
    return failure(400, "petId, title, startDate, and endDate are required");
  }

  const pet = repository.findPet(Number(input.petId));
  if (!pet) return failure(404, "pet not found");

  const records = repository.selectedRecordIds(Number(input.petId), {
    startDate: input.startDate,
    endDate: input.endDate
  });
  if (records.length < minOrderRecordCount) {
    return failure(400, `at least ${minOrderRecordCount} records are required`);
  }
  if (records.length > maxOrderRecordCount) {
    return failure(400, `up to ${maxOrderRecordCount} records can be selected`);
  }

  return success(200, "Valid order input", {
    petId: Number(input.petId),
    title: input.title,
    startDate: input.startDate,
    endDate: input.endDate,
    records,
    printOptions: normalizePrintOptions(input.printOptions)
  });
}

export function createOrder(input: CreateOrderInput) {
  if (input.bookUid) {
    return createOrderFromFinalizedBook(input.bookUid);
  }

  const validated = validateOrderInput(input);
  if (!validated.ok) return validated;

  const book = repository.createBookDraft({
    petId: validated.data.petId,
    title: validated.data.title,
    startDate: validated.data.startDate,
    endDate: validated.data.endDate,
    printOptions: validated.data.printOptions
  });

  repository.replaceBookContents(book.id, validated.data.records);
  repository.finalizeBook(book.id);

  return createOrderFromFinalizedBook(book.book_uid);
}

export function updateOrder(orderUid: string, input: CreateOrderInput) {
  const order = repository.findOrder(orderUid);
  if (!order) return failure(404, "order not found");
  if (order.status !== "pending") return failure(400, "only pending orders can be edited");
  if (!order.book_id) return failure(400, "order is not connected to a book");
  if (Number(input.petId) !== Number(order.pet_id)) return failure(400, "order pet cannot be changed");

  const validated = validateOrderInput(input);
  if (!validated.ok) return validated;

  return success(200, "Order updated", mapOrder(repository.updatePendingOrder(order, {
    petId: validated.data.petId,
    title: validated.data.title,
    startDate: validated.data.startDate,
    endDate: validated.data.endDate,
    printOptions: validated.data.printOptions
  }, validated.data.records)));
}

export function listOrders() {
  return repository.listOrders().map(mapOrder);
}

export function getOrder(orderUid: string) {
  const order = repository.findOrder(orderUid);
  if (!order) return failure(404, "order not found");
  return success(200, "Success", mapOrder(order));
}

export function updateOrderStatus(orderUid: string, status: string) {
  const allowed = ["pending", "processing", "completed", "canceled"];
  if (!allowed.includes(status)) return failure(400, "invalid status");

  const order = repository.findOrder(orderUid);
  if (!order) return failure(404, "order not found");
  if (status === "canceled" && order.status !== "pending") return failure(400, "only pending orders can be canceled");

  return success(200, "Order status updated", mapOrder(repository.updateOrderStatus(order.id, status)));
}

export function exportOrder(orderUid: string) {
  const order = repository.findOrder(orderUid);
  if (!order) return failure(404, "order not found");
  if (!order.book_id) return failure(400, "order is not connected to a book");

  const book = repository.findBookById(order.book_id);
  const pet = repository.findPet(order.pet_id);
  const records = repository.getBookRecords(order.book_id);

  return success(200, "Order export generated", {
    service: "sweetpet",
    exportVersion: "1.0",
    generatedAt: new Date().toISOString(),
    order: mapOrder(order),
    book: mapBook(book),
    pet: mapPet(pet),
    selectedRecords: records,
    printOptions: parseJson(order.print_options, {})
  });
}
