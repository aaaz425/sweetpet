const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
};

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, options);
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.errors?.join(", ") || payload.message || `API request failed: ${response.status}`);
  }

  return payload.data;
}

export function appendIfPresent(formData: FormData, key: string, value: string | number | File | null | undefined) {
  if (value === null || value === undefined || value === "") return;
  formData.append(key, value instanceof File ? value : String(value));
}

export function assetUrl(path: string | null) {
  return path ? `${apiUrl}${path}` : "";
}

