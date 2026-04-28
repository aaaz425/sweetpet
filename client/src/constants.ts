import type { OrderStatus, Page } from "./types";

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

export function getPageFromPath(pathname: string): Page {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  if (normalizedPath === "/") return "records";

  const matchingPage = Object.entries(pagePaths).find(([, path]) => path === normalizedPath)?.[0];
  return matchingPage ? (matchingPage as Page) : "records";
}

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "대기",
  processing: "진행 중",
  completed: "완료"
};

export const userNavItems: Page[] = ["pets", "records", "albums"];

export const adminNavItems: Page[] = ["admin-orders"];
