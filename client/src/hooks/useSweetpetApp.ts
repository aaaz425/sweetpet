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
    ordersStatus: {
      isLoading: orders.isLoading,
      isError: orders.isError,
      isFetching: orders.isFetching
    },
    pets: pets.pets,
    petsStatus: {
      isLoading: pets.isLoading,
      isError: pets.isError,
      isFetching: pets.isFetching
    },
    records: records.records,
    recordsStatus: {
      isLoading: records.isLoading,
      isError: records.isError,
      isFetching: records.isFetching
    },
    handleCreateOrder: orders.handleCreateOrder,
    handleCreatePet: pets.handleCreatePet,
    handleDeletePet: pets.handleDeletePet,
    handleUpdatePet: pets.handleUpdatePet,
    handleCreateRecord: records.handleCreateRecord,
    handleDeleteRecord: records.handleDeleteRecord,
    handleUpdateRecord: records.handleUpdateRecord,
    handleExportOrder: orderExport.handleExportOrder,
    handleExportOrders: orderExport.handleExportOrders,
    handleUpdateOrder: orders.handleUpdateOrder,
    handleUpdateOrdersStatus: orders.handleUpdateOrdersStatus,
    handleUpdateOrderStatus: orders.handleUpdateOrderStatus
  };
}
