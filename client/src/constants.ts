import type { OrderStatus, Page, PrintOptions } from "./types";

export const pageLabels: Record<Page, string> = {
  pets: "마이펫",
  records: "일상기록",
  albums: "앨범북",
  "admin-orders": "주문 관리",
  export: "내보내기"
};

export const pagePaths: Record<Page, string> = {
  pets: "/pets",
  records: "/records",
  albums: "/albums",
  "admin-orders": "/admin/orders",
  export: "/export"
};

export function getPageFromPath(pathname: string): Page | null {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  if (normalizedPath === "/") return "records";

  const matchingPage = Object.entries(pagePaths).find(([, path]) => path === normalizedPath)?.[0];
  return matchingPage ? (matchingPage as Page) : null;
}

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "대기",
  processing: "진행 중",
  completed: "완료"
};

export const userNavItems: Page[] = ["pets", "records", "albums"];

export const adminNavItems: Page[] = ["admin-orders"];

export const defaultPrintOptions: PrintOptions = {
  size: "a5",
  binding: "softcover",
  paper: "matte",
  quantity: 1
};

export const printOptionChoices = {
  size: [
    { value: "a5", label: "A5" },
    { value: "b5", label: "B5" }
  ],
  binding: [
    { value: "softcover", label: "소프트커버" },
    { value: "hardcover", label: "하드커버" }
  ],
  paper: [
    { value: "matte", label: "무광 용지" },
    { value: "glossy", label: "유광 용지" }
  ]
} satisfies {
  [Key in Exclude<keyof PrintOptions, "quantity">]: Array<{ value: PrintOptions[Key]; label: string }>;
};

export function getPrintOptionLabel<Key extends Exclude<keyof PrintOptions, "quantity">>(key: Key, value: unknown) {
  return printOptionChoices[key].find((option) => option.value === value)?.label ?? String(value ?? "-");
}
