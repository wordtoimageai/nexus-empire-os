"use client";

import { useState } from "react";
import { ExternalLink, ChevronUp, ChevronDown } from "lucide-react";
import type { DomainRecord } from "@/lib/types";
import type { DomainCategory } from "@/lib/types";
import CategoryBadge from "./CategoryBadge";
import StatusBadge from "./StatusBadge";
import { cn } from "@/lib/utils";

interface Props {
  records: DomainRecord[];
}

type SortKey = "domain" | "valueScore" | "category" | "status" | "niche";
type SortDir = "asc" | "desc";

export default function DomainTable({ records }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("valueScore");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [categoryFilter, setCategoryFilter] = useState<
    DomainCategory | "ALL"
  >("ALL");
  const [statusFilter, setStatusFilter] = useState<
    DomainRecord["status"] | "ALL"
  >("ALL");
  const [search, setSearch] = useState("");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = records
    .filter((r) => {
      if (categoryFilter !== "ALL" && r.category !== categoryFilter)
        return false;
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (search && !r.domain.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    })
    .sort((a, b) => {
      let va: string | number = a[sortKey];
      let vb: string | number = b[sortKey];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col)
      return (
        <span className="text-muted/40 ml-1">
          <ChevronUp size={12} />
        </span>
      );
    return sortDir === "asc" ? (
      <ChevronUp size={12} className="ml-1 text-accent" />
    ) : (
      <ChevronDown size={12} className="ml-1 text-accent" />
    );
  };

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-4 border-b border-border">
        <input
          type="text"
          placeholder="Search domains..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 bg-background border border-border rounded px-3 py-1.5 text-sm text-foreground placeholder-muted focus:outline-none focus:border-accent font-mono"
        />
        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value as DomainCategory | "ALL")
          }
          className="bg-background border border-border rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-accent"
        >
          <option value="ALL">All Categories</option>
          <option value="PREMIUM_KEEP">Premium Keep</option>
          <option value="FLIP_HOLD">Flip Hold</option>
          <option value="FLIP_FAST">Flip Fast</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as DomainRecord["status"] | "ALL")
          }
          className="bg-background border border-border rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-accent"
        >
          <option value="ALL">All Statuses</option>
          <option value="classified">Classified</option>
          <option value="building">Building</option>
          <option value="live">Live</option>
          <option value="listed">Listed</option>
          <option value="sold">Sold</option>
        </select>
        <span className="text-xs text-muted font-mono ml-auto">
          {filtered.length} / {records.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              {(
                [
                  ["domain", "Domain"],
                  ["category", "Category"],
                  ["niche", "Niche"],
                  ["valueScore", "Score"],
                  ["status", "Status"],
                ] as [SortKey, string][]
              ).map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-widest cursor-pointer hover:text-foreground select-none"
                >
                  <span className="inline-flex items-center">
                    {label}
                    <SortIcon col={key} />
                  </span>
                </th>
              ))}
              <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-widest">
                Price / Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="border-b border-border-subtle last:border-0 hover:bg-background/60 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-foreground font-medium">
                      {r.domain}
                    </span>
                    {r.liveUrl && (
                      <a
                        href={r.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted hover:text-accent transition-colors"
                        aria-label={`Visit ${r.domain}`}
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <CategoryBadge category={r.category} />
                </td>
                <td className="px-4 py-3 text-muted text-xs">{r.niche}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "font-mono font-bold text-sm",
                      r.valueScore >= 80
                        ? "text-accent"
                        : r.valueScore >= 60
                        ? "text-warning"
                        : "text-muted"
                    )}
                  >
                    {r.valueScore}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3">
                  {r.estimatedFlipPrice > 0 ? (
                    <span className="font-mono text-success text-sm font-semibold">
                      ${r.estimatedFlipPrice.toLocaleString()}
                    </span>
                  ) : r.salePrice ? (
                    <span className="font-mono text-danger text-sm font-semibold">
                      SOLD ${r.salePrice.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-muted text-xs">Keep</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted text-sm">
            No domains match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
