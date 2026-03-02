/**
 * NEXUS Domain Classifier
 * TypeScript port of orchestrator.py — DomainClassifier class
 */

import type { DomainAnalysis, DomainCategory } from "./types";

// High-value keywords → Premium Keep
const PREMIUM_KEYWORDS = [
  "ai", "tools", "app", "pro", "io", "dev", "design", "video", "image",
  "generator", "automation", "software", "platform", "cloud",
];

// Medium-value keywords → Flip Hold
const HOLD_KEYWORDS = [
  "news", "blog", "media", "marketing", "seo", "business", "tech",
];

// TLD value scores
const TLD_VALUE: Record<string, number> = {
  ".com": 30,
  ".io": 25,
  ".co": 20,
  ".ai": 35,
  ".dev": 25,
  ".app": 20,
  ".xyz": 10,
  ".store": 15,
  ".online": 10,
  ".tools": 18,
  ".pics": 8,
  ".news": 12,
  ".design": 20,
};

// Niche detection map
const NICHE_MAP: Record<string, string> = {
  ai: "AI Tools",
  image: "Image / Design",
  video: "Video",
  design: "Design",
  marketing: "Marketing",
  seo: "SEO",
  news: "News / Media",
  blog: "Blogging",
  shop: "E-commerce",
  store: "E-commerce",
  app: "SaaS",
  tools: "Developer Tools",
  home: "Real Estate",
  house: "Real Estate",
  rent: "Real Estate",
  medical: "Healthcare",
  health: "Healthcare",
  skin: "Beauty",
  credit: "Finance",
  money: "Finance",
  bd: "Bangladesh Local",
  bangla: "Bangladesh Content",
  prompt: "AI Prompts",
  nexus: "Enterprise Tech",
  empire: "Enterprise Tech",
};

function detectNiche(domain: string): string {
  const lower = domain.toLowerCase();
  for (const [keyword, niche] of Object.entries(NICHE_MAP)) {
    if (lower.includes(keyword)) return niche;
  }
  return "General Tech";
}

export function analyzeDomain(domain: string): DomainAnalysis {
  const lower = domain.toLowerCase();
  const parts = domain.split(".");
  const baseName = parts[0];
  const tld = "." + parts.slice(1).join(".");

  let score = 50; // base

  // TLD bonus
  score += TLD_VALUE[tld] ?? 5;

  // Length bonus
  if (baseName.length <= 5) score += 20;
  else if (baseName.length <= 8) score += 10;
  else if (baseName.length > 15) score -= 10;

  const hasPremium = PREMIUM_KEYWORDS.some((kw) => lower.includes(kw));
  const hasHold = HOLD_KEYWORDS.some((kw) => lower.includes(kw));

  let category: DomainCategory;
  let estimatedFlipPrice: number;
  let strategy: string;
  let reason: string;

  if (score >= 80 || hasPremium) {
    category = "PREMIUM_KEEP";
    estimatedFlipPrice = 0;
    strategy = "Build full SaaS, keep for recurring revenue";
    reason = "High-value keywords or short premium domain";
  } else if (score >= 60 || hasHold) {
    category = "FLIP_HOLD";
    estimatedFlipPrice = 3000 + score * 20;
    strategy = "Build, grow 3 months, sell at premium";
    reason = "Good domain — worth investing time to grow";
  } else {
    category = "FLIP_FAST";
    estimatedFlipPrice = 800 + score * 10;
    strategy = "Build basic site, sell within 30 days";
    reason = "Standard domain — quick flip strategy";
  }

  return {
    domain,
    category,
    niche: detectNiche(lower),
    valueScore: score,
    estimatedFlipPrice,
    strategy,
    reason,
  };
}

export function batchClassify(domains: string[]): DomainAnalysis[] {
  return domains.map(analyzeDomain);
}

export function calcSummary(analyses: DomainAnalysis[]) {
  const premium = analyses.filter((a) => a.category === "PREMIUM_KEEP").length;
  const hold = analyses.filter((a) => a.category === "FLIP_HOLD").length;
  const fast = analyses.filter((a) => a.category === "FLIP_FAST").length;
  const totalValue = analyses.reduce(
    (sum, a) => sum + a.estimatedFlipPrice,
    0
  );
  return { premium, hold, fast, totalValue };
}
