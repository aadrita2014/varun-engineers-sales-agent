import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActor } from "@/hooks/useActor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import { Variant_pending_dispatched_delivered_confirmed } from "../backend.d";
import type { Order } from "../backend.d";

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

const ALL_STATUSES = [
  {
    value: Variant_pending_dispatched_delivered_confirmed.pending,
    label: "Pending",
  },
  {
    value: Variant_pending_dispatched_delivered_confirmed.confirmed,
    label: "Confirmed",
  },
  {
    value: Variant_pending_dispatched_delivered_confirmed.dispatched,
    label: "Dispatched",
  },
  {
    value: Variant_pending_dispatched_delivered_confirmed.delivered,
    label: "Delivered",
  },
];

function OrdersTable({
  orders,
  onStatusChange,
  updatingId,
}: {
  orders: Order[];
  onStatusChange: (
    id: bigint,
    status: Variant_pending_dispatched_delivered_confirmed,
  ) => void;
  updatingId: bigint | null;
}) {
  if (orders.length === 0) {
    return (
      <div
        className="p-8 text-center text-sm text-[oklch(0.6_0.02_245)]"
        data-ocid="orders.empty_state"
      >
        No orders found
      </div>
    );
  }
  return (
    <Table data-ocid="orders.table">
      <TableHeader>
        <TableRow className="bg-[oklch(0.97_0.005_245)]">
          <TableHead className="text-xs">ID</TableHead>
          <TableHead className="text-xs">Agent</TableHead>
          <TableHead className="text-xs">Mobile</TableHead>
          <TableHead className="text-xs">Customer</TableHead>
          <TableHead className="text-xs text-right">Amount</TableHead>
          <TableHead className="text-xs">Status</TableHead>
          <TableHead className="text-xs">Update Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order, idx) => (
          <TableRow
            key={order.id.toString()}
            data-ocid={`orders.item.${idx + 1}`}
          >
            <TableCell className="text-xs font-mono text-[oklch(0.5_0.02_245)]">
              #{order.id.toString()}
            </TableCell>
            <TableCell className="text-xs font-medium">
              {order.agentName}
            </TableCell>
            <TableCell className="text-xs text-[oklch(0.5_0.02_245)]">
              {order.agentMobile}
            </TableCell>
            <TableCell className="text-xs">{order.customerName}</TableCell>
            <TableCell className="text-xs text-right font-semibold">
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
            <TableCell>
              <Select
                value={order.status as string}
                onValueChange={(v) =>
                  onStatusChange(
                    order.id,
                    v as Variant_pending_dispatched_delivered_confirmed,
                  )
                }
                disabled={updatingId === order.id}
              >
                <SelectTrigger
                  className="h-7 text-xs w-32"
                  data-ocid={`orders.status.select.${idx + 1}`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map((s) => (
                    <SelectItem
                      key={s.value}
                      value={s.value}
                      className="text-xs"
                    >
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function OrdersAdmin() {
  const { actor, isFetching } = useActor();
  const qc = useQueryClient();
  const [tab, setTab] = useState("all");
  const [updatingId, setUpdatingId] = useState<bigint | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => (actor ? actor.getOrders() : []),
    enabled: !!actor && !isFetching,
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: bigint;
      status: Variant_pending_dispatched_delivered_confirmed;
    }) => {
      if (!actor) throw new Error("No actor");
      setUpdatingId(id);
      return actor.updateOrderStatus(id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("Order status updated");
      setUpdatingId(null);
    },
    onError: () => {
      toast.error("Failed to update order");
      setUpdatingId(null);
    },
  });

  const allOrders = orders ?? [];
  const filtered =
    tab === "all"
      ? allOrders
      : allOrders.filter((o) => (o.status as string) === tab);

  return (
    <div data-ocid="orders.section">
      <p className="text-sm text-[oklch(0.55_0.02_245)] mb-4">
        {allOrders.length} total orders
      </p>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4 admin-tabs">
          <TabsTrigger value="all" data-ocid="orders.all.tab">
            All ({allOrders.length})
          </TabsTrigger>
          <TabsTrigger value="pending" data-ocid="orders.pending.tab">
            Pending
          </TabsTrigger>
          <TabsTrigger value="confirmed" data-ocid="orders.confirmed.tab">
            Confirmed
          </TabsTrigger>
          <TabsTrigger value="dispatched" data-ocid="orders.dispatched.tab">
            Dispatched
          </TabsTrigger>
          <TabsTrigger value="delivered" data-ocid="orders.delivered.tab">
            Delivered
          </TabsTrigger>
        </TabsList>
        <TabsContent value={tab}>
          <div className="admin-table-card overflow-hidden">
            {isLoading ? (
              <div className="p-4 space-y-2" data-ocid="orders.loading_state">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <OrdersTable
                orders={filtered}
                onStatusChange={(id, status) =>
                  updateMutation.mutate({ id, status })
                }
                updatingId={updatingId}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
