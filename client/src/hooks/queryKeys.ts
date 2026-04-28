export const queryKeys = {
  orders: ["orders"],
  pets: ["pets"],
  records: ["records"],
  recordsInfinite: (petId: number | null) => ["records", "infinite", petId] as const
} as const;
