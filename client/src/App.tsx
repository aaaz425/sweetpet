import { Layout } from "./components/layout/Layout";
import { useSweetpetApp } from "./hooks/useSweetpetApp";
import { AppRoutes } from "./routes/AppRoutes";

export function App() {
  const app = useSweetpetApp();

  return (
    <Layout
      activePage={app.activePage}
      pets={app.pets}
      selectedPet={app.selectedPet}
      selectedPetId={app.selectedPetId}
      recordCount={app.selectedRecords.length}
      orderCount={app.selectedOrders.length}
      onSelectPage={app.setActivePage}
      onSelectPet={app.setSelectedPetId}
    >
      <AppRoutes app={app} />
    </Layout>
  );
}
