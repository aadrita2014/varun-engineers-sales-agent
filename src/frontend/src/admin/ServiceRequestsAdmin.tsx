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
import { Variant_closed_in_progress_open } from "../backend.d";
import type { ServiceRequest } from "../backend.d";

const statusConfig: Record<string, { label: string; cls: string }> = {
  open: { label: "Open", cls: "bg-red-100 text-red-800 border-red-200" },
  in_progress: {
    label: "In Progress",
    cls: "bg-amber-100 text-amber-800 border-amber-200",
  },
  closed: { label: "Closed", cls: "bg-gray-100 text-gray-600 border-gray-200" },
};

const ALL_STATUSES = [
  { value: Variant_closed_in_progress_open.open, label: "Open" },
  { value: Variant_closed_in_progress_open.in_progress, label: "In Progress" },
  { value: Variant_closed_in_progress_open.closed, label: "Closed" },
];

function SRTable({
  srs,
  onStatusChange,
  updatingId,
}: {
  srs: ServiceRequest[];
  onStatusChange: (id: bigint, s: Variant_closed_in_progress_open) => void;
  updatingId: bigint | null;
}) {
  if (srs.length === 0)
    return (
      <div
        className="p-8 text-center text-sm text-[oklch(0.6_0.02_245)]"
        data-ocid="service.empty_state"
      >
        No service requests found
      </div>
    );
  return (
    <Table data-ocid="service.table">
      <TableHeader>
        <TableRow className="bg-[oklch(0.97_0.005_245)]">
          <TableHead className="text-xs">ID</TableHead>
          <TableHead className="text-xs">Customer</TableHead>
          <TableHead className="text-xs">Mobile</TableHead>
          <TableHead className="text-xs">Description</TableHead>
          <TableHead className="text-xs">Agent</TableHead>
          <TableHead className="text-xs">Status</TableHead>
          <TableHead className="text-xs">Update</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {srs.map((sr, idx) => (
          <TableRow
            key={sr.id.toString()}
            data-ocid={`service.item.${idx + 1}`}
          >
            <TableCell className="text-xs font-mono text-[oklch(0.5_0.02_245)]">
              #{sr.id.toString()}
            </TableCell>
            <TableCell className="text-xs font-medium">
              {sr.customerName}
            </TableCell>
            <TableCell className="text-xs text-[oklch(0.5_0.02_245)]">
              {sr.customerMobile}
            </TableCell>
            <TableCell className="text-xs max-w-[200px]">
              <span className="line-clamp-2">{sr.description}</span>
            </TableCell>
            <TableCell className="text-xs">{sr.assignedAgentName}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                  statusConfig[sr.status as string]?.cls ??
                  "bg-gray-100 text-gray-700"
                }`}
              >
                {statusConfig[sr.status as string]?.label ?? String(sr.status)}
              </span>
            </TableCell>
            <TableCell>
              <Select
                value={sr.status as string}
                onValueChange={(v) =>
                  onStatusChange(sr.id, v as Variant_closed_in_progress_open)
                }
                disabled={updatingId === sr.id}
              >
                <SelectTrigger
                  className="h-7 text-xs w-32"
                  data-ocid={`service.status.select.${idx + 1}`}
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

export default function ServiceRequestsAdmin() {
  const { actor, isFetching } = useActor();
  const qc = useQueryClient();
  const [tab, setTab] = useState("all");
  const [updatingId, setUpdatingId] = useState<bigint | null>(null);

  const { data: srs, isLoading } = useQuery({
    queryKey: ["admin", "serviceRequests"],
    queryFn: async () => (actor ? actor.getServiceRequests() : []),
    enabled: !!actor && !isFetching,
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: bigint; status: Variant_closed_in_progress_open }) => {
      if (!actor) throw new Error("No actor");
      setUpdatingId(id);
      return actor.updateServiceRequest(id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "serviceRequests"] });
      toast.success("Status updated");
      setUpdatingId(null);
    },
    onError: () => {
      toast.error("Failed to update");
      setUpdatingId(null);
    },
  });

  const all = srs ?? [];
  const filtered =
    tab === "all" ? all : all.filter((s) => (s.status as string) === tab);

  return (
    <div data-ocid="service.section">
      <p className="text-sm text-[oklch(0.55_0.02_245)] mb-4">
        {all.length} total requests
      </p>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4 admin-tabs">
          <TabsTrigger value="all" data-ocid="service.all.tab">
            All ({all.length})
          </TabsTrigger>
          <TabsTrigger value="open" data-ocid="service.open.tab">
            Open
          </TabsTrigger>
          <TabsTrigger value="in_progress" data-ocid="service.in_progress.tab">
            In Progress
          </TabsTrigger>
          <TabsTrigger value="closed" data-ocid="service.closed.tab">
            Closed
          </TabsTrigger>
        </TabsList>
        <TabsContent value={tab}>
          <div className="admin-table-card overflow-hidden">
            {isLoading ? (
              <div className="p-4 space-y-2" data-ocid="service.loading_state">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <SRTable
                srs={filtered}
                onStatusChange={(id, s) =>
                  updateMutation.mutate({ id, status: s })
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
