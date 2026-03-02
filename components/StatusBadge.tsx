import type { DomainRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

type Status = DomainRecord["status"];

const styles: Record<Status, string> = {
  classified: "bg-border text-muted",
  building: "bg-warning/15 text-warning",
  live: "bg-success/15 text-success",
  listed: "bg-accent/15 text-accent",
  sold: "bg-danger/15 text-danger",
};

const dots: Record<Status, string> = {
  classified: "bg-muted",
  building: "bg-warning animate-pulse",
  live: "bg-success",
  listed: "bg-accent",
  sold: "bg-danger",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium font-mono",
        styles[status]
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", dots[status])} />
      {status}
    </span>
  );
}
