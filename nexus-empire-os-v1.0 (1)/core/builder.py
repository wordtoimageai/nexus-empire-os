"""
NEXUS Builder Engine
Auto-builds Premium SaaS or Flip landing pages
"""

import os
import subprocess
import json
import shutil
from pathlib import Path
from jinja2 import Template

class SiteBuilder:
    """Automated site builder for 260+ domains"""

    def __init__(self, output_dir="built_sites"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

        # Templates
        self.templates = {
            "PREMIUM_KEEP": self._get_premium_template(),
            "FLIP_HOLD": self._get_flip_template(),
            "FLIP_FAST": self._get_quick_flip_template()
        }

    def build_site(self, domain_analysis):
        """Build complete website for domain"""
        domain = domain_analysis.domain
        category = domain_analysis.category
        niche = domain_analysis.niche

        print(f"\n🏗️  Building {domain} ({category})...")

        site_path = self.output_dir / domain
        site_path.mkdir(exist_ok=True)

        if category == "PREMIUM_KEEP":
            self._build_premium_saas(site_path, domain, niche)
        elif category == "FLIP_HOLD":
            self._build_flip_site(site_path, domain, niche, rich=True)
        else:
            self._build_flip_site(site_path, domain, niche, rich=False)

        print(f"✅ Built: {site_path}")
        return str(site_path)

    def _build_premium_saas(self, path: Path, domain: str, niche: str):
        """Build full SaaS application"""

        # Create Next.js structure
        (path / "app").mkdir()
        (path / "components").mkdir()
        (path / "lib").mkdir()

        # Generate files
        self._write_file(path / "package.json", self._get_package_json(domain))
        self._write_file(path / "next.config.js", self._get_next_config(domain))
        self._write_file(path / "app/layout.tsx", self._get_layout_tsx(domain, niche))
        self._write_file(path / "app/page.tsx", self._get_landing_page(domain, niche))
        self._write_file(path / "app/globals.css", self._get_styles())
        self._write_file(path / "components/Header.tsx", self._get_header())
        self._write_file(path / "components/Pricing.tsx", self._get_pricing())
        self._write_file(path / ".env.local", self._get_env_template())

        # Create deployment script
        self._write_file(path / "deploy.sh", self._get_deploy_script(domain))
        os.chmod(path / "deploy.sh", 0o755)

    def _build_flip_site(self, path: Path, domain: str, niche: str, rich: bool):
        """Build static flip site (faster, simpler)"""

        # Static HTML for speed
        self._write_file(path / "index.html", self._get_flip_html(domain, niche, rich))
        self._write_file(path / "style.css", self._get_flip_css())

        if rich:
            # Add blog section for FLIP_HOLD
            (path / "blog").mkdir()
            for i in range(1, 6):
                self._write_file(
                    path / f"blog/post-{i}.html", 
                    self._get_blog_post(domain, niche, i)
                )

    def batch_build(self, domain_analyses):
        """Build multiple sites in parallel"""
        import concurrent.futures

        print(f"\n🚀 Starting batch build for {len(domain_analyses)} sites...\n")

        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            futures = [
                executor.submit(self.build_site, analysis)
                for analysis in domain_analyses
            ]

            results = []
            for future in concurrent.futures.as_completed(futures):
                try:
                    result = future.result()
                    results.append(result)
                except Exception as e:
                    print(f"❌ Build failed: {e}")

            return results

    # Template generators
    def _get_package_json(self, domain):
        return json.dumps({
            "name": domain.replace(".", "-"),
            "version": "1.0.0",
            "private": True,
            "scripts": {
                "dev": "next dev",
                "build": "next build",
                "start": "next start"
            },
            "dependencies": {
                "next": "15.0.0",
                "react": "^18",
                "react-dom": "^18",
                "tailwindcss": "^3",
                "@supabase/supabase-js": "^2",
                "stripe": "^12"
            }
        }, indent=2)

    def _get_landing_page(self, domain, niche):
        return f"""
import Header from "@/components/Header";
import Pricing from "@/components/Pricing";

export default function Home() {{
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Header />
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          {niche} Powered by AI
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          The most advanced {niche.lower()} platform. 
          Built for professionals who demand results.
        </p>
        <button className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700">
          Start Free Trial
        </button>
      </section>
      <Pricing />
    </main>
  );
}}
"""

    def _get_flip_html(self, domain, niche, rich):
        blog_section = """
        <section class="blog">
            <h2>Latest from {niche}</h2>
            <div class="blog-grid">
                <article><h3>The Future of {niche}</h3><p>AI is transforming...</p></article>
                <article><h3>10 Tips for {niche}</h3><p>Boost your results...</p></article>
                <article><h3>{niche} Trends 2025</h3><p>What's coming next...</p></article>
            </div>
        </section>
        """ if rich else ""

        return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{domain} - {niche} Platform</title>
    <meta name="description" content="Premium {niche} solutions powered by AI technology.">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">{domain}</div>
            <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <section class="hero">
        <h1>Revolutionary {niche}</h1>
        <p>Coming Soon - The future of {niche.lower()} is almost here</p>
        <div class="cta">
            <input type="email" placeholder="Enter your email" />
            <button>Get Early Access</button>
        </div>
    </section>

    {blog_section}

    <footer>
        <p>&copy; 2025 {domain}. All rights reserved.</p>
    </footer>

    <!-- Analytics -->
    <script>
        // Google Analytics or similar
        console.log('Page loaded: {domain}');
    </script>
</body>
</html>"""

    def _get_flip_css(self):
        return """
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, system-ui, sans-serif; line-height: 1.6; color: #333; }
header { background: #1a1a1a; color: white; padding: 1rem 0; }
nav { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; padding: 0 2rem; }
.logo { font-size: 1.5rem; font-weight: bold; }
nav ul { display: flex; list-style: none; gap: 2rem; }
nav a { color: white; text-decoration: none; }
.hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 6rem 2rem; text-align: center; }
.hero h1 { font-size: 3rem; margin-bottom: 1rem; }
.cta { margin-top: 2rem; }
.cta input { padding: 1rem; width: 300px; border: none; border-radius: 4px; margin-right: 1rem; }
.cta button { padding: 1rem 2rem; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; }
.blog { max-width: 1200px; margin: 4rem auto; padding: 0 2rem; }
.blog-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem; }
.blog article { border: 1px solid #e5e7eb; padding: 1.5rem; border-radius: 8px; }
footer { background: #1a1a1a; color: white; text-align: center; padding: 2rem; margin-top: 4rem; }
"""

    def _write_file(self, path, content):
        """Helper to write files"""
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, 'w') as f:
            f.write(content)

if __name__ == "__main__":
    from classifier import DomainClassifier, DomainAnalysis

    # Test build
    builder = SiteBuilder()
    test = DomainAnalysis(
        domain="aipics.pics",
        category="PREMIUM_KEEP",
        niche="AI Tools",
        value_score=95,
        estimated_flip_price=0,
        strategy="Keep",
        reason="High value"
    )

    builder.build_site(test)
