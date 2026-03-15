import { ArrowLeft, Package } from "lucide-react";
import React, { useState } from "react";

interface Props {
  onBack: () => void;
}

type Category = "All" | "Pumps" | "Valves" | "Fittings" | "Gauges";

const PRODUCTS = [
  {
    id: 1,
    name: "Industrial Centrifugal Pump",
    category: "Pumps" as Category,
    price: 15000,
    stock: 8,
    sku: "PMP-001",
  },
  {
    id: 2,
    name: "Submersible Pump 2HP",
    category: "Pumps" as Category,
    price: 22000,
    stock: 3,
    sku: "PMP-002",
  },
  {
    id: 3,
    name: "Ball Valve 1 inch",
    category: "Valves" as Category,
    price: 850,
    stock: 45,
    sku: "VLV-001",
  },
  {
    id: 4,
    name: "Gate Valve Set",
    category: "Valves" as Category,
    price: 3500,
    stock: 12,
    sku: "VLV-002",
  },
  {
    id: 5,
    name: "GI Pipe Fitting 3/4",
    category: "Fittings" as Category,
    price: 420,
    stock: 100,
    sku: "FIT-001",
  },
  {
    id: 6,
    name: "HDPE Pipe Elbow",
    category: "Fittings" as Category,
    price: 180,
    stock: 200,
    sku: "FIT-002",
  },
  {
    id: 7,
    name: "Pressure Gauge 0-16 bar",
    category: "Gauges" as Category,
    price: 2200,
    stock: 25,
    sku: "GAU-001",
  },
  {
    id: 8,
    name: "Digital Pressure Meter",
    category: "Gauges" as Category,
    price: 4800,
    stock: 6,
    sku: "GAU-002",
  },
];

const CATEGORIES: Category[] = ["All", "Pumps", "Valves", "Fittings", "Gauges"];

export default function ProductCatalogScreen({ onBack }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filtered =
    activeCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

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
          Product Catalog
        </h1>
      </header>

      {/* Category tabs */}
      <div className="px-4 py-3 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 w-max">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              data-ocid="products.tab"
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap"
              style={
                activeCategory === cat
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
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div
        data-ocid="products.list"
        className="flex-1 px-4 pb-6 grid grid-cols-2 gap-3 content-start overflow-y-auto"
      >
        {filtered.map((product, idx) => (
          <div
            key={product.id}
            data-ocid={`products.item.${idx + 1}`}
            className="rounded-2xl overflow-hidden tile-press"
            style={cardBg}
          >
            {/* Image placeholder */}
            <div
              className="h-28 flex flex-col items-center justify-center gap-1"
              style={{ background: "oklch(0.38 0.16 25 / 0.12)" }}
            >
              <Package size={32} style={{ color: "oklch(0.55 0.14 25)" }} />
              <span
                className="text-xs font-mono"
                style={{ color: "oklch(0.45 0.1 25)" }}
              >
                {product.sku}
              </span>
            </div>
            <div className="p-3">
              <p
                className="text-xs font-bold leading-tight mb-1"
                style={{
                  ...textPrimary,
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                }}
              >
                {product.name}
              </p>
              <p
                className="text-sm font-bold"
                style={{ color: "oklch(0.55 0.14 25)" }}
              >
                ₹{product.price.toLocaleString("en-IN")}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs" style={textMuted}>
                  Stock: {product.stock}
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={
                    product.stock > 10
                      ? {
                          background: "oklch(0.35 0.12 145 / 0.15)",
                          color: "oklch(0.6 0.15 145)",
                        }
                      : product.stock > 0
                        ? {
                            background: "oklch(0.6 0.15 80 / 0.15)",
                            color: "oklch(0.6 0.15 80)",
                          }
                        : {
                            background: "oklch(0.38 0.16 25 / 0.15)",
                            color: "oklch(0.55 0.14 25)",
                          }
                  }
                >
                  {product.stock > 10
                    ? "In Stock"
                    : product.stock > 0
                      ? "Low Stock"
                      : "Out"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
