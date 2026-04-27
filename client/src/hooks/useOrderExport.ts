import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { exportOrder } from "../api/orders";
import { pagePaths } from "../constants";
import type { Order } from "../types";

export function useOrderExport() {
  const navigate = useNavigate();
  const [exportJson, setExportJson] = useState("");

  async function handleExportOrder(order: Order) {
    if (!order.orderUid) return;

    const exportedOrder = await exportOrder(order.orderUid);
    setExportJson(JSON.stringify(exportedOrder, null, 2));
    navigate(pagePaths.export);
  }

  return {
    exportJson,
    handleExportOrder
  };
}
