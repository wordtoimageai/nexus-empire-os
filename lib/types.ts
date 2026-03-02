export type DomainCategory = "PREMIUM_KEEP" | "FLIP_HOLD" | "FLIP_FAST";

export interface DomainAnalysis {
  domain: string;
  category: DomainCategory;
  niche: string;
  valueScore: number;
  estimatedFlipPrice: number;
  strategy: string;
  reason: string;
}

export interface DomainRecord extends DomainAnalysis {
  id: string;
  status: "classified" | "building" | "live" | "listed" | "sold";
  addedAt: string;
  liveUrl?: string;
  salePrice?: number;
  platform?: string;
}

export interface EmpireStats {
  totalDomains: number;
  premiumCount: number;
  flipHoldCount: number;
  flipFastCount: number;
  liveCount: number;
  soldCount: number;
  totalPortfolioValue: number;
  monthlyRevenue: number;
  pendingSales: number;
  lastUpdated: string;
}

export interface ClassifyRequest {
  domain: string;
}

export interface ClassifyResponse {
  success: boolean;
  analysis?: DomainAnalysis;
  error?: string;
}

export interface BuildRequest {
  domain: string;
  template?: "saas" | "blog" | "ecommerce" | "landing";
}

export interface BuildResponse {
  success: boolean;
  domain?: string;
  status?: string;
  estimatedTime?: string;
  error?: string;
}

export interface ApiStatusResponse {
  status: "ok" | "degraded" | "down";
  version: string;
  uptime: number;
  routes: string[];
  timestamp: string;
}

export interface Listing {
  domain: string;
  askingPrice: number;
  platform: string;
  listingUrl: string;
  listedDate: string;
  status: "active" | "offer_received" | "sold";
  niche: string;
  valueScore: number;
  monthlyTraffic: number;
  monthlyRevenue: number;
}
