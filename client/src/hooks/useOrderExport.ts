import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { exportOrder } from "../api/orders";
import { pagePaths } from "../constants";
import type { Order } from "../types";

export function useOrderExport() {
  const navigate = useNavigate();
  const [exportJson, setExportJson] = useState("");

  async function handleExportOrder(order: Order) {
    if (!order.orderUid) return;

    try {
      const exportedOrder = await exportOrder(order.orderUid);
      setExportJson(JSON.stringify(exportedOrder, null, 2));
      toast.success("내보내기 데이터가 준비되었습니다.");
      navigate(pagePaths.export);
    } catch {
      toast.error("내보내기 준비 중 문제가 발생했습니다.");
    }
  }

  return {
    exportJson,
    handleExportOrder
  };
}
