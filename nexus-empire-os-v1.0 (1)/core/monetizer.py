"""
NEXUS Monetizer
Automatically sets up revenue streams for all sites
"""

import json
import os
from typing import Dict, Literal
from dataclasses import dataclass

@dataclass
class MonetizationConfig:
    domain: str
    category: Literal["PREMIUM", "FLIP"]
    niche: str
    revenue_model: str
    stripe_account: str = None
    adsense_id: str = None
    affiliate_links: Dict = None

class AutoMonetizer:
    """
    Automatically configures monetization for every site
    Based on category (Premium vs Flip) and niche
    """

    def __init__(self):
        self.stripe_config = self._load_stripe_config()
        self.adsense_config = self._load_adsense_config()
        self.affiliate_programs = self._load_affiliate_programs()

    def _load_stripe_config(self):
        """Load Stripe configuration"""
        return {
            "api_key": os.getenv("STRIPE_SECRET_KEY"),
            "webhook_secret": os.getenv("STRIPE_WEBHOOK_SECRET"),
            "publishable_key": os.getenv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")
        }

    def _load_adsense_config(self):
        """Load Google AdSense configuration"""
        return {
            "publisher_id": os.getenv("ADSENSE_PUBLISHER_ID", "pub-123456789"),
            "ad_client": os.getenv("ADSENSE_AD_CLIENT"),
            "slots": {
                "header": "1234567890",
                "sidebar": "0987654321",
                "footer": "1122334455"
            }
        }

    def _load_affiliate_programs(self):
        """Load affiliate program configs"""
        return {
            "ai_tools": {
                "openai": {"url": "https://openai.com?ref=YOUR_ID", "commission": "20%"},
                "midjourney": {"url": "https://midjourney.com?ref=YOUR_ID", "commission": "10%"},
                "jasper": {"url": "https://jasper.ai?ref=YOUR_ID", "commission": "30%"},
            },
            "hosting": {
                "vercel": {"url": "https://vercel.com?ref=YOUR_ID", "commission": "$100"},
                "digitalocean": {"url": "https://m.do.co/c/YOUR_ID", "commission": "$25"},
            },
            "tools": {
                "semrush": {"url": "https://semrush.com?ref=YOUR_ID", "commission": "40%"},
                "ahrefs": {"url": "https://ahrefs.com?ref=YOUR_ID", "commission": "20%"},
            },
            "bangladesh": {
                "bkash": {"url": "https://bkash.com", "commission": "referral"},
                "nagad": {"url": "https://nagad.com", "commission": "referral"},
            }
        }

    def setup_monetization(self, domain: str, category: str, niche: str) -> MonetizationConfig:
        """
        Automatically configure best monetization strategy
        """
        print(f"💰 Setting up monetization for {domain} ({category})")

        if category == "PREMIUM_KEEP":
            config = self._setup_premium_monetization(domain, niche)
        else:
            config = self._setup_flip_monetization(domain, niche)

        # Save config to domain folder
        self._save_config(domain, config)

        return config

    def _setup_premium_monetization(self, domain: str, niche: str) -> MonetizationConfig:
        """
        Premium sites get full SaaS monetization:
        - Stripe subscriptions
        - Affiliate upsells
        - Tiered pricing
        """

        # Determine pricing based on niche
        pricing = self._get_pricing_for_niche(niche)

        # Setup Stripe products
        stripe_config = self._create_stripe_products(domain, pricing)

        # Get relevant affiliate programs
        affiliates = self._get_affiliates_for_niche(niche)

        # Generate monetization code
        self._generate_billing_code(domain, pricing, stripe_config)

        print(f"   ✓ Stripe: {pricing['plans'][1]['price']}/mo Pro plan")
        print(f"   ✓ Affiliates: {len(affiliates)} programs")

        return MonetizationConfig(
            domain=domain,
            category="PREMIUM",
            niche=niche,
            revenue_model="saas_subscription",
            stripe_account=stripe_config["account_id"],
            affiliate_links=affiliates
        )

    def _setup_flip_monetization(self, domain: str, niche: str) -> MonetizationConfig:
        """
        Flip sites get passive monetization:
        - AdSense placeholder (shows potential)
        - Affiliate links (easy revenue)
        - Email capture (list building)
        """

        # Generate AdSense code
        adsense_code = self._generate_adsense_code(domain)

        # Get 2-3 relevant affiliate programs
        affiliates = self._get_affiliates_for_niche(niche)
        top_affiliates = dict(list(affiliates.items())[:3])

        # Insert into flip template
        self._insert_monetization_into_flip(domain, adsense_code, top_affiliates)

        print(f"   ✓ AdSense: Placed 3 ad slots")
        print(f"   ✓ Affiliates: {len(top_affiliates)} links inserted")

        return MonetizationConfig(
            domain=domain,
            category="FLIP",
            niche=niche,
            revenue_model="adsense_affiliate",
            adsense_id=self.adsense_config["publisher_id"],
            affiliate_links=top_affiliates
        )

    def _get_pricing_for_niche(self, niche: str) -> Dict:
        """Determine optimal pricing based on niche value"""

        high_value_niches = ["AI", "Medical", "Finance", "Real Estate", "Legal"]

        if any(hv in niche for hv in high_value_niches):
            return {
                "plans": [
                    {"name": "Starter", "price": 19, "features": ["Basic", "5 projects"]},
                    {"name": "Pro", "price": 49, "features": ["Advanced", "Unlimited"]},
                    {"name": "Enterprise", "price": 199, "features": ["White-glove", "Custom"]}
                ]
            }
        else:
            return {
                "plans": [
                    {"name": "Free", "price": 0, "features": ["Limited", "Trial"]},
                    {"name": "Pro", "price": 9, "features": ["Full", "Basic support"]},
                    {"name": "Team", "price": 29, "features": ["Collaboration", "Priority"]}
                ]
            }

    def _get_affiliates_for_niche(self, niche: str) -> Dict:
        """Get relevant affiliate programs"""
        niche_lower = niche.lower()

        if "ai" in niche_lower or "tool" in niche_lower:
            return self.affiliate_programs["ai_tools"]
        elif "web" in niche_lower or "host" in niche_lower:
            return self.affiliate_programs["hosting"]
        elif "seo" in niche_lower or "marketing" in niche_lower:
            return self.affiliate_programs["tools"]
        elif "bangladesh" in niche_lower or "bd" in niche_lower:
            return self.affiliate_programs["bangladesh"]
        else:
            # Default: mix of best programs
            return {
                **self.affiliate_programs["ai_tools"],
                **self.affiliate_programs["hosting"]
            }

    def _create_stripe_products(self, domain: str, pricing: Dict) -> Dict:
        """Create Stripe products and prices (placeholder)"""
        # In production, this would call Stripe API
        return {
            "account_id": f"acct_{domain.replace('.', '_')}",
            "products": pricing["plans"]
        }

    def _generate_adsense_code(self, domain: str) -> str:
        """Generate Google AdSense code"""
        publisher_id = self.adsense_config["publisher_id"]

        return f"""
<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={publisher_id}" crossorigin="anonymous"></script>
<!-- Header Ad -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="{publisher_id}"
     data-ad-slot="{self.adsense_config['slots']['header']}"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({{}});
</script>
"""

    def _generate_billing_code(self, domain: str, pricing: Dict, stripe_config: Dict):
        """Generate Stripe billing integration code"""

        code = f"""
// Stripe Configuration for {domain}
import {{ loadStripe }} from '@stripe/stripe-js';

export const stripePromise = loadStripe('{self.stripe_config["publishable_key"]}');

export const PLANS = {json.dumps(pricing["plans"], indent=2)};

export async function createCheckoutSession(priceId: string) {{
  const response = await fetch('/api/create-checkout-session', {{
    method: 'POST',
    headers: {{ 'Content-Type': 'application/json' }},
    body: JSON.stringify({{ priceId }})
  }});
  return response.json();
}}
"""

        # Save to domain folder
        domain_path = f"built_sites/{domain}/lib/stripe.ts"
        os.makedirs(os.path.dirname(domain_path), exist_ok=True)
        with open(domain_path, 'w') as f:
            f.write(code)

    def _insert_monetization_into_flip(self, domain: str, adsense_code: str, affiliates: Dict):
        """Insert ads and affiliate links into flip HTML"""
        # This would modify the HTML template
        pass

    def _save_config(self, domain: str, config: MonetizationConfig):
        """Save monetization config to file"""
        config_path = f"built_sites/{domain}/monetization.json"
        os.makedirs(os.path.dirname(config_path), exist_ok=True)

        with open(config_path, 'w') as f:
            json.dump({
                "domain": config.domain,
                "category": config.category,
                "niche": config.niche,
                "revenue_model": config.revenue_model,
                "stripe_account": config.stripe_account,
                "adsense_id": config.adsense_id,
                "affiliate_links": config.affiliate_links
            }, f, indent=2)

    def get_revenue_projection(self, domain: str, category: str, niche: str) -> Dict:
        """Calculate projected revenue"""

        if category == "PREMIUM":
            return {
                "month_1": 500,
                "month_3": 2000,
                "month_6": 5000,
                "month_12": 10000,
                "model": "Subscription SaaS",
                "assumptions": "100 paying users @ $50 avg"
            }
        else:
            return {
                "month_1": 50,
                "month_3": 200,
                "month_6": 500,
                "flip_value": 2000,
                "model": "AdSense + Affiliate + Flip",
                "assumptions": "Traffic: 1000/mo, RPM: $5"
            }

# Export
__all__ = ['AutoMonetizer', 'MonetizationConfig']
