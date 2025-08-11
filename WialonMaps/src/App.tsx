import { useEffect, useState } from "react";
import { DashboardLayout } from "./components/Dashboard/DashboardLayout";
import { WialonLoader } from "./components/ui/WialonLoader";
import { useWialon } from "./hooks/useWialon";

const App = () => {
  const { initialize, loading, error } = useWialon();
  const [activeTab, setActiveTab] = useState("units");

  useEffect(() => {
    // The type system now correctly recognizes VITE_WIALON_TOKEN
    // as an optional string by using an inline type assertion.
    const token = (import.meta.env as { VITE_WIALON_TOKEN?: string }).VITE_WIALON_TOKEN;
    initialize(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <WialonLoader />;
  if (error) return <div className="error-screen">Error: {error.message}</div>;

  return <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab} />;
};

export default App;
