import { Route, Routes, useNavigate } from "react-router-dom";
import { NotFoundState } from "../components/feedback/PageState";
import { AdminOrdersPage } from "../pages/AdminOrdersPage";
import { AlbumsPage } from "../pages/AlbumsPage";
import { ExportPage } from "../pages/ExportPage";
import { HomePage } from "../pages/HomePage";
import { PetsPage } from "../pages/PetsPage";
import { RecordsPage } from "../pages/RecordsPage";
import type { useSweetpetApp } from "../hooks/useSweetpetApp";
import { pagePaths } from "../constants";

type AppRoutesProps = {
  app: ReturnType<typeof useSweetpetApp>;
};

export function AppRoutes({ app }: AppRoutesProps) {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path={pagePaths.home} element={<HomePage />} />
      <Route
        path={pagePaths.pets}
        element={
          <PetsPage
            pets={app.pets}
            isPetsError={app.petsStatus.isError}
            onCreatePet={app.handleCreatePet}
            onDeletePet={app.handleDeletePet}
            onUpdatePet={app.handleUpdatePet}
          />
        }
      />
      <Route
        path={pagePaths.records}
        element={
          <RecordsPage
            pets={app.pets}
            isPetsError={app.petsStatus.isError}
            onCreateRecord={app.handleCreateRecord}
            onDeleteRecord={app.handleDeleteRecord}
            onUpdateRecord={app.handleUpdateRecord}
          />
        }
      />
      <Route
        path={pagePaths.albums}
        element={
          <AlbumsPage
            pets={app.pets}
            records={app.records}
            orders={app.orders}
            isOrdersError={app.ordersStatus.isError}
            onCreateOrder={app.handleCreateOrder}
            onUpdateOrder={app.handleUpdateOrder}
            onUpdateOrderStatus={app.handleUpdateOrderStatus}
          />
        }
      />
      <Route
        path={pagePaths["admin-orders"]}
        element={
          <AdminOrdersPage
            orders={app.orders}
            isOrdersError={app.ordersStatus.isError}
            onExportOrders={app.handleExportOrders}
            onUpdateOrderStatus={app.handleUpdateOrderStatus}
            onUpdateOrdersStatus={app.handleUpdateOrdersStatus}
            onExportOrder={app.handleExportOrder}
          />
        }
      />
      <Route path={pagePaths.export} element={<ExportPage exportJson={app.exportJson} />} />
      <Route path="*" element={<NotFoundState onGoHome={() => navigate(pagePaths.home)} />} />
    </Routes>
  );
}
