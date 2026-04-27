export function mapPet(row: any) {
  if (!row) return undefined;
  return {
    id: row.id,
    name: row.name,
    species: row.species,
    breed: row.breed ?? null,
    birthday: row.birthday ?? null,
    memo: row.memo ?? null,
    imagePath: row.image_path ?? null,
    createdAt: row.created_at
  };
}
