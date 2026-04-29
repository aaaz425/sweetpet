import { ChevronDown, X } from "lucide-react";
import { orderStatusLabels } from "../../constants";
import type { OrderStatus } from "../../types";
import { glassSurfaceClass } from "../ui";
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
  onClearSelection: () => void;
  onExportOrders: () => void;
  onUpdateStatus: (status: OrderStatus) => void;
};

const orderStatuses: OrderStatus[] = ["pending", "processing", "completed", "canceled"];

export function AdminOrderBulkActions({
  selectedCount,
  isExporting,
  onClearSelection,
  onExportOrders,
  onUpdateStatus
}: AdminOrderBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className={`fixed bottom-5 right-5 z-40 flex max-w-[calc(100vw-40px)] flex-wrap items-center gap-2 rounded-xl p-3 sm:bottom-10 sm:right-10 lg:right-[calc((100vw-1120px)/4+2rem)] ${glassSurfaceClass}`}>
      <button
        aria-label="선택 해제"
        className="inline-flex items-center gap-2 rounded-lg bg-primary py-2 pl-3 pr-2 text-sm font-semibold leading-5 text-surface transition duration-150 hover:bg-accent active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft"
        onClick={onClearSelection}
        type="button"
      >
        {selectedCount}건 선택
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-surface/80">
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </button>
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
