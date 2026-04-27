import { Navigate, Route, Routes } from "react-router-dom";
import { AdminOrdersPage } from "../pages/AdminOrdersPage";
import { ExportPage } from "../pages/ExportPage";
import { MyOrdersPage } from "../pages/MyOrdersPage";
import { OrdersPage } from "../pages/OrdersPage";
import { PetsPage } from "../pages/PetsPage";
import { RecordsPage } from "../pages/RecordsPage";
import type { useSweetpetApp } from "../hooks/useSweetpetApp";
import { pagePaths } from "../constants";

type AppRoutesProps = {
  app: ReturnType<typeof useSweetpetApp>;
};

export function AppRoutes({ app }: AppRoutesProps) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={pagePaths.records} replace />} />
      <Route
        path={pagePaths.pets}
        element={
          <PetsPage
            pets={app.pets}
            selectedPetId={app.selectedPetId}
            petForm={app.petForm}
            setPetForm={app.setPetForm}
            onSelectPet={app.setSelectedPetId}
            onCreatePet={app.handleCreatePet}
          />
        }
      />
      <Route
        path={pagePaths.records}
        element={
          <RecordsPage
            records={app.selectedRecords}
            recordForm={app.recordForm}
            selectedPetId={app.selectedPetId}
            setRecordForm={app.setRecordForm}
            onCreateRecord={app.handleCreateRecord}
            onDeleteRecord={app.handleDeleteRecord}
          />
        }
      />
      <Route
        path={pagePaths.orders}
        element={
          <OrdersPage
            orderForm={app.orderForm}
            selectedPetId={app.selectedPetId}
            setOrderForm={app.setOrderForm}
            onCreateOrder={app.handleCreateOrder}
          />
        }
      />
      <Route path={pagePaths["my-orders"]} element={<MyOrdersPage orders={app.selectedOrders} />} />
      <Route
        path={pagePaths["admin-orders"]}
        element={
          <AdminOrdersPage
            orders={app.orders}
            onUpdateOrderStatus={app.handleUpdateOrderStatus}
            onExportOrder={app.handleExportOrder}
          />
        }
      />
      <Route path={pagePaths.export} element={<ExportPage exportJson={app.exportJson} />} />
      <Route path="*" element={<Navigate to={pagePaths.records} replace />} />
    </Routes>
  );
}
