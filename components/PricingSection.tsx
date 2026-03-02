import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlight?: boolean;
  cta: string;
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Classify and analyze domains with the open API.",
    features: [
      "Unlimited domain classification",
      "GET /api/domains (read-only)",
      "GET /api/listings",
      "POST /api/classify",
      "Community support",
    ],
    cta: "Use Free API",
  },
  {
    name: "Builder",
    price: "$49",
    period: "per month",
    description: "Full access to build automation and pipeline triggers.",
    features: [
      "Everything in Starter",
      "POST /api/build — trigger builds",
      "Batch classify (bulk CSV upload)",
      "Webhook notifications on build events",
      "Priority email support",
    ],
    highlight: true,
    cta: "Start Building",
  },
  {
    name: "Empire",
    price: "$199",
    period: "per month",
    description: "Manage a 260+ domain empire with full automation.",
    features: [
      "Everything in Builder",
      "Auto-sell via Flippa / Sedo APIs",
      "AI listing generation",
      "Revenue & SEO analytics",
      "Dedicated account manager",
    ],
    cta: "Go Full Empire",
  },
];

export default function PricingSection() {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground">API Access Plans</h2>
        <p className="text-sm text-muted mt-1 leading-relaxed">
          Start free, scale as your empire grows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "rounded-lg border p-5 flex flex-col gap-4",
              plan.highlight
                ? "border-accent bg-accent/5"
                : "border-border bg-surface"
            )}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted uppercase tracking-widest">
                  {plan.name}
                </span>
                {plan.highlight && (
                  <span className="text-xs bg-accent/20 text-accent border border-accent/30 rounded px-2 py-0.5 font-mono">
                    Popular
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-bold text-foreground font-mono">
                  {plan.price}
                </span>
                <span className="text-xs text-muted">/{plan.period}</span>
              </div>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                {plan.description}
              </p>
            </div>

            <ul className="flex flex-col gap-2 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-foreground">
                  <Check
                    size={12}
                    className={cn(
                      "mt-0.5 flex-shrink-0",
                      plan.highlight ? "text-accent" : "text-success"
                    )}
                  />
                  {f}
                </li>
              ))}
            </ul>

            <button
              className={cn(
                "w-full py-2.5 rounded text-sm font-medium transition-colors",
                plan.highlight
                  ? "bg-accent text-white hover:bg-accent-hover"
                  : "bg-surface border border-border text-foreground hover:border-accent hover:text-accent"
              )}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
