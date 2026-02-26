"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import type { ClassifyResponse } from "@/lib/types";
import CategoryBadge from "./CategoryBadge";
import { cn } from "@/lib/utils";

export default function ClassifyWidget() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassifyResponse | null>(null);

  const handleClassify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.trim() }),
      });
      const data: ClassifyResponse = await res.json();
      setResult(data);
    } catch {
      setResult({ success: false, error: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-5 flex flex-col gap-5">
      <div>
        <h2 className="text-sm font-semibold text-foreground">
          Domain Classifier
        </h2>
        <p className="text-xs text-muted mt-0.5 leading-relaxed">
          Instantly analyze any domain — get category, niche, value score, and
          flip strategy.
        </p>
      </div>

      <form onSubmit={handleClassify} className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="e.g. agentsai.tools"
            className="w-full bg-background border border-border rounded pl-9 pr-3 py-2 text-sm font-mono text-foreground placeholder-muted focus:outline-none focus:border-accent"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !domain.trim()}
          className={cn(
            "px-4 py-2 rounded text-sm font-medium transition-colors",
            "bg-accent text-white hover:bg-accent-hover",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "flex items-center gap-2"
          )}
        >
          {loading && <Loader2 size={13} className="animate-spin" />}
          Analyze
        </button>
      </form>

      {result && (
        <div
          className={cn(
            "rounded border p-4 text-sm",
            result.success
              ? "border-border bg-background"
              : "border-danger/30 bg-danger/5"
          )}
        >
          {result.success && result.analysis ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-foreground">
                  {result.analysis.domain}
                </span>
                <CategoryBadge category={result.analysis.category} size="md" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted">Niche</span>
                  <p className="text-foreground font-medium mt-0.5">
                    {result.analysis.niche}
                  </p>
                </div>
                <div>
                  <span className="text-muted">Value Score</span>
                  <p className="font-mono font-bold text-accent mt-0.5">
                    {result.analysis.valueScore} / 100
                  </p>
                </div>
                {result.analysis.estimatedFlipPrice > 0 && (
                  <div>
                    <span className="text-muted">Est. Flip Price</span>
                    <p className="font-mono font-bold text-success mt-0.5">
                      ${result.analysis.estimatedFlipPrice.toLocaleString()}
                    </p>
                  </div>
                )}
                <div className={result.analysis.estimatedFlipPrice > 0 ? "" : "col-span-2"}>
                  <span className="text-muted">Strategy</span>
                  <p className="text-foreground mt-0.5 leading-relaxed">
                    {result.analysis.strategy}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted border-t border-border pt-3">
                {result.analysis.reason}
              </p>
            </div>
          ) : (
            <p className="text-danger">{result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
