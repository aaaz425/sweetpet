export type Page = "pets" | "records" | "orders" | "export";

export type Pet = {
  id: number;
  name: string;
  species: string;
  breed: string;
  birthday: string;
  memo: string;
  image_path: string | null;
};

export type RecordItem = {
  id: number;
  pet_id: number;
  record_date: string;
  weight: number | null;
  condition: string;
  memo: string;
  tags: string[];
  image_path: string | null;
};

export type Order = {
  id: number;
  orderUid: string;
  bookId: number;
  pet_id: number;
  petId: number;
  title: string;
  start_date: string;
  startDate: string;
  end_date: string;
  endDate: string;
  status: "pending" | "processing" | "completed";
  recordCount: number;
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
