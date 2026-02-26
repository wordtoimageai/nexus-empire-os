import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: LucideIcon;
  accent?: "default" | "success" | "warning" | "danger" | "blue";
  mono?: boolean;
}

const accentClasses = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  blue: "text-accent",
};

const iconAccent = {
  default: "bg-surface text-muted",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  blue: "bg-accent/10 text-accent",
};

export default function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "default",
  mono = false,
}: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted uppercase tracking-widest">
          {label}
        </span>
        {Icon && (
          <span
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-md",
              iconAccent[accent]
            )}
          >
            <Icon size={16} />
          </span>
        )}
      </div>

      <p
        className={cn(
          "text-3xl font-bold leading-none",
          mono && "font-mono",
          accentClasses[accent]
        )}
      >
        {value}
      </p>

      {sub && (
        <p className="text-xs text-muted leading-relaxed">{sub}</p>
      )}
    </div>
  );
}
