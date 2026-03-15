import { ArrowLeft, TrendingUp } from "lucide-react";
import React from "react";

interface Props {
  onBack: () => void;
}

const weekData = [
  { day: "Mon", orders: 5, value: 72000 },
  { day: "Tue", orders: 3, value: 45000 },
  { day: "Wed", orders: 7, value: 98000 },
  { day: "Thu", orders: 4, value: 58000 },
  { day: "Fri", orders: 6, value: 87000 },
  { day: "Sat", orders: 2, value: 29000 },
];

const topProducts = [
  { name: "Industrial Pump", units: 12, revenue: 180000 },
  { name: "Valve Set", units: 24, revenue: 84000 },
  { name: "Pressure Gauge", units: 18, revenue: 39600 },
  { name: "Pipe Fitting", units: 45, revenue: 38250 },
];

const maxValue = Math.max(...weekData.map((d) => d.value));

export default function SalesReportsScreen({ onBack }: Props) {
  const navBg = {
    background: "oklch(0.13 0.04 245)",
    borderBottom: "1px solid oklch(0.24 0.04 245)",
  };
  const cardBg = {
    background: "oklch(0.22 0.035 245)",
    border: "1px solid oklch(0.28 0.04 245)",
  };
  const textPrimary = { color: "oklch(0.97 0.005 245)" };
  const textMuted = { color: "oklch(0.55 0.02 245)" };

  const summaryCards = [
    { label: "Month Orders", value: "24", icon: "📦" },
    { label: "Total Value", value: "₹3.42L", icon: "💰" },
    { label: "Collected", value: "₹2.85L", icon: "✅" },
    { label: "Pending", value: "₹57.5K", icon: "⏳" },
  ];

  return (
    <div
      className="flex flex-col min-h-dvh"
      style={{ background: "oklch(0.15 0.04 245)" }}
    >
      <header className="flex items-center gap-3 px-4 py-3" style={navBg}>
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl"
          style={{ background: "oklch(0.22 0.035 245)" }}
        >
          <ArrowLeft size={20} style={{ color: "oklch(0.85 0.02 245)" }} />
        </button>
        <h1
          className="text-lg font-bold"
          style={{
            ...textPrimary,
            fontFamily: "'Bricolage Grotesque', sans-serif",
          }}
        >
          Sales Reports
        </h1>
        <div
          className="ml-auto flex items-center gap-1"
          style={{ color: "oklch(0.6 0.15 145)" }}
        >
          <TrendingUp size={14} />
          <span className="text-xs font-semibold">+18% vs last month</span>
        </div>
      </header>

      <div
        data-ocid="reports.section"
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        {/* Summary grid */}
        <div className="grid grid-cols-2 gap-3">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-2xl p-4" style={cardBg}>
              <p className="text-xl mb-1">{card.icon}</p>
              <p
                className="text-lg font-bold"
                style={{
                  ...textPrimary,
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                }}
              >
                {card.value}
              </p>
              <p className="text-xs" style={textMuted}>
                {card.label}
              </p>
            </div>
          ))}
        </div>

        {/* Weekly performance */}
        <div className="rounded-2xl p-4" style={cardBg}>
          <p
            className="text-xs font-bold uppercase tracking-wider mb-4"
            style={textMuted}
          >
            This Week Performance
          </p>
          <div className="flex items-end justify-between gap-2 h-32">
            {weekData.map((d) => (
              <div
                key={d.day}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-t-lg perf-bar"
                  style={{
                    height: `${(d.value / maxValue) * 100}%`,
                    background: "oklch(0.38 0.16 25)",
                    minHeight: "8px",
                  }}
                />
                <span className="text-xs" style={textMuted}>
                  {d.day}
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: "oklch(0.75 0.02 245)" }}
                >
                  {d.orders}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-2 text-center" style={textMuted}>
            Bar height = order value · Numbers = order count
          </p>
        </div>

        {/* Top products */}
        <div className="rounded-2xl p-4" style={cardBg}>
          <p
            className="text-xs font-bold uppercase tracking-wider mb-3"
            style={textMuted}
          >
            Top Products
          </p>
          <div className="space-y-3">
            {topProducts.map((p, idx) => (
              <div key={p.name} className="flex items-center gap-3">
                <span
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: "oklch(0.38 0.16 25 / 0.2)",
                    color: "oklch(0.55 0.14 25)",
                  }}
                >
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={textPrimary}
                  >
                    {p.name}
                  </p>
                  <p className="text-xs" style={textMuted}>
                    {p.units} units sold
                  </p>
                </div>
                <p
                  className="text-sm font-bold shrink-0"
                  style={{ color: "oklch(0.55 0.14 25)" }}
                >
                  ₹{(p.revenue / 1000).toFixed(0)}K
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
