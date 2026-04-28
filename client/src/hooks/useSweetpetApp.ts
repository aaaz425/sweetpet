import { useOrderExport } from "./useOrderExport";
import { useOrders } from "./useOrders";
import { usePets } from "./usePets";
import { useRecords } from "./useRecords";

export function useSweetpetApp() {
  const pets = usePets();
  const records = useRecords();
  const orders = useOrders();
  const orderExport = useOrderExport();

  return {
    exportJson: orderExport.exportJson,
    orders: orders.orders,
    pets: pets.pets,
    records: records.records,
    handleCreateOrder: orders.handleCreateOrder,
    handleCreatePet: pets.handleCreatePet,
    handleDeletePet: pets.handleDeletePet,
    handleUpdatePet: pets.handleUpdatePet,
    handleCreateRecord: records.handleCreateRecord,
    handleDeleteRecord: records.handleDeleteRecord,
    handleExportOrder: orderExport.handleExportOrder,
    handleExportOrders: orderExport.handleExportOrders,
    handleUpdateOrder: orders.handleUpdateOrder,
    handleUpdateOrdersStatus: orders.handleUpdateOrdersStatus,
    handleUpdateOrderStatus: orders.handleUpdateOrderStatus
  };
}
