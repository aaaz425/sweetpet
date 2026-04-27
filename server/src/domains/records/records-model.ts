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
  return { ...row, tags: parseJson(row.tags, []) };
}
