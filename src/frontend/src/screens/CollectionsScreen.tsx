import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";

interface Props {
  onBack: () => void;
}

type PaymentStatus = "pending" | "collected";

interface PaymentEntry {
  id: number;
  customer: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
}

const INITIAL_PAYMENTS: PaymentEntry[] = [
  {
    id: 1,
    customer: "Sharma Traders",
    amount: 45000,
    dueDate: "10 Mar 2026",
    status: "pending",
  },
  {
    id: 2,
    customer: "Patel Industries",
    amount: 12500,
    dueDate: "12 Mar 2026",
    status: "collected",
  },
  {
    id: 3,
    customer: "Mehta Supplies",
    amount: 28000,
    dueDate: "8 Mar 2026",
    status: "pending",
  },
  {
    id: 4,
    customer: "Gupta Enterprises",
    amount: 8750,
    dueDate: "15 Mar 2026",
    status: "pending",
  },
  {
    id: 5,
    customer: "Kumar & Co",
    amount: 18000,
    dueDate: "5 Mar 2026",
    status: "collected",
  },
  {
    id: 6,
    customer: "Singh & Sons",
    amount: 6500,
    dueDate: "20 Mar 2026",
    status: "pending",
  },
];

type Filter = "All" | "Pending" | "Collected";

export default function CollectionsScreen({ onBack }: Props) {
  const [payments, setPayments] = useState<PaymentEntry[]>(INITIAL_PAYMENTS);
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = payments.filter((p) => {
    if (filter === "All") return true;
    return filter === "Pending"
      ? p.status === "pending"
      : p.status === "collected";
  });

  const handleCollect = (id: number) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "collected" } : p)),
    );
  };

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

  const filterOptions: Filter[] = ["All", "Pending", "Collected"];

  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((s, p) => s + p.amount, 0);
  const totalCollected = payments
    .filter((p) => p.status === "collected")
    .reduce((s, p) => s + p.amount, 0);

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
          Collections
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Summary */}
        <div className="px-4 py-3 grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-3" style={cardBg}>
            <p className="text-xs" style={textMuted}>
              Pending
            </p>
            <p
              className="text-base font-bold"
              style={{
                color: "oklch(0.55 0.14 25)",
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              ₹{totalPending.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="rounded-2xl p-3" style={cardBg}>
            <p className="text-xs" style={textMuted}>
              Collected
            </p>
            <p
              className="text-base font-bold"
              style={{
                color: "oklch(0.6 0.15 145)",
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              ₹{totalCollected.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="px-4 pb-3 flex gap-2">
          {filterOptions.map((f) => (
            <button
              type="button"
              key={f}
              data-ocid="collections.tab"
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
              style={
                filter === f
                  ? {
                      background: "oklch(0.38 0.16 25)",
                      color: "oklch(0.97 0.005 0)",
                    }
                  : {
                      background: "oklch(0.22 0.035 245)",
                      color: "oklch(0.65 0.025 245)",
                      border: "1px solid oklch(0.28 0.04 245)",
                    }
              }
            >
              {f}
            </button>
          ))}
        </div>

        {/* Payment list */}
        <div data-ocid="collections.list" className="px-4 pb-6 space-y-3">
          {filtered.map((payment, idx) => (
            <div
              key={payment.id}
              data-ocid={`collections.item.${idx + 1}`}
              className="rounded-2xl p-4"
              style={cardBg}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{
                      ...textPrimary,
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                    }}
                  >
                    {payment.customer}
                  </p>
                  <p className="text-xs mt-0.5" style={textMuted}>
                    Due: {payment.dueDate}
                  </p>
                </div>
                <p
                  className="text-base font-bold"
                  style={{ color: "oklch(0.55 0.14 25)" }}
                >
                  ₹{payment.amount.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={
                    payment.status === "collected"
                      ? {
                          background: "oklch(0.35 0.12 145 / 0.15)",
                          color: "oklch(0.6 0.15 145)",
                        }
                      : {
                          background: "oklch(0.38 0.16 25 / 0.15)",
                          color: "oklch(0.65 0.12 25)",
                        }
                  }
                >
                  {payment.status === "collected"
                    ? "✓ Collected"
                    : "⏳ Pending"}
                </span>
                {payment.status === "pending" && (
                  <Button
                    data-ocid="collections.collect_button.1"
                    onClick={() => handleCollect(payment.id)}
                    size="sm"
                    className="h-8 text-xs font-bold rounded-lg px-3"
                    style={{
                      background: "oklch(0.38 0.16 25)",
                      color: "oklch(0.97 0.005 0)",
                    }}
                  >
                    <CheckCircle2 size={12} className="mr-1" />
                    Mark Collected
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
