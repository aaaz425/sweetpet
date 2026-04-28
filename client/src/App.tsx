import { useLocation, useNavigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { getPageFromPath, pagePaths } from "./constants";
import { useSweetpetApp } from "./hooks/useSweetpetApp";
import { AppRoutes } from "./routes/AppRoutes";
import type { Page } from "./types";

export function App() {
  const app = useSweetpetApp();
  const location = useLocation();
  const navigate = useNavigate();
  const activePage = getPageFromPath(location.pathname);

  function handleSelectPage(page: Page) {
    navigate(pagePaths[page]);
  }

  return (
    <Layout
      activePage={activePage}
      onSelectPage={handleSelectPage}
    >
      <AppRoutes app={app} />
    </Layout>
  );
}
