import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, CheckCircle2, Minus, Plus } from "lucide-react";
import React, { useState } from "react";

interface Props {
  onBack: () => void;
}

const CUSTOMERS = [
  "Sharma Traders",
  "Patel Industries",
  "Kumar & Co",
  "Mehta Supplies",
];

const PRODUCTS = [
  { id: 1, name: "Industrial Pump", price: 15000 },
  { id: 2, name: "Valve Set", price: 3500 },
  { id: 3, name: "Pipe Fitting", price: 850 },
  { id: 4, name: "Pressure Gauge", price: 2200 },
];

export default function NewOrderScreen({ onBack }: Props) {
  const [customer, setCustomer] = useState("");
  const [qty, setQty] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const updateQty = (id: number, delta: number) => {
    setQty((prev) => {
      const cur = prev[id] ?? 0;
      const next = Math.max(0, cur + delta);
      if (next === 0) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, [id]: next };
    });
  };

  const orderItems = PRODUCTS.filter((p) => (qty[p.id] ?? 0) > 0);
  const total = orderItems.reduce(
    (sum, p) => sum + p.price * (qty[p.id] ?? 0),
    0,
  );

  const handleSubmit = async () => {
    if (!customer || orderItems.length === 0) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setSubmitted(true);
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

  if (submitted) {
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
            Place New Order
          </h1>
        </header>
        <div
          data-ocid="order.success_state"
          className="flex-1 flex flex-col items-center justify-center gap-4 px-8"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "oklch(0.38 0.16 25 / 0.15)" }}
          >
            <CheckCircle2 size={44} style={{ color: "oklch(0.55 0.14 25)" }} />
          </div>
          <h2
            className="text-xl font-bold"
            style={{
              ...textPrimary,
              fontFamily: "'Bricolage Grotesque', sans-serif",
            }}
          >
            Order Placed!
          </h2>
          <p className="text-center text-sm" style={textMuted}>
            Your order for {customer} has been submitted successfully.
          </p>
          <p
            className="text-lg font-bold"
            style={{ color: "oklch(0.55 0.14 25)" }}
          >
            Total: ₹{total.toLocaleString("en-IN")}
          </p>
          <Button
            onClick={onBack}
            className="mt-4 h-12 px-8 rounded-xl font-bold"
            style={{
              background: "oklch(0.38 0.16 25)",
              color: "oklch(0.97 0.005 0)",
            }}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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
          Place New Order
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Customer select */}
        <div className="rounded-2xl p-4" style={cardBg}>
          <p
            className="text-xs font-bold uppercase tracking-wider mb-3"
            style={textMuted}
          >
            Select Customer
          </p>
          <Select value={customer} onValueChange={setCustomer}>
            <SelectTrigger
              data-ocid="order.customer_select"
              className="w-full h-12 rounded-xl"
              style={{
                background: "oklch(0.26 0.04 245)",
                border: "1px solid oklch(0.3 0.04 245)",
                color: "oklch(0.97 0.005 245)",
              }}
            >
              <SelectValue placeholder="Choose a customer..." />
            </SelectTrigger>
            <SelectContent
              style={{
                background: "oklch(0.22 0.035 245)",
                border: "1px solid oklch(0.28 0.04 245)",
              }}
            >
              {CUSTOMERS.map((c) => (
                <SelectItem
                  key={c}
                  value={c}
                  style={{ color: "oklch(0.97 0.005 245)" }}
                >
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products */}
        <div className="rounded-2xl p-4" style={cardBg}>
          <p
            className="text-xs font-bold uppercase tracking-wider mb-3"
            style={textMuted}
          >
            Select Products
          </p>
          <div className="space-y-3">
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold" style={textPrimary}>
                    {product.name}
                  </p>
                  <p className="text-xs" style={textMuted}>
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateQty(product.id, -1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: "oklch(0.26 0.04 245)",
                      color: "oklch(0.85 0.02 245)",
                    }}
                  >
                    <Minus size={14} />
                  </button>
                  <span
                    className="w-6 text-center text-sm font-bold"
                    style={textPrimary}
                  >
                    {qty[product.id] ?? 0}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQty(product.id, 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: "oklch(0.38 0.16 25)",
                      color: "oklch(0.97 0.005 0)",
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        {orderItems.length > 0 && (
          <div className="rounded-2xl p-4" style={cardBg}>
            <p
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={textMuted}
            >
              Order Summary
            </p>
            <div className="space-y-2">
              {orderItems.map((p) => (
                <div key={p.id} className="flex justify-between text-sm">
                  <span style={textPrimary}>
                    {p.name} × {qty[p.id]}
                  </span>
                  <span style={{ color: "oklch(0.55 0.14 25)" }}>
                    ₹{(p.price * (qty[p.id] ?? 0)).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
              <div
                className="border-t pt-2 flex justify-between font-bold"
                style={{ borderColor: "oklch(0.28 0.04 245)", ...textPrimary }}
              >
                <span>Total</span>
                <span style={{ color: "oklch(0.55 0.14 25)" }}>
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        )}

        <Button
          data-ocid="order.submit_button"
          onClick={handleSubmit}
          disabled={!customer || orderItems.length === 0 || submitting}
          className="w-full h-12 text-base font-bold rounded-xl"
          style={{
            background: "oklch(0.38 0.16 25)",
            color: "oklch(0.97 0.005 0)",
          }}
        >
          {submitting ? "Submitting..." : "Submit Order"}
        </Button>
      </div>
    </div>
  );
}
