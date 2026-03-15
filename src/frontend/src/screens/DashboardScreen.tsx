import {
  BarChart2,
  Bell,
  CalendarCheck,
  ChevronRight,
  CreditCard,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import React from "react";

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

interface DashboardScreenProps {
  onNavigate: (screen: Screen) => void;
}

const tiles = [
  {
    id: "new-order" as Screen,
    label: "New Order",
    desc: "Place a new order",
    icon: ShoppingCart,
    ocid: "dashboard.new_order_button",
  },
  {
    id: "customers" as Screen,
    label: "Customer List",
    desc: "View all customers",
    icon: Users,
    ocid: "dashboard.customers_button",
  },
  {
    id: "reports" as Screen,
    label: "Sales Reports",
    desc: "View performance",
    icon: BarChart2,
    ocid: "dashboard.reports_button",
  },
  {
    id: "products" as Screen,
    label: "Product Catalog",
    desc: "Browse products",
    icon: Package,
    ocid: "dashboard.products_button",
  },
  {
    id: "attendance" as Screen,
    label: "Attendance",
    desc: "Mark attendance",
    icon: CalendarCheck,
    ocid: "dashboard.attendance_button",
  },
  {
    id: "collections" as Screen,
    label: "Collections",
    desc: "Payments & dues",
    icon: CreditCard,
    ocid: "dashboard.collections_button",
  },
];

export default function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  return (
    <div
      className="flex flex-col min-h-dvh"
      style={{ background: "oklch(0.15 0.04 245)" }}
    >
      {/* Top navbar */}
      <header
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: "oklch(0.13 0.04 245)",
          borderBottom: "1px solid oklch(0.24 0.04 245)",
        }}
      >
        <img
          src="/assets/uploads/New-logo-1536x500-3-1.png"
          alt="Varun Engineers"
          className="h-8 object-contain"
        />
        <button
          type="button"
          className="relative p-2 rounded-full"
          style={{ background: "oklch(0.22 0.035 245)" }}
        >
          <Bell size={20} style={{ color: "oklch(0.85 0.02 245)" }} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "oklch(0.38 0.16 25)" }}
          />
        </button>
      </header>

      {/* Agent profile card */}
      <div className="px-4 pt-4 pb-2">
        <div
          className="flex items-center gap-4 rounded-2xl p-4 shadow-card"
          style={{
            background: "oklch(0.22 0.035 245)",
            border: "1px solid oklch(0.28 0.04 245)",
          }}
        >
          {/* Avatar */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0"
            style={{
              background: "oklch(0.38 0.16 25)",
              color: "oklch(0.97 0.005 0)",
              fontFamily: "'Bricolage Grotesque', sans-serif",
            }}
          >
            RK
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-base font-bold truncate"
              style={{
                color: "oklch(0.97 0.005 245)",
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              Rajesh Kumar
            </p>
            <p className="text-sm" style={{ color: "oklch(0.65 0.025 245)" }}>
              Mumbai North
            </p>
          </div>
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full shrink-0"
            style={{
              background: "oklch(0.38 0.16 25 / 0.2)",
              color: "oklch(0.65 0.12 25)",
              border: "1px solid oklch(0.38 0.16 25 / 0.3)",
            }}
          >
            Field Agent
          </span>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Orders Today", value: "4" },
            { label: "This Month", value: "24" },
            { label: "Pending", value: "₹57.5K" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-3 text-center"
              style={{
                background: "oklch(0.22 0.035 245)",
                border: "1px solid oklch(0.28 0.04 245)",
              }}
            >
              <p
                className="text-base font-bold"
                style={{
                  color: "oklch(0.97 0.005 245)",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                }}
              >
                {stat.value}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "oklch(0.55 0.02 245)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section heading */}
      <div className="px-4 pb-2">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "oklch(0.55 0.02 245)" }}
        >
          Quick Actions
        </p>
      </div>

      {/* Dashboard tiles */}
      <div className="px-4 pb-6 grid grid-cols-2 gap-3">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              type="button"
              key={tile.id}
              data-ocid={tile.ocid}
              className="tile-press flex flex-col items-start p-4 rounded-2xl shadow-card text-left"
              style={{
                background: "oklch(0.22 0.035 245)",
                border: "1px solid oklch(0.28 0.04 245)",
                minHeight: "120px",
              }}
              onClick={() => onNavigate(tile.id)}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                style={{ background: "oklch(0.38 0.16 25 / 0.15)" }}
              >
                <Icon size={22} style={{ color: "oklch(0.55 0.14 25)" }} />
              </div>
              <p
                className="text-sm font-bold"
                style={{
                  color: "oklch(0.97 0.005 245)",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                }}
              >
                {tile.label}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "oklch(0.55 0.02 245)" }}
              >
                {tile.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-auto py-4 text-center">
        <p className="text-xs" style={{ color: "oklch(0.38 0.02 245)" }}>
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: "oklch(0.55 0.12 25)" }}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
