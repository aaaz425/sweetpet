export type Page = "pets" | "records" | "orders" | "export";

export type Pet = {
  id: number;
  name: string;
  species: string;
  breed: string;
  birthday: string;
  memo: string;
};

export type RecordItem = {
  id: number;
  pet_id: number;
  record_date: string;
  weight: number | null;
  condition: string;
  memo: string;
  tags: string[];
};

export type Order = {
  id: number;
  pet_id: number;
  title: string;
  start_date: string;
  end_date: string;
  status: "pending" | "processing" | "completed";
};

export type PetFormState = {
  name: string;
  species: string;
  breed: string;
  birthday: string;
  memo: string;
};

export type RecordFormState = {
  recordDate: string;
  weight: string;
  condition: string;
  memo: string;
  tags: string;
};

export type OrderFormState = {
  title: string;
  startDate: string;
  endDate: string;
};
