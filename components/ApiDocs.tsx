"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Endpoint {
  method: "GET" | "POST";
  path: string;
  description: string;
  example: string;
  response: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    path: "/api/status",
    description: "Health check — returns API status, version, and uptime.",
    example: `curl https://nexus-empire-os.vercel.app/api/status`,
    response: `{
  "status": "ok",
  "version": "1.0.0",
  "uptime": 3600,
  "routes": ["GET /api/status", "..."],
  "timestamp": "2025-01-01T00:00:00.000Z"
}`,
  },
  {
    method: "GET",
    path: "/api/domains",
    description:
      "List all domains. Filter by ?category=PREMIUM_KEEP|FLIP_HOLD|FLIP_FAST and ?status=live|listed|sold",
    example: `curl "https://nexus-empire-os.vercel.app/api/domains?category=PREMIUM_KEEP"`,
    response: `{
  "domains": [...],
  "total": 8,
  "stats": { "totalDomains": 20, "liveCount": 9, ... }
}`,
  },
  {
    method: "POST",
    path: "/api/classify",
    description:
      "Classify a domain — returns category, niche, value score, and flip strategy.",
    example: `curl -X POST https://nexus-empire-os.vercel.app/api/classify \\
  -H "Content-Type: application/json" \\
  -d '{"domain": "agentsai.tools"}'`,
    response: `{
  "success": true,
  "analysis": {
    "domain": "agentsai.tools",
    "category": "PREMIUM_KEEP",
    "niche": "AI Tools",
    "valueScore": 88,
    "estimatedFlipPrice": 0,
    "strategy": "Build full SaaS, keep for recurring revenue"
  }
}`,
  },
  {
    method: "POST",
    path: "/api/build",
    description:
      "Queue a build job for a domain. Optionally specify template: saas | blog | ecommerce | landing",
    example: `curl -X POST https://nexus-empire-os.vercel.app/api/build \\
  -H "Content-Type: application/json" \\
  -d '{"domain": "futureai.xyz", "template": "saas"}'`,
    response: `{
  "success": true,
  "domain": "futureai.xyz",
  "status": "queued",
  "estimatedTime": "4–8 hours",
  "category": "FLIP_FAST",
  "strategy": "Build basic site, sell within 30 days"
}`,
  },
  {
    method: "GET",
    path: "/api/listings",
    description:
      "Get all domains listed for sale. Filter by ?status=active|sold and ?platform=flippa|sedo",
    example: `curl "https://nexus-empire-os.vercel.app/api/listings?status=active"`,
    response: `{
  "listings": [...],
  "total": 5,
  "totalAskingValue": 18500,
  "avgValueScore": 67
}`,
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="absolute top-3 right-3 p-1.5 rounded bg-border/50 hover:bg-border text-muted hover:text-foreground transition-colors"
      aria-label="Copy code"
    >
      {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
    </button>
  );
}

const methodColor: Record<string, string> = {
  GET: "bg-accent/20 text-accent border-accent/30",
  POST: "bg-success/20 text-success border-success/30",
};

export default function ApiDocs() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">API Reference</h2>
        <p className="text-xs text-muted mt-0.5">
          5 REST endpoints — no auth required in dev mode
        </p>
      </div>

      <div className="divide-y divide-border">
        {ENDPOINTS.map((ep) => {
          const isOpen = open === ep.path;
          return (
            <div key={ep.path}>
              <button
                onClick={() => setOpen(isOpen ? null : ep.path)}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-background/50 transition-colors text-left"
              >
                <span
                  className={cn(
                    "inline-flex items-center rounded border px-2 py-0.5 text-xs font-mono font-semibold w-12 justify-center",
                    methodColor[ep.method]
                  )}
                >
                  {ep.method}
                </span>
                <span className="font-mono text-sm text-foreground">
                  {ep.path}
                </span>
                <span className="text-xs text-muted ml-auto hidden sm:block">
                  {ep.description.split(" — ")[0]}
                </span>
                <span className="text-muted text-xs">{isOpen ? "▲" : "▼"}</span>
              </button>

              {isOpen && (
                <div className="px-5 pb-4 flex flex-col gap-3 border-t border-border-subtle">
                  <p className="text-xs text-muted pt-3 leading-relaxed">
                    {ep.description}
                  </p>

                  <div>
                    <p className="text-xs text-muted uppercase tracking-widest mb-2">
                      Request
                    </p>
                    <div className="relative">
                      <pre className="bg-background rounded border border-border px-4 py-3 text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap">
                        {ep.example}
                      </pre>
                      <CopyButton text={ep.example} />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted uppercase tracking-widest mb-2">
                      Response
                    </p>
                    <pre className="bg-background rounded border border-border px-4 py-3 text-xs font-mono text-success/80 overflow-x-auto whitespace-pre-wrap">
                      {ep.response}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
