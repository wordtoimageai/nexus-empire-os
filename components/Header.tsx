import { Globe, Zap } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-accent/15 border border-accent/30">
            <Globe size={16} className="text-accent" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-foreground tracking-tight font-mono">
              NEXUS
            </span>
            <span className="text-xs text-muted font-medium">Empire OS</span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            All systems operational
          </div>
          <div className="flex items-center gap-1.5 text-xs bg-accent/10 border border-accent/20 rounded px-2.5 py-1.5 text-accent font-mono">
            <Zap size={11} />
            v1.0
          </div>
        </div>
      </div>
    </header>
  );
}
