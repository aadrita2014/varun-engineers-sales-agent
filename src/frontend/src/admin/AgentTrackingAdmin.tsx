import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useQuery } from "@tanstack/react-query";
import { Clock, MapPin, Search, User } from "lucide-react";
import React, { useState } from "react";

export default function AgentTrackingAdmin() {
  const { actor, isFetching } = useActor();
  const [search, setSearch] = useState("");

  const { data: agents, isLoading } = useQuery({
    queryKey: ["admin", "agentLocations"],
    queryFn: async () => (actor ? actor.getAgentLocations() : []),
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });

  const filtered = (agents ?? []).filter(
    (a) =>
      search === "" ||
      a.agentMobile.includes(search) ||
      a.agentName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div data-ocid="tracking.section">
      <div className="mb-5">
        <div className="relative max-w-xs">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[oklch(0.6_0.02_245)]"
          />
          <Input
            placeholder="Search by mobile or name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
            data-ocid="tracking.search_input"
          />
        </div>
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="tracking.loading_state"
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="p-10 text-center text-sm text-[oklch(0.6_0.02_245)]"
          data-ocid="tracking.empty_state"
        >
          No agents found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((agent, idx) => (
            <Card
              key={agent.agentMobile}
              className="admin-agent-card"
              data-ocid={`tracking.item.${idx + 1}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-[oklch(0.92_0.04_245)] flex items-center justify-center">
                      <User size={16} className="text-[oklch(0.45_0.05_245)]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[oklch(0.18_0.03_245)]">
                        {agent.agentName}
                      </p>
                      <p className="text-xs text-[oklch(0.55_0.02_245)]">
                        {agent.agentMobile}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                      agent.isActive
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}
                  >
                    {agent.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-[oklch(0.5_0.02_245)]">
                    <MapPin size={12} />
                    <span className="font-medium">{agent.locationName}</span>
                    <span className="text-[oklch(0.7_0.02_245)]">
                      · {agent.territory}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[oklch(0.6_0.02_245)]">
                    <Clock size={12} />
                    <span>
                      Last check-in:{" "}
                      {new Date(
                        Number(agent.lastCheckIn / BigInt(1_000_000)),
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
