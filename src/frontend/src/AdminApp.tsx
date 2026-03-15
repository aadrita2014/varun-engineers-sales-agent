import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { useActor } from "@/hooks/useActor";
import {
  LayoutDashboard,
  Lock,
  LogOut,
  MapPin,
  Package,
  ShoppingCart,
  TrendingUp,
  Wrench,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminDashboard from "./admin/AdminDashboard";
import AgentTrackingAdmin from "./admin/AgentTrackingAdmin";
import InventoryAdmin from "./admin/InventoryAdmin";
import OrdersAdmin from "./admin/OrdersAdmin";
import SalesAdmin from "./admin/SalesAdmin";
import ServiceRequestsAdmin from "./admin/ServiceRequestsAdmin";
import {
  Variant_closed_in_progress_open,
  Variant_pending_dispatched_delivered_confirmed,
} from "./backend.d";

const ADMIN_PASSWORD = "varun2024";
const AUTH_KEY = "admin_auth";
const SEEDED_KEY = "admin_seeded";

export type AdminView =
  | "dashboard"
  | "inventory"
  | "orders"
  | "sales"
  | "service"
  | "tracking";

const navItems: { id: AdminView; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "inventory", label: "Inventory", icon: <Package size={18} /> },
  { id: "orders", label: "Orders", icon: <ShoppingCart size={18} /> },
  { id: "sales", label: "Sales Records", icon: <TrendingUp size={18} /> },
  { id: "service", label: "Service Requests", icon: <Wrench size={18} /> },
  { id: "tracking", label: "Agent Tracking", icon: <MapPin size={18} /> },
];

