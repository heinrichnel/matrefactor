import { useEffect, useState } from "react";
import { DashboardLayout } from "./components/Dashboard/DashboardLayout";
import { WialonLoader } from "./components/ui/WialonLoader";
import { useWialon } from "./hooks/useWialon";

const App = () => {
  const { initialize, loading, error } = useWialon();
  const [activeTab, setActiveTab] = useState("units");

  useEffect(() => {
    // Use optional token from environment if provided (Vite style env var)
    const token = (import.meta as any).env?.VITE_WIALON_TOKEN as string | undefined;
    initialize(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <WialonLoader />;
  if (error) return <div className="error-screen">Error: {error.message}</div>;

  return <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab} />;
};

export default App;
