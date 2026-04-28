export type Page = "home" | "pets" | "records" | "albums" | "admin-orders" | "export";

export type JsonObject = Record<string, unknown>;

export type PrintOptions = {
  size: "a5" | "b5";
  binding: "softcover" | "hardcover";
  paper: "matte" | "glossy";
  quantity: number;
};

export type Pet = {
  id: number;
  name: string;
  species: string;
  breed: string | null;
  birthday: string | null;
  memo: string | null;
  imagePath: string | null;
  createdAt: string;
};

export type RecordItem = {
  id: number;
  petId: number;
  recordDate: string;
  weight: number | null;
  condition: string;
  memo: string;
  tags: string[];
  imagePath: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BookStatus = "draft" | "finalized" | string;

export type Book = {
  id: number;
  bookUid: string;
  petId: number;
  title: string;
  startDate: string | null;
  endDate: string | null;
  status: BookStatus;
  printOptions: JsonObject;
  finalizedAt: string | null;
  createdAt: string;
  updatedAt: string;
  recordCount: number;
  records?: RecordItem[];
};

export type BookRecord = {
  bookId: number;
  recordId: number;
};

export type OrderStatus = "pending" | "processing" | "completed";

export type Order = {
  id: number;
  orderUid: string | null;
  bookId: number | null;
  petId: number;
  title: string;
  startDate: string;
  endDate: string;
  status: OrderStatus;
  printOptions: JsonObject;
  createdAt: string;
  updatedAt: string;
  recordCount: number;
};

export type OrderExport = {
  service: string;
  exportVersion: string;
  generatedAt: string;
  order: Order;
  book: Book | null;
  pet?: Pet;
  selectedRecords: RecordItem[];
  printOptions: JsonObject;
};

export type CreatePetInput = {
  name: string;
  species: string;
  breed?: string;
  birthday?: string;
  memo?: string;
  photo?: File | null;
};

export type CreateRecordInput = {
  recordDate: string;
  weight?: number | null;
  condition: string;
  memo: string;
  tags?: string[];
  photo?: File | null;
};

export type CreateOrderInput = {
  petId: number;
  title: string;
  startDate: string;
  endDate: string;
  printOptions: PrintOptions;
};

export type PetFormState = {
  name: string;
  species: string;
  breed: string;
  birthday: string;
  memo: string;
  photo: File | null;
};

export type RecordFormState = {
  recordDate: string;
  weight: string;
  condition: string;
  memo: string;
  tags: string;
  photo: File | null;
};

export type OrderFormState = {
  title: string;
  startDate: string;
  endDate: string;
  printOptions: PrintOptions;
};
