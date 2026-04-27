export function parseTags(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((tag) => tag.trim()).filter(Boolean);
  return [];
}

export function parseJson(value: unknown, fallback: unknown) {
  if (typeof value !== "string") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function mapRecord(row: any) {
  if (!row) return undefined;
  return {
    id: row.id,
    petId: row.pet_id,
    recordDate: row.record_date,
    weight: row.weight,
    condition: row.condition,
    memo: row.memo,
    tags: parseJson(row.tags, []),
    imagePath: row.image_path ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
