import type { Order, Page } from "./types";

export const pageLabels: Record<Page, string> = {
  pets: "Pets",
  records: "Records",
  orders: "Orders",
  export: "Export"
};

export const pageSummaries: Record<Page, string> = {
  pets: "반려동물 정보를 관리하고 현재 작업 대상을 선택합니다.",
  records: "일상 기록을 작성하고 누적된 기록을 검토합니다.",
  orders: "선택한 기간의 기록으로 주문 데이터를 만듭니다.",
  export: "주문에서 생성된 구조화 JSON 데이터를 확인합니다."
};

export const orderStatusLabels: Record<Order["status"], string> = {
  pending: "대기",
  processing: "진행 중",
  completed: "완료"
};

export const navItems: Page[] = ["pets", "records", "orders", "export"];
