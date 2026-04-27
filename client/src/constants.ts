import type { OrderStatus, Page } from "./types";

export const pageLabels: Record<Page, string> = {
  pets: "마이펫",
  records: "일상기록",
  orders: "주문하기",
  "my-orders": "내 주문",
  "admin-orders": "주문 관리",
  export: "내보내기"
};

export const pagePaths: Record<Page, string> = {
  pets: "/pets",
  records: "/records",
  orders: "/orders",
  "my-orders": "/my-orders",
  "admin-orders": "/admin/orders",
  export: "/export"
};

export function getPageFromPath(pathname: string): Page {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  if (normalizedPath === "/") return "records";

  const matchingPage = Object.entries(pagePaths).find(([, path]) => path === normalizedPath)?.[0];
  return matchingPage ? (matchingPage as Page) : "records";
}

export const pageSummaries: Record<Page, string> = {
  pets: "마이펫 정보를 관리하고 현재 작업 대상을 선택합니다.",
  records: "일상기록을 작성하고 누적된 내용을 검토합니다.",
  orders: "선택한 기간의 일상기록으로 주문 데이터를 만듭니다.",
  "my-orders": "현재 마이펫의 주문 상태를 확인합니다.",
  "admin-orders": "접수된 주문의 상태를 관리하고 JSON 내보내기를 준비합니다.",
  export: "주문에서 생성된 구조화 JSON 데이터를 확인합니다."
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "대기",
  processing: "진행 중",
  completed: "완료"
};

export const userNavItems: Page[] = ["pets", "records", "orders", "my-orders"];

export const adminNavItems: Page[] = ["admin-orders"];
