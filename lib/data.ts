/**
 * NEXUS Empire — Static seed data
 * Derived from orchestrator domain inventory
 */

import { analyzeDomain } from "./classifier";
import type { DomainRecord, Listing } from "./types";

// Master domain inventory (from the empire's CSV)
export const DOMAIN_INVENTORY = [
  "agentsai.tools",
  "aipics.pics",
  "aivideos.dev",
  "text2pixel.com",
  "homeai.design",
  "breakingbd.news",
  "1prompts.com",
  "bdai.dev",
  "futureai.xyz",
  "cheaptools.xyz",
  "promptai.dev",
  "aitools.pro",
  "wordtoimage.ai",
  "nexuscreator.io",
  "empire.app",
  "designflow.io",
  "seoboost.tools",
  "aiblog.dev",
  "techmarketer.co",
  "cloudpro.app",
];

// Build full domain records with classification + status
const STATUS_MAP: Record<string, DomainRecord["status"]> = {
  "agentsai.tools": "live",
  "aipics.pics": "live",
  "aivideos.dev": "live",
  "text2pixel.com": "listed",
  "homeai.design": "live",
  "breakingbd.news": "sold",
  "1prompts.com": "live",
  "bdai.dev": "building",
  "futureai.xyz": "listed",
  "cheaptools.xyz": "listed",
  "promptai.dev": "live",
  "aitools.pro": "live",
  "wordtoimage.ai": "live",
  "nexuscreator.io": "live",
  "empire.app": "live",
  "designflow.io": "listed",
  "seoboost.tools": "listed",
  "aiblog.dev": "building",
  "techmarketer.co": "classified",
  "cloudpro.app": "classified",
};

export function getDomainRecords(): DomainRecord[] {
  return DOMAIN_INVENTORY.map((domain, i) => {
    const analysis = analyzeDomain(domain);
    const status = STATUS_MAP[domain] ?? "classified";
    return {
      ...analysis,
      id: `domain_${i + 1}`,
      status,
      addedAt: new Date(
        Date.now() - (DOMAIN_INVENTORY.length - i) * 86400000 * 3
      ).toISOString(),
      liveUrl:
        status === "live" || status === "listed"
          ? `https://${domain}`
          : undefined,
      salePrice: status === "sold" ? 2400 : undefined,
      platform:
        status === "listed" || status === "sold" ? "flippa" : undefined,
    };
  });
}

export function getEmpireStats() {
  const records = getDomainRecords();
  const premium = records.filter((r) => r.category === "PREMIUM_KEEP").length;
  const flipHold = records.filter((r) => r.category === "FLIP_HOLD").length;
  const flipFast = records.filter((r) => r.category === "FLIP_FAST").length;
  const live = records.filter((r) => r.status === "live").length;
  const sold = records.filter((r) => r.status === "sold").length;
  const listed = records.filter((r) => r.status === "listed").length;

  const totalPortfolioValue =
    records.reduce((s, r) => s + r.estimatedFlipPrice, 0) +
    premium * 5000; // premium domains have intrinsic value
  const monthlyRevenue = live * 420; // avg $420/mo per live premium

  return {
    totalDomains: records.length,
    premiumCount: premium,
    flipHoldCount: flipHold,
    flipFastCount: flipFast,
    liveCount: live,
    soldCount: sold,
    totalPortfolioValue,
    monthlyRevenue,
    pendingSales: listed,
    lastUpdated: new Date().toISOString(),
  };
}

export function getListings(): Listing[] {
  const records = getDomainRecords();
  return records
    .filter((r) => r.status === "listed" || r.status === "sold")
    .map((r) => ({
      domain: r.domain,
      askingPrice: r.estimatedFlipPrice || 1200,
      platform: r.platform ?? "flippa",
      listingUrl: `https://flippa.com/listing/${r.domain.replace(/\./g, "-")}`,
      listedDate: r.addedAt,
      status: r.status === "sold" ? "sold" : "active",
      niche: r.niche,
      valueScore: r.valueScore,
      monthlyTraffic: Math.floor(Math.random() * 400 + 80),
      monthlyRevenue: Math.floor(Math.random() * 80 + 20),
    }));
}
