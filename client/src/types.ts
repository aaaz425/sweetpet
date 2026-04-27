export type Page = "pets" | "records" | "orders" | "my-orders" | "admin-orders" | "export";

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

export type Book = {
  id: number;
  bookUid: string;
  petId: number;
  title: string;
  startDate: string | null;
  endDate: string | null;
  status: string;
  templateUid: string;
  bookSpecUid: string;
  printOptions: Record<string, unknown>;
  finalizedAt: string | null;
  createdAt: string;
  updatedAt: string;
  recordCount: number;
  records?: RecordItem[];
};

export type Order = {
  id: number;
  orderUid: string | null;
  bookId: number | null;
  petId: number;
  title: string;
  startDate: string;
  endDate: string;
  status: "pending" | "processing" | "completed";
  printOptions: Record<string, unknown>;
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
  printOptions: Record<string, unknown>;
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
};
