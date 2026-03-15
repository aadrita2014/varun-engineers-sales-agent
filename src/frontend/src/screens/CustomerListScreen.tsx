import { Input } from "@/components/ui/input";
import { ArrowLeft, MapPin, Phone, Search } from "lucide-react";
import React, { useState } from "react";

interface Props {
  onBack: () => void;
}

const CUSTOMERS = [
  {
    name: "Sharma Traders",
    phone: "9876543210",
    city: "Mumbai",
    outstanding: 45000,
  },
  {
    name: "Patel Industries",
    phone: "9812345678",
    city: "Pune",
    outstanding: 12500,
  },
  { name: "Kumar & Co", phone: "9823456789", city: "Thane", outstanding: 0 },
  {
    name: "Mehta Supplies",
    phone: "9834567890",
    city: "Nashik",
    outstanding: 28000,
  },
  {
    name: "Gupta Enterprises",
    phone: "9845678901",
    city: "Mumbai",
    outstanding: 8750,
  },
  { name: "Singh & Sons", phone: "9856789012", city: "Pune", outstanding: 0 },
];

export default function CustomerListScreen({ onBack }: Props) {
  const [search, setSearch] = useState("");

  const filtered = CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()),
  );

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
          Customer List
        </h1>
        <span
          className="ml-auto text-xs font-semibold px-2 py-1 rounded-full"
          style={{
            background: "oklch(0.38 0.16 25 / 0.2)",
            color: "oklch(0.65 0.12 25)",
          }}
        >
          {CUSTOMERS.length} total
        </span>
      </header>

      <div className="px-4 py-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "oklch(0.55 0.02 245)" }}
          />
          <Input
            data-ocid="customers.search_input"
            placeholder="Search by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11 rounded-xl"
            style={{
              background: "oklch(0.22 0.035 245)",
              border: "1px solid oklch(0.28 0.04 245)",
              color: "oklch(0.97 0.005 245)",
            }}
          />
        </div>
      </div>

      <div
        data-ocid="customers.list"
        className="flex-1 px-4 pb-6 space-y-3 overflow-y-auto"
      >
        {filtered.length === 0 ? (
          <div
            data-ocid="customers.empty_state"
            className="flex flex-col items-center justify-center py-16 gap-3"
          >
            <p className="text-sm" style={textMuted}>
              No customers found
            </p>
          </div>
        ) : (
          filtered.map((customer, idx) => (
            <div
              key={customer.name}
              data-ocid={`customers.item.${idx + 1}`}
              className="rounded-2xl p-4 tile-press"
              style={cardBg}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{
                      ...textPrimary,
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                    }}
                  >
                    {customer.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className="flex items-center gap-1 text-xs"
                      style={textMuted}
                    >
                      <Phone size={11} />
                      {customer.phone}
                    </span>
                    <span
                      className="flex items-center gap-1 text-xs"
                      style={textMuted}
                    >
                      <MapPin size={11} />
                      {customer.city}
                    </span>
                  </div>
                </div>
                {customer.outstanding > 0 ? (
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{
                      background: "oklch(0.38 0.16 25 / 0.15)",
                      color: "oklch(0.65 0.12 25)",
                    }}
                  >
                    ₹{customer.outstanding.toLocaleString("en-IN")}
                  </span>
                ) : (
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{
                      background: "oklch(0.35 0.12 145 / 0.15)",
                      color: "oklch(0.6 0.15 145)",
                    }}
                  >
                    Cleared
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
