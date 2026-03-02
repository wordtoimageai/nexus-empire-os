import type { DomainCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  category: DomainCategory;
  size?: "sm" | "md";
}

const styles: Record<DomainCategory, string> = {
  PREMIUM_KEEP: "bg-accent/15 text-accent border-accent/30",
  FLIP_HOLD: "bg-warning/15 text-warning border-warning/30",
  FLIP_FAST: "bg-success/15 text-success border-success/30",
};

const labels: Record<DomainCategory, string> = {
  PREMIUM_KEEP: "Premium Keep",
  FLIP_HOLD: "Flip Hold",
  FLIP_FAST: "Flip Fast",
};

export default function CategoryBadge({ category, size = "sm" }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border font-mono font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        styles[category]
      )}
    >
      {labels[category]}
    </span>
  );
}
