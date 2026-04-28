import { ChevronDown } from "lucide-react";
import { orderStatusLabels } from "../../constants";
import type { OrderStatus } from "../../types";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

type AdminOrderBulkActionsProps = {
  selectedCount: number;
  isExporting: boolean;
  onExportOrders: () => void;
  onUpdateStatus: (status: OrderStatus) => void;
};

const orderStatuses: OrderStatus[] = ["pending", "processing", "completed", "canceled"];

export function AdminOrderBulkActions({
  selectedCount,
  isExporting,
  onExportOrders,
  onUpdateStatus
}: AdminOrderBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-20 left-1/2 z-40 flex max-w-[calc(100vw-40px)] -translate-x-1/2 flex-wrap items-center gap-2 rounded-xl border-2 border-primary bg-surface p-3 shadow-xl sm:bottom-28 sm:left-auto sm:right-32 sm:translate-x-0">
      <span className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-surface">{selectedCount}건 선택</span>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="min-h-9 whitespace-nowrap px-3 py-2">
              상태 변경
              <ChevronDown aria-hidden="true" size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>선택 주문 상태</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {orderStatuses.map((status) => (
              <DropdownMenuItem key={status} onSelect={() => onUpdateStatus(status)}>
                {orderStatusLabels[status]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button className="min-h-9 whitespace-nowrap px-3 py-2" disabled={isExporting} onClick={onExportOrders}>
          {isExporting ? "준비 중" : "JSON 보기"}
        </Button>
      </div>
    </div>
  );
}