function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "1");
      onAuth();
    } else {
      setError("Invalid password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center admin-bg">
      <div className="admin-login-card">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/assets/uploads/New-logo-1536x500-3-1.png"
            alt="Varun Engineers"
            className="h-12 object-contain mb-6"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="flex items-center gap-2 mb-2">
            <Lock size={18} className="text-[oklch(0.55_0.18_22)]" />
            <h1
              className="text-xl font-bold text-[oklch(0.13_0.03_245)]"
              style={{
                fontFamily: "Bricolage Grotesque, system-ui, sans-serif",
              }}
            >
              Admin Panel
            </h1>
          </div>
          <p className="text-sm text-[oklch(0.5_0.02_245)]">
            Sign in to manage your operations
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="admin-pwd"
              className="text-[oklch(0.35_0.03_245)] text-sm font-semibold"
            >
              Password
            </Label>
            <Input
              id="admin-pwd"
              type="password"
              value={pwd}
              onChange={(e) => {
                setPwd(e.target.value);
                setError("");
              }}
              placeholder="Enter admin password"
              className="mt-1 admin-input"
              data-ocid="login.input"
              autoFocus
            />
          </div>
          {error && (
            <p className="text-xs text-red-600" data-ocid="login.error_state">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full admin-btn-primary"
            data-ocid="login.submit_button"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [authed, setAuthed] = useState(
    () => localStorage.getItem(AUTH_KEY) === "1",
  );
  const [view, setView] = useState<AdminView>("dashboard");
  const { actor } = useActor();

  // Seed data once
  useEffect(() => {
    if (!actor || localStorage.getItem(SEEDED_KEY)) return;
    const seed = async () => {
      try {
        // Products
        await Promise.all([
          actor.addProduct(
            "Centrifugal Water Pump",
            "VE-CWP-001",
            "Pumps",
            BigInt(45),
            12500,
          ),
          actor.addProduct(
            "Industrial AC Motor 5HP",
            "VE-ACM-002",
            "Motors",
            BigInt(30),
            28000,
          ),
          actor.addProduct(
            "Gate Valve 2 inch",
            "VE-GV-003",
            "Valves",
            BigInt(120),
            1850,
          ),
          actor.addProduct(
            "Pressure Gauge 0-10 Bar",
            "VE-PG-004",
            "Instruments",
            BigInt(75),
            2200,
          ),
          actor.addProduct(
            "Submersible Pump 1HP",
            "VE-SP-005",
            "Pumps",
            BigInt(22),
            8500,
          ),
        ]);
        // Orders
        const orders = await Promise.all([
          actor.createOrder(
            "9876543210",
            "Rajesh Kumar",
            "Tata Steel Ltd",
            "9811234567",
            [
              {
                productName: "Centrifugal Water Pump",
                quantity: BigInt(2),
                unitPrice: 12500,
              },
            ],
            25000,
          ),
          actor.createOrder(
            "9876543211",
            "Priya Sharma",
            "Reliance Industries",
            "9822345678",
            [
              {
                productName: "Industrial AC Motor 5HP",
                quantity: BigInt(1),
                unitPrice: 28000,
              },
            ],
            28000,
          ),
          actor.createOrder(
            "9876543212",
            "Amit Singh",
            "Larsen & Toubro",
            "9833456789",
            [
              {
                productName: "Gate Valve 2 inch",
                quantity: BigInt(10),
                unitPrice: 1850,
              },
            ],
            18500,
          ),
          actor.createOrder(
            "9876543213",
            "Sunita Patel",
            "BHEL Bhopal",
            "9844567890",
            [
              {
                productName: "Pressure Gauge 0-10 Bar",
                quantity: BigInt(5),
                unitPrice: 2200,
              },
            ],
            11000,
          ),
          actor.createOrder(
            "9876543210",
            "Rajesh Kumar",
            "Hindustan Unilever",
            "9855678901",
            [
              {
                productName: "Submersible Pump 1HP",
                quantity: BigInt(3),
                unitPrice: 8500,
              },
            ],
            25500,
          ),
        ]);
        // Update some order statuses
        await actor.updateOrderStatus(
          orders[0].id,
          Variant_pending_dispatched_delivered_confirmed.confirmed,
        );
        await actor.updateOrderStatus(
          orders[1].id,
          Variant_pending_dispatched_delivered_confirmed.dispatched,
        );
        await actor.updateOrderStatus(
          orders[2].id,
          Variant_pending_dispatched_delivered_confirmed.delivered,
        );
        // Sales Records
        const now = BigInt(Date.now()) * BigInt(1_000_000);
        await Promise.all([
          actor.addSalesRecord(
            "9876543210",
            "Rajesh Kumar",
            "Tata Steel Ltd",
            now,
            [
              {
                productName: "Centrifugal Water Pump",
                quantity: BigInt(2),
                amount: 25000,
              },
            ],
            25000,
            "NEFT",
          ),
          actor.addSalesRecord(
            "9876543211",
            "Priya Sharma",
            "Reliance Industries",
            now,
            [
              {
                productName: "Industrial AC Motor 5HP",
                quantity: BigInt(1),
                amount: 28000,
              },
            ],
            28000,
            "Cheque",
          ),
          actor.addSalesRecord(
            "9876543212",
            "Amit Singh",
            "Larsen & Toubro",
            now,
            [
              {
                productName: "Gate Valve 2 inch",
                quantity: BigInt(10),
                amount: 18500,
              },
            ],
            18500,
            "Cash",
          ),
          actor.addSalesRecord(
            "9876543213",
            "Sunita Patel",
            "BHEL Bhopal",
            now,
            [
              {
                productName: "Pressure Gauge 0-10 Bar",
                quantity: BigInt(5),
                amount: 11000,
              },
            ],
            11000,
            "UPI",
          ),
          actor.addSalesRecord(
            "9876543210",
            "Rajesh Kumar",
            "Hindustan Unilever",
            now,
            [
              {
                productName: "Submersible Pump 1HP",
                quantity: BigInt(3),
                amount: 25500,
              },
            ],
            25500,
            "RTGS",
          ),
        ]);
        // Service Requests
        const srs = await Promise.all([
          actor.createServiceRequest(
            "Tata Steel Ltd",
            "9811234567",
            "Pump vibration issue at Unit 3 - urgent inspection required",
            "9876543210",
            "Rajesh Kumar",
          ),
          actor.createServiceRequest(
            "Reliance Industries",
            "9822345678",
            "Motor overheating after 2 hours of continuous operation",
            "9876543211",
            "Priya Sharma",
          ),
          actor.createServiceRequest(
            "Larsen & Toubro",
            "9833456789",
            "Valve leakage in high pressure line, needs replacement",
            "9876543212",
            "Amit Singh",
          ),
        ]);
        await actor.updateServiceRequest(
          srs[1].id,
          Variant_closed_in_progress_open.in_progress,
        );
        // Agent Locations
        await Promise.all([
          actor.updateAgentLocation(
            "9876543210",
            "Rajesh Kumar",
            "Mumbai North",
            "Andheri East",
            true,
          ),
          actor.updateAgentLocation(
            "9876543211",
            "Priya Sharma",
            "Pune West",
            "Hinjawadi",
            true,
          ),
          actor.updateAgentLocation(
            "9876543212",
            "Amit Singh",
            "Delhi NCR",
            "Gurgaon Sector 44",
            true,
          ),
          actor.updateAgentLocation(
            "9876543213",
            "Sunita Patel",
            "Ahmedabad",
            "Naroda GIDC",
            false,
          ),
          actor.updateAgentLocation(
            "9876543214",
            "Vikram Nair",
            "Chennai South",
            "Guindy Industrial Estate",
            true,
          ),
        ]);
        localStorage.setItem(SEEDED_KEY, "1");
        toast.success("Sample data loaded successfully");
      } catch (err) {
        console.error("Seed error:", err);
      }
    };
    seed();
  }, [actor]);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  if (!authed) {
    return (
      <>
        <LoginGate onAuth={() => setAuthed(true)} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden admin-app-bg">
      {/* Sidebar */}
      <aside className="admin-sidebar flex flex-col w-56 min-w-[14rem] shrink-0">
        <div className="p-4 border-b border-[oklch(0.22_0.03_245)] flex items-center justify-center">
          <img
            src="/assets/uploads/New-logo-1536x500-3-1.png"
            alt="Varun Engineers"
            className="h-9 object-contain"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = "none";
              const fb = document.createElement("span");
              fb.textContent = "Varun Engineers";
              fb.className = "text-white font-bold text-sm";
              el.parentNode?.appendChild(fb);
            }}
          />
        </div>
        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setView(item.id)}
              data-ocid={`nav.${item.id}.link`}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                view === item.id
                  ? "bg-[oklch(0.55_0.18_22)] text-white shadow-md"
                  : "text-[oklch(0.78_0.03_245)] hover:bg-[oklch(0.2_0.04_245)] hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-[oklch(0.22_0.03_245)]">
          <div className="text-xs text-[oklch(0.5_0.02_245)] mb-2 px-2">
            Signed in as Admin
          </div>
          <button
            type="button"
            onClick={handleLogout}
            data-ocid="nav.logout.button"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[oklch(0.65_0.04_25)] hover:bg-[oklch(0.2_0.04_245)] hover:text-[oklch(0.75_0.12_22)] transition-all"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="admin-header flex items-center justify-between px-6 py-3.5 border-b">
          <div>
            <h1
              className="text-lg font-bold text-[oklch(0.15_0.03_245)]"
              style={{
                fontFamily: "Bricolage Grotesque, system-ui, sans-serif",
              }}
            >
              {navItems.find((n) => n.id === view)?.label ?? "Admin Panel"}
            </h1>
            <p className="text-xs text-[oklch(0.55_0.02_245)]">
              Varun Engineers — Admin Panel
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            data-ocid="header.logout.button"
            className="text-xs border-[oklch(0.82_0.03_245)] text-[oklch(0.45_0.03_245)] hover:text-[oklch(0.55_0.18_22)] hover:border-[oklch(0.55_0.18_22)]"
          >
            <LogOut size={14} className="mr-1" />
            Logout
          </Button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {view === "dashboard" && <AdminDashboard />}
          {view === "inventory" && <InventoryAdmin />}
          {view === "orders" && <OrdersAdmin />}
          {view === "sales" && <SalesAdmin />}
          {view === "service" && <ServiceRequestsAdmin />}
          {view === "tracking" && <AgentTrackingAdmin />}
        </main>
      </div>
    </div>
  );
}
