import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { AlertCircle, DollarSign, ShoppingCart, Users } from "lucide-react";
import type React from "react";
import { Variant_pending_dispatched_delivered_confirmed } from "../backend.d";

const statusConfig: Record<string, { label: string; cls: string }> = {
  pending: {
    label: "Pending",
    cls: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  confirmed: {
    label: "Confirmed",
    cls: "bg-blue-100 text-blue-800 border-blue-200",
  },
  dispatched: {
    label: "Dispatched",
    cls: "bg-purple-100 text-purple-800 border-purple-200",
  },
  delivered: {
    label: "Delivered",
    cls: "bg-green-100 text-green-800 border-green-200",
  },
};

function StatCard({
  title,
  value,
  icon,
  color,
  loading,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}) {
  return (
    <Card className="admin-stat-card" data-ocid="dashboard.card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-[oklch(0.55_0.02_245)] uppercase tracking-wider mb-1">
              {title}
            </p>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p
                className="text-2xl font-bold text-[oklch(0.15_0.03_245)]"
                style={{
                  fontFamily: "Bricolage Grotesque, system-ui, sans-serif",
                }}
              >
                {value}
              </p>
            )}
          </div>
          <div className={`p-2.5 rounded-lg ${color}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { actor, isFetching } = useActor();

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => (actor ? actor.getOrders() : []),
    enabled: !!actor && !isFetching,
  });

  const { data: inventoryValue, isLoading: invLoading } = useQuery({
    queryKey: ["admin", "inventoryValue"],
    queryFn: async () => (actor ? actor.getTotalInventoryValue() : 0),
    enabled: !!actor && !isFetching,
  });

  const { data: openSRs, isLoading: srLoading } = useQuery({
    queryKey: ["admin", "openServiceRequests"],
    queryFn: async () => (actor ? actor.getOpenServiceRequests() : []),
    enabled: !!actor && !isFetching,
  });

  const { data: activeAgents, isLoading: agentsLoading } = useQuery({
    queryKey: ["admin", "activeAgents"],
    queryFn: async () => (actor ? actor.getActiveAgents() : []),
    enabled: !!actor && !isFetching,
  });

  const recentOrders = (orders ?? []).slice(-5).reverse();
  const totalOrders = (orders ?? []).length;

  return (
    <div className="space-y-6" data-ocid="dashboard.section">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={String(totalOrders)}
          icon={<ShoppingCart size={18} className="text-blue-600" />}
          color="bg-blue-50"
          loading={ordersLoading}
        />
        <StatCard
          title="Inventory Value"
          value={
            invLoading
              ? "—"
              : `₹${(inventoryValue ?? 0).toLocaleString("en-IN")}`
          }
          icon={<DollarSign size={18} className="text-emerald-600" />}
          color="bg-emerald-50"
          loading={invLoading}
        />
        <StatCard
          title="Open Service Requests"
          value={String((openSRs ?? []).length)}
          icon={<AlertCircle size={18} className="text-red-600" />}
          color="bg-red-50"
          loading={srLoading}
        />
        <StatCard
          title="Active Agents"
          value={String((activeAgents ?? []).length)}
          icon={<Users size={18} className="text-violet-600" />}
          color="bg-violet-50"
          loading={agentsLoading}
        />
      </div>

      {/* Recent Orders */}
      <Card className="admin-table-card">
        <CardHeader className="pb-3 border-b">
          <CardTitle
            className="text-sm font-bold text-[oklch(0.2_0.03_245)]"
            style={{ fontFamily: "Bricolage Grotesque, system-ui, sans-serif" }}
          >
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {ordersLoading ? (
            <div className="p-4 space-y-2" data-ocid="dashboard.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div
              className="p-8 text-center text-sm text-[oklch(0.6_0.02_245)]"
              data-ocid="dashboard.empty_state"
            >
              No orders yet
            </div>
          ) : (
            <Table data-ocid="dashboard.table">
              <TableHeader>
                <TableRow className="bg-[oklch(0.97_0.005_245)]">
                  <TableHead className="text-xs">Order ID</TableHead>
                  <TableHead className="text-xs">Agent</TableHead>
                  <TableHead className="text-xs">Customer</TableHead>
                  <TableHead className="text-xs">Amount</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order, idx) => (
                  <TableRow
                    key={order.id.toString()}
                    data-ocid={`dashboard.order.row.${idx + 1}`}
                  >
                    <TableCell className="text-xs font-mono text-[oklch(0.45_0.02_245)]">
                      #{order.id.toString()}
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {order.agentName}
                    </TableCell>
                    <TableCell className="text-xs">
                      {order.customerName}
                    </TableCell>
                    <TableCell className="text-xs font-semibold">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          statusConfig[order.status as string]?.cls ??
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {statusConfig[order.status as string]?.label ??
                          String(order.status)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
