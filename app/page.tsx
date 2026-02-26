import {
  Globe,
  TrendingUp,
  Zap,
  DollarSign,
  BarChart3,
  ShoppingCart,
  Radio,
  Star,
} from "lucide-react";
import { getDomainRecords, getEmpireStats } from "@/lib/data";
import StatCard from "@/components/StatCard";
import DomainTable from "@/components/DomainTable";
import ClassifyWidget from "@/components/ClassifyWidget";
import ApiDocs from "@/components/ApiDocs";
import PricingSection from "@/components/PricingSection";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const records = getDomainRecords();
  const stats = getEmpireStats();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground text-balance">
            Empire Command Center
          </h1>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            {stats.totalDomains} domains tracked &mdash; last updated{" "}
            <span className="font-mono">
              {new Date(stats.lastUpdated).toLocaleTimeString()}
            </span>
          </p>
        </div>

        {/* Stat Cards */}
        <section aria-label="Empire statistics">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            <StatCard
              label="Total Domains"
              value={stats.totalDomains}
              sub={`${stats.liveCount} live, ${stats.pendingSales} listed`}
              icon={Globe}
              accent="blue"
              mono
            />
            <StatCard
              label="Monthly Revenue"
              value={`$${stats.monthlyRevenue.toLocaleString()}`}
              sub={`${stats.premiumCount} premium sites generating`}
              icon={DollarSign}
              accent="success"
              mono
            />
            <StatCard
              label="Portfolio Value"
              value={`$${(stats.totalPortfolioValue / 1000).toFixed(1)}k`}
              sub="Estimated flip + intrinsic value"
              icon={TrendingUp}
              accent="warning"
              mono
            />
            <StatCard
              label="Domains Sold"
              value={stats.soldCount}
              sub={`${stats.pendingSales} pending sale`}
              icon={ShoppingCart}
              accent="danger"
              mono
            />
            <StatCard
              label="Premium Keep"
              value={stats.premiumCount}
              sub="Build SaaS, hold for revenue"
              icon={Star}
              accent="blue"
            />
            <StatCard
              label="Flip Hold"
              value={stats.flipHoldCount}
              sub="Grow 3 months, sell high"
              icon={BarChart3}
              accent="warning"
            />
            <StatCard
              label="Flip Fast"
              value={stats.flipFastCount}
              sub="Build basic, sell in 30 days"
              icon={Zap}
              accent="success"
            />
            <StatCard
              label="Building"
              value={
                records.filter((r) => r.status === "building").length
              }
              sub="Sites currently being built"
              icon={Radio}
            />
          </div>
        </section>

        {/* Main grid: Table + Classify Widget */}
        <section aria-label="Domain portfolio" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">
              Domain Portfolio
            </h2>
            <span className="text-xs text-muted font-mono">
              {records.length} total
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <DomainTable records={records} />
            </div>
            <div className="flex flex-col gap-4">
              <ClassifyWidget />

              {/* Quick API links */}
              <div className="rounded-lg border border-border bg-surface p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Quick API Access
                </h3>
                <div className="flex flex-col gap-2">
                  {[
                    { method: "GET", path: "/api/status", color: "text-accent" },
                    { method: "GET", path: "/api/domains", color: "text-accent" },
                    { method: "GET", path: "/api/listings", color: "text-accent" },
                    { method: "POST", path: "/api/classify", color: "text-success" },
                    { method: "POST", path: "/api/build", color: "text-success" },
                  ].map(({ method, path, color }) => (
                    <a
                      key={path}
                      href={method === "GET" ? path : "#api-docs"}
                      target={method === "GET" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-mono rounded border border-border bg-background px-3 py-2 hover:border-accent hover:bg-accent/5 transition-colors group"
                    >
                      <span className={`${color} font-bold w-8`}>{method}</span>
                      <span className="text-foreground group-hover:text-accent transition-colors">
                        {path}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API Docs */}
        <section aria-label="API documentation" id="api-docs" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">
              API Documentation
            </h2>
            <span className="text-xs bg-success/10 text-success border border-success/20 rounded px-2 py-1 font-mono">
              Live
            </span>
          </div>
          <ApiDocs />
        </section>

        {/* Pricing */}
        <section aria-label="Pricing" className="mb-8">
          <PricingSection />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
