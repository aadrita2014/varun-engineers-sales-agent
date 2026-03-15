import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActor } from "@/hooks/useActor";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function SalesAdmin() {
  const { actor, isFetching } = useActor();

  const { data: records, isLoading: recLoading } = useQuery({
    queryKey: ["admin", "salesRecords"],
    queryFn: async () => (actor ? actor.getSalesRecords() : []),
    enabled: !!actor && !isFetching,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin", "salesStats"],
    queryFn: async () =>
      actor
        ? actor.getSalesRecordStats()
        : ([BigInt(0), 0] as [bigint, number]),
    enabled: !!actor && !isFetching,
  });

  const totalCount = stats ? Number(stats[0]) : 0;
  const totalRevenue = stats ? stats[1] : 0;

  return (
    <div data-ocid="sales.section">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <Card className="admin-stat-card" data-ocid="sales.total.card">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-[oklch(0.55_0.02_245)] uppercase tracking-wider mb-1">
              Total Sales
            </p>
            {statsLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p
                className="text-2xl font-bold text-[oklch(0.15_0.03_245)]"
                style={{
                  fontFamily: "Bricolage Grotesque, system-ui, sans-serif",
                }}
              >
                {totalCount}
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="admin-stat-card" data-ocid="sales.revenue.card">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-[oklch(0.55_0.02_245)] uppercase tracking-wider mb-1">
              Total Revenue
            </p>
            {statsLoading ? (
              <Skeleton className="h-7 w-28" />
            ) : (
              <p
                className="text-2xl font-bold text-[oklch(0.15_0.03_245)]"
                style={{
                  fontFamily: "Bricolage Grotesque, system-ui, sans-serif",
                }}
              >
                ₹{totalRevenue.toLocaleString("en-IN")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="admin-table-card overflow-hidden">
        {recLoading ? (
          <div className="p-4 space-y-2" data-ocid="sales.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (records ?? []).length === 0 ? (
          <div
            className="p-8 text-center text-sm text-[oklch(0.6_0.02_245)]"
            data-ocid="sales.empty_state"
          >
            No sales records found
          </div>
        ) : (
          <Table data-ocid="sales.table">
            <TableHeader>
              <TableRow className="bg-[oklch(0.97_0.005_245)]">
                <TableHead className="text-xs">ID</TableHead>
                <TableHead className="text-xs">Agent</TableHead>
                <TableHead className="text-xs">Customer</TableHead>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs text-center">Products</TableHead>
                <TableHead className="text-xs text-right">Amount</TableHead>
                <TableHead className="text-xs">Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(records ?? []).map((r, idx) => (
                <TableRow
                  key={r.id.toString()}
                  data-ocid={`sales.item.${idx + 1}`}
                >
                  <TableCell className="text-xs font-mono text-[oklch(0.5_0.02_245)]">
                    #{r.id.toString()}
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {r.agentName}
                  </TableCell>
                  <TableCell className="text-xs">{r.customerName}</TableCell>
                  <TableCell className="text-xs text-[oklch(0.5_0.02_245)]">
                    {new Date(
                      Number(r.date / BigInt(1_000_000)),
                    ).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell className="text-xs text-center">
                    {r.products.length}
                  </TableCell>
                  <TableCell className="text-xs text-right font-semibold">
                    ₹{r.totalAmount.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      {r.paymentMode}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
