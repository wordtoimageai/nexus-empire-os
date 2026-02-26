export default function SiteFooter() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted font-mono">
          NEXUS Empire OS — Domain Automation Platform
        </p>
        <div className="flex items-center gap-6 text-xs text-muted">
          <a
            href="/api/status"
            target="_blank"
            className="hover:text-foreground transition-colors font-mono"
          >
            /api/status
          </a>
          <a
            href="/api/domains"
            target="_blank"
            className="hover:text-foreground transition-colors font-mono"
          >
            /api/domains
          </a>
          <a
            href="/api/listings"
            target="_blank"
            className="hover:text-foreground transition-colors font-mono"
          >
            /api/listings
          </a>
          <span className="text-muted/40">
            &copy; {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
