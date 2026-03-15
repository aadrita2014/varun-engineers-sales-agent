import { Toaster } from "@/components/ui/sonner";
import React, { useEffect, useState } from "react";
import AdminApp from "./AdminApp";
import AttendanceScreen from "./screens/AttendanceScreen";
import CollectionsScreen from "./screens/CollectionsScreen";
import CustomerListScreen from "./screens/CustomerListScreen";
import DashboardScreen from "./screens/DashboardScreen";
import LoginScreen from "./screens/LoginScreen";
import NewOrderScreen from "./screens/NewOrderScreen";
import ProductCatalogScreen from "./screens/ProductCatalogScreen";
import SalesReportsScreen from "./screens/SalesReportsScreen";
import SplashScreen from "./screens/SplashScreen";

type Screen =
  | "splash"
  | "login"
  | "dashboard"
  | "new-order"
  | "customers"
  | "reports"
  | "products"
  | "attendance"
  | "collections";

const isAdminView = window.location.search.includes("view=admin");

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");

  useEffect(() => {
    if (screen === "splash") {
      const timer = setTimeout(() => setScreen("login"), 2500);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  if (isAdminView) {
    return (
      <>
        <AdminApp />
        <Toaster />
      </>
    );
  }

  const handleLoginSuccess = () => setScreen("dashboard");
  const backToDashboard = () => setScreen("dashboard");

  return (
    <>
      {/* Desktop centering wrapper */}
      <div
        className="min-h-screen flex items-stretch justify-center"
        style={{ background: "oklch(0.12 0.03 245)" }}
      >
        <div className="mobile-shell w-full">
          {screen === "splash" && <SplashScreen />}
          {screen === "login" && (
            <LoginScreen onLoginSuccess={handleLoginSuccess} />
          )}
          {screen === "dashboard" && (
            <DashboardScreen onNavigate={(s) => setScreen(s as Screen)} />
          )}
          {screen === "new-order" && (
            <NewOrderScreen onBack={backToDashboard} />
          )}
          {screen === "customers" && (
            <CustomerListScreen onBack={backToDashboard} />
          )}
          {screen === "reports" && (
            <SalesReportsScreen onBack={backToDashboard} />
          )}
          {screen === "products" && (
            <ProductCatalogScreen onBack={backToDashboard} />
          )}
          {screen === "attendance" && (
            <AttendanceScreen onBack={backToDashboard} />
          )}
          {screen === "collections" && (
            <CollectionsScreen onBack={backToDashboard} />
          )}
        </div>
      </div>
      <Toaster />
    </>
  );
}
