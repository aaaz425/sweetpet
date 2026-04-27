import { useOrderExport } from "./useOrderExport";
import { useOrders } from "./useOrders";
import { usePets } from "./usePets";
import { useRecords } from "./useRecords";

export function useSweetpetApp() {
  const pets = usePets();
  const records = useRecords({ selectedPetId: pets.selectedPetId });
  const orders = useOrders({ selectedPetId: pets.selectedPetId });
  const orderExport = useOrderExport();

  return {
    exportJson: orderExport.exportJson,
    orders: orders.orders,
    pets: pets.pets,
    records: records.records,
    selectedOrders: orders.selectedOrders,
    selectedPet: pets.selectedPet,
    selectedPetId: pets.selectedPetId,
    selectedRecords: records.selectedRecords,
    handleCreateOrder: orders.handleCreateOrder,
    handleCreatePet: pets.handleCreatePet,
    handleCreateRecord: records.handleCreateRecord,
    handleDeleteRecord: records.handleDeleteRecord,
    handleExportOrder: orderExport.handleExportOrder,
    handleUpdateOrderStatus: orders.handleUpdateOrderStatus,
    setSelectedPetId: pets.setSelectedPetId
  };
}
