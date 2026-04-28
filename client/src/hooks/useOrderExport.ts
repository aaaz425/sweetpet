import { useState } from "react";
import { toast } from "sonner";
import { exportOrder } from "../api/orders";
import type { Order } from "../types";

export function useOrderExport() {
  const [exportJson, setExportJson] = useState("");

  async function handleExportOrder(order: Order) {
    if (!order.orderUid) return null;

    try {
      const exportedOrder = await exportOrder(order.orderUid);
      const nextExportJson = JSON.stringify(exportedOrder, null, 2);
      setExportJson(nextExportJson);
      toast.success("내보내기 데이터가 준비되었습니다.");
      return nextExportJson;
    } catch {
      toast.error("내보내기 준비 중 문제가 발생했습니다.");
      return null;
    }
  }

  async function handleExportOrders(orders: Order[]) {
    const exportableOrders = orders.filter((order) => order.orderUid);
    if (exportableOrders.length === 0) return null;

    try {
      const exportedOrders = await Promise.all(exportableOrders.map((order) => exportOrder(order.orderUid ?? "")));
      const nextExportJson = JSON.stringify(
        {
          service: "sweetpet",
          exportVersion: "batch-1",
          generatedAt: new Date().toISOString(),
          orderCount: exportedOrders.length,
          orders: exportedOrders
        },
        null,
        2
      );
      setExportJson(nextExportJson);
      toast.success(`${exportedOrders.length}건의 내보내기 데이터가 준비되었습니다.`);
      return nextExportJson;
    } catch {
      toast.error("내보내기 일괄 준비 중 문제가 발생했습니다.");
      return null;
    }
  }

  return {
    exportJson,
    handleExportOrder,
    handleExportOrders
  };
}
