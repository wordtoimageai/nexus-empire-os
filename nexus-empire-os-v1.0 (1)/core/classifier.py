"""
NEXUS Domain Classifier
Automatically categorizes domains into PREMIUM or FLIP
"""

import re
import json
from dataclasses import dataclass
from typing import Literal
import requests

@dataclass
class DomainAnalysis:
    domain: str
    category: Literal["PREMIUM_KEEP", "FLIP_HOLD", "FLIP_FAST"]
    niche: str
    value_score: int
    estimated_flip_price: int
    strategy: str
    reason: str

class DomainClassifier:
    """AI-powered domain categorization"""

    # High-value keywords = Premium
    PREMIUM_KEYWORDS = [
        'ai', 'tools', 'app', 'pro', 'io', 'dev', 'design', 'video', 'image',
        'generator', 'automation', 'software', 'platform', 'cloud'
    ]

    # Medium-value = Flip Hold
    HOLD_KEYWORDS = [
        'news', 'blog', 'media', 'marketing', 'seo', 'business', 'tech'
    ]

    # TLD value mapping
    TLD_VALUE = {
        '.com': 30, '.io': 25, '.co': 20, '.ai': 35, '.dev': 25,
        '.app': 20, '.xyz': 10, '.store': 15, '.online': 10
    }

    def __init__(self):
        self.results = []

    def analyze_domain(self, domain: str) -> DomainAnalysis:
        """Analyze single domain and return strategy"""

        domain_lower = domain.lower()
        base_name = domain.split('.')[0]
        tld = '.' + domain.split('.')[-1]

        # Calculate base score
        score = 50  # Base score

        # TLD bonus
        score += self.TLD_VALUE.get(tld, 5)

        # Length penalty/bonus
        if len(base_name) <= 5:
            score += 20  # Short = valuable
        elif len(base_name) <= 8:
            score += 10
        elif len(base_name) > 15:
            score -= 10  # Long = less valuable

        # Keyword analysis
        has_premium = any(kw in domain_lower for kw in self.PREMIUM_KEYWORDS)
        has_hold = any(kw in domain_lower for kw in self.HOLD_KEYWORDS)

        # Determine category
        if score >= 80 or has_premium:
            category = "PREMIUM_KEEP"
            flip_price = 0  # Not for sale
            strategy = "Build full SaaS, keep for revenue"
            reason = "High-value keywords or short premium domain"
        elif score >= 60 or has_hold:
            category = "FLIP_HOLD"
            flip_price = 3000 + (score * 20)
            strategy = "Build, grow 3 months, sell high"
            reason = "Good domain, worth investing time"
        else:
            category = "FLIP_FAST"
            flip_price = 800 + (score * 10)
            strategy = "Build basic, sell in 30 days"
            reason = "Standard domain, quick flip"

        # Determine niche
        niche = self._detect_niche(domain_lower)

        return DomainAnalysis(
            domain=domain,
            category=category,
            niche=niche,
            value_score=score,
            estimated_flip_price=flip_price,
            strategy=strategy,
            reason=reason
        )

    def _detect_niche(self, domain: str) -> str:
        """Auto-detect niche from domain name"""
        niches = {
            'ai': 'AI Tools', 'image': 'Image/Design', 'video': 'Video',
            'design': 'Design', 'marketing': 'Marketing', 'seo': 'SEO',
            'news': 'News/Media', 'blog': 'Blogging', 'shop': 'E-commerce',
            'store': 'E-commerce', 'app': 'SaaS', 'tools': 'Developer Tools',
            'home': 'Real Estate', 'house': 'Real Estate', 'rent': 'Real Estate',
            'medical': 'Healthcare', 'health': 'Healthcare', 'skin': 'Beauty',
            'credit': 'Finance', 'money': 'Finance', 'bd': 'Bangladesh Local',
            'bangla': 'Bangladesh Content', 'prompt': 'AI Prompts'
        }

        for keyword, niche in niches.items():
            if keyword in domain:
                return niche
        return "General Tech"

    def batch_classify(self, domains: list) -> list:
        """Classify multiple domains"""
        results = []
        premium_count = 0
        flip_hold_count = 0
        flip_fast_count = 0

        print(f"\n🔍 Analyzing {len(domains)} domains...\n")

        for domain in domains:
            analysis = self.analyze_domain(domain)
            results.append(analysis)

            # Count categories
            if analysis.category == "PREMIUM_KEEP":
                premium_count += 1
            elif analysis.category == "FLIP_HOLD":
                flip_hold_count += 1
            else:
                flip_fast_count += 1

        # Print summary
        print("=" * 60)
        print("CLASSIFICATION SUMMARY")
        print("=" * 60)
        print(f"🌟 PREMIUM KEEP:   {premium_count:3d} domains (Build SaaS, keep)")
        print(f"⏳ FLIP HOLD:      {flip_hold_count:3d} domains (Build & grow 3mo)")
        print(f"💨 FLIP FAST:      {flip_fast_count:3d} domains (Quick 30-day flip)")
        print(f"📊 TOTAL VALUE:    ${sum(r.estimated_flip_price for r in results):,}")
        print("=" * 60)

        return results

    def export_strategy(self, results: list, filename: str = "domain_strategy.json"):
        """Export classification to JSON"""
        data = [
            {
                "domain": r.domain,
                "category": r.category,
                "niche": r.niche,
                "value_score": r.value_score,
                "estimated_price": r.estimated_flip_price,
                "strategy": r.strategy
            }
            for r in results
        ]

        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)

        print(f"\n✅ Strategy exported to {filename}")

# Example usage
if __name__ == "__main__":
    # Your actual domain list (subset for testing)
    test_domains = [
        "agentsai.tools", "aipics.pics", "aivideos.dev", "text2pixel.com",
        "homeai.design", "breakingbd.news", "1prompts.com", "bdai.dev",
        "futureai.xyz", "cheaptools.xyz"
    ]

    classifier = DomainClassifier()
    results = classifier.batch_classify(test_domains)

    # Show details
    print("\n📋 DETAILED BREAKDOWN:")
    for r in results:
        icon = "🌟" if r.category == "PREMIUM_KEEP" else "⏳" if r.category == "FLIP_HOLD" else "💨"
        print(f"{icon} {r.domain:20s} | {r.category:15s} | {r.niche:15s} | Score: {r.value_score}")
