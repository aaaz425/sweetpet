import { AdminOrdersPage } from "../pages/AdminOrdersPage";
import { ExportPage } from "../pages/ExportPage";
import { MyOrdersPage } from "../pages/MyOrdersPage";
import { OrdersPage } from "../pages/OrdersPage";
import { PetsPage } from "../pages/PetsPage";
import { RecordsPage } from "../pages/RecordsPage";
import type { useSweetpetApp } from "../hooks/useSweetpetApp";

type AppRoutesProps = {
  app: ReturnType<typeof useSweetpetApp>;
};

export function AppRoutes({ app }: AppRoutesProps) {
  if (app.activePage === "pets") {
    return (
      <PetsPage
        pets={app.pets}
        selectedPetId={app.selectedPetId}
        petForm={app.petForm}
        setPetForm={app.setPetForm}
        onSelectPet={app.setSelectedPetId}
        onCreatePet={app.handleCreatePet}
      />
    );
  }

  if (app.activePage === "records") {
    return (
      <RecordsPage
        records={app.selectedRecords}
        recordForm={app.recordForm}
        selectedPetId={app.selectedPetId}
        setRecordForm={app.setRecordForm}
        onCreateRecord={app.handleCreateRecord}
        onDeleteRecord={app.handleDeleteRecord}
      />
    );
  }

  if (app.activePage === "orders") {
    return (
      <OrdersPage
        orderForm={app.orderForm}
        selectedPetId={app.selectedPetId}
        setOrderForm={app.setOrderForm}
        onCreateOrder={app.handleCreateOrder}
      />
    );
  }

  if (app.activePage === "my-orders") {
    return <MyOrdersPage orders={app.selectedOrders} onExportOrder={app.handleExportOrder} />;
  }

  if (app.activePage === "admin-orders") {
    return (
      <AdminOrdersPage
        orders={app.orders}
        onUpdateOrderStatus={app.handleUpdateOrderStatus}
        onExportOrder={app.handleExportOrder}
      />
    );
  }

  return <ExportPage exportJson={app.exportJson} />;
}
