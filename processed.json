"""
NEXUS AutoSeller
Automatically lists and sells flip domains
"""

import json
import os
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from dataclasses import dataclass

@dataclass
class SaleListing:
    domain: str
    platform: str
    asking_price: int
    listing_url: str
    status: str  # "listed", "offer_received", "sold", "delisted"
    listed_date: datetime
    traffic: int
    revenue: float
    description: str

class AutoSeller:
    """
    Automated domain sales system
    Lists flip domains on multiple platforms
    Handles inquiries with AI responses
    Manages transfers
    """

    def __init__(self):
        self.platforms = {
            "flippa": {"commission": 0.15, "avg_sale_time": 30},
            "sedo": {"commission": 0.15, "avg_sale_time": 45},
            "afternic": {"commission": 0.20, "avg_sale_time": 60},
            "dan": {"commission": 0.09, "avg_sale_time": 25},
            "empireflippers": {"commission": 0.15, "avg_sale_time": 14}
        }
        self.listings_file = "domains/listings.json"
        self.load_listings()

    def load_listings(self):
        """Load existing listings"""
        if os.path.exists(self.listings_file):
            with open(self.listings_file) as f:
                self.listings = json.load(f)
        else:
            self.listings = {}

    def save_listings(self):
        """Save listings to file"""
        os.makedirs(os.path.dirname(self.listings_file), exist_ok=True)
        with open(self.listings_file, 'w') as f:
            json.dump(self.listings, f, indent=2)

    async def auto_list_domain(self, domain: str, analysis: Dict, site_path: str) -> Dict:
        """
        Automatically list domain for sale when ready
        Triggered after site is live for 30 days or has traffic
        """

        print(f"\n🏷️  Auto-listing {domain} for sale...")

        # Get site metrics
        metrics = await self._get_site_metrics(domain, site_path)

        # Calculate asking price
        price = self._calculate_asking_price(domain, analysis, metrics)

        # Choose best platform
        platform = self._choose_platform(domain, analysis)

        # Generate listing description
        description = self._generate_listing_description(domain, analysis, metrics)

        # Create listings on multiple platforms
        listings = []
        for plat in ["flippa", "sedo", "dan"]:
            listing = await self._create_listing(plat, domain, price, description, metrics)
            listings.append(listing)
            print(f"   ✓ Listed on {plat}: ${price}")

        # Save to tracking
        self.listings[domain] = {
            "domain": domain,
            "asking_price": price,
            "platforms": [l["platform"] for l in listings],
            "listed_date": datetime.now().isoformat(),
            "metrics": metrics,
            "status": "active",
            "offers": [],
            "description": description
        }
        self.save_listings()

        # Send notification
        await self._notify_new_listing(domain, price, metrics)

        return {
            "domain": domain,
            "price": price,
            "listings": listings,
            "estimated_sale_time": "14-30 days"
        }

    async def _get_site_metrics(self, domain: str, site_path: str) -> Dict:
        """Get traffic and revenue metrics"""
        # In production, this would query analytics APIs
        # For now, return estimated/project metrics

        return {
            "monthly_traffic": 150,  # Estimated
            "monthly_revenue": 25,   # From ads/affiliates
            "domain_age_days": 30,
            "backlinks": 5,
            "social_followers": 0,
            "content_pages": 10
        }

    def _calculate_asking_price(self, domain: str, analysis: Dict, metrics: Dict) -> int:
        """
        Calculate optimal asking price
        Based on: domain value + traffic + revenue potential
        """

        # Base price from domain quality
        base_price = analysis.get("estimated_flip_price", 1000)

        # Traffic multiplier
        traffic = metrics.get("monthly_traffic", 0)
        if traffic > 1000:
            traffic_value = traffic * 0.50  # $0.50 per visitor
        elif traffic > 100:
            traffic_value = traffic * 0.30
        else:
            traffic_value = traffic * 0.10

        # Revenue multiplier (12 months)
        monthly_revenue = metrics.get("monthly_revenue", 0)
        revenue_value = monthly_revenue * 12 * 2  # 2x annual revenue

        # Calculate total
        total = base_price + traffic_value + revenue_value

        # Round to nice number
        if total < 1000:
            return round(total / 100) * 100  # Round to nearest 100
        elif total < 5000:
            return round(total / 250) * 250  # Round to nearest 250
        else:
            return round(total / 500) * 500  # Round to nearest 500

    def _choose_platform(self, domain: str, analysis: Dict) -> str:
        """Choose best platform based on domain value"""

        score = analysis.get("value_score", 50)

        if score >= 80:
            return "empireflippers"  # High-value domains
        elif score >= 60:
            return "flippa"  # Mid-range
        else:
            return "sedo"  # Standard domains

    def _generate_listing_description(self, domain: str, analysis: Dict, metrics: Dict) -> str:
        """
        Generate compelling listing description using AI
        """

        niche = analysis.get("niche", "Technology")

        template = f"""
🚀 Premium {niche} Domain - {domain}

✅ What's Included:
• Fully functional {niche} website
• Professional design with modern UI
• SEO-optimized content (10+ pages)
• Mobile responsive
• Revenue ready (AdSense + affiliate setup)
• Email list capture system

📊 Current Metrics:
• Monthly Traffic: {metrics.get('monthly_traffic', 'N/A')} visitors
• Domain Age: {metrics.get('domain_age_days', 30)} days
• Revenue: ${metrics.get('monthly_revenue', 0)}/month potential
• Backlinks: {metrics.get('backlinks', 0)}

💡 Growth Opportunities:
• Add premium features
• Content marketing
• Social media promotion
• Paid advertising

🔥 Why Buy This Domain:
• Exact match keywords for {niche}
• Growing market demand
• Automated income potential
• Easy to scale

📞 Support:
• 30-day transfer assistance
• Setup guidance included
• Post-sale support available

Don't miss this opportunity to own a premium {niche} asset!
"""

        return template.strip()

    async def _create_listing(self, platform: str, domain: str, price: int, description: str, metrics: Dict) -> Dict:
        """Create listing on specific platform (API integration)"""

        # This would integrate with actual APIs
        # For now, return simulated response

        platform_urls = {
            "flippa": f"https://flippa.com/listing/{domain.replace('.', '-')}",
            "sedo": f"https://sedo.com/search/details/?domain={domain}",
            "dan": f"https://dan.com/buy-domain/{domain}",
            "afternic": f"https://afternic.com/domain/{domain}",
            "empireflippers": f"https://empireflippers.com/listing/{domain}"
        }

        return {
            "platform": platform,
            "status": "active",
            "asking_price": price,
            "listing_url": platform_urls.get(platform, ""),
            "listing_id": f"{platform}_{domain.replace('.', '_')}_{int(datetime.now().timestamp())}",
            "commission_rate": self.platforms[platform]["commission"],
            "estimated_sale_time": self.platforms[platform]["avg_sale_time"]
        }

    async def check_offers(self) -> List[Dict]:
        """
        Check for new offers on all listings
        Runs hourly via automation
        """

        print("\n📬 Checking for new offers...")

        new_offers = []

        for domain, listing in self.listings.items():
            if listing["status"] != "active":
                continue

            # In production, this would check APIs
            # For now, simulate occasional offers

            # Check if listing is > 7 days old
            listed_date = datetime.fromisoformat(listing["listed_date"])
            days_listed = (datetime.now() - listed_date).days

            if days_listed > 7 and days_listed % 3 == 0:  # Simulate periodic offers
                offer = {
                    "domain": domain,
                    "amount": int(listing["asking_price"] * 0.8),  # 80% offer
                    "buyer": f"buyer_{int(datetime.now().timestamp())}@email.com",
                    "date": datetime.now().isoformat(),
                    "platform": "flippa",
                    "message": "Interested in this domain. Can we negotiate?"
                }

                listing["offers"].append(offer)
                new_offers.append(offer)

                print(f"   💰 New offer for {domain}: ${offer['amount']}")

                # Auto-respond with counter offer
                await self._auto_respond_offer(domain, offer)

        if new_offers:
            self.save_listings()
            await self._notify_new_offers(new_offers)
        else:
            print("   No new offers")

        return new_offers

    async def _auto_respond_offer(self, domain: str, offer: Dict):
        """
        AI auto-responds to offers
        Negotiates on your behalf
        """

        listing = self.listings[domain]
        asking_price = listing["asking_price"]
        offer_amount = offer["amount"]

        # Calculate counter offer
        if offer_amount >= asking_price * 0.9:
            # Accept if close to asking
            response = f"""
Hi,

Thank you for your offer of ${offer_amount} for {domain}.

I'm happy to accept this offer! The domain is yours.

Let's proceed with the transfer.

Best regards
"""
            action = "accept"

        elif offer_amount >= asking_price * 0.7:
            # Counter offer
            counter = int(asking_price * 0.95)
            response = f"""
Hi,

Thanks for your interest in {domain}!

Your offer of ${offer_amount} is appreciated, but I was looking for closer to ${asking_price}.

Would you consider ${counter}? This includes:
• Full domain ownership
• Website files and content
• 30 days support
• Smooth transfer

Let me know!

Best
"""
            action = "counter"

        else:
            # Reject politely
            response = f"""
Hi,

Thank you for your offer of ${offer_amount} for {domain}.

Unfortunately, this is below my minimum acceptable price of ${int(asking_price * 0.8)}.

The domain has strong potential in the {listing.get('niche', 'tech')} space with existing traffic and revenue setup.

If you can increase your offer, please let me know!

Best regards
"""
            action = "reject"

        print(f"   🤖 Auto-responded: {action.upper()}")
        # In production, send email via API

    async def process_sale(self, domain: str, offer_amount: int, buyer_email: str) -> Dict:
        """
        Process domain sale
        - Transfer domain
        - Send files
        - Update records
        """

        print(f"\n💎 Processing sale: {domain} for ${offer_amount}")

        # Update listing
        self.listings[domain]["status"] = "sold"
        self.listings[domain]["sale_price"] = offer_amount
        self.listings[domain]["sale_date"] = datetime.now().isoformat()
        self.listings[domain]["buyer"] = buyer_email
        self.save_listings()

        # Calculate net proceeds
        platform = self.listings[domain]["platforms"][0]
        commission = offer_amount * self.platforms[platform]["commission"]
        net = offer_amount - commission

        # Trigger domain transfer (API call to registrar)
        transfer_initiated = await self._initiate_domain_transfer(domain, buyer_email)

        # Send handover email
        await self._send_handover_email(domain, buyer_email, offer_amount)

        print(f"   ✅ Sale complete!")
        print(f"   💰 Gross: ${offer_amount}")
        print(f"   📊 Commission: -${commission}")
        print(f"   🏦 Net: ${net}")

        return {
            "domain": domain,
            "sale_price": offer_amount,
            "net_proceeds": net,
            "commission": commission,
            "buyer": buyer_email,
            "transfer_initiated": transfer_initiated
        }

    async def _initiate_domain_transfer(self, domain: str, buyer_email: str) -> bool:
        """Initiate domain transfer to buyer"""
        # In production: API call to Cloudflare/Namecheap/etc
        print(f"   📤 Domain transfer initiated to {buyer_email}")
        return True

    async def _send_handover_email(self, domain: str, buyer_email: str, price: int):
        """Send handover instructions to buyer"""
        # In production: Send via SendGrid/AWS SES
        print(f"   📧 Handover email sent to {buyer_email}")

    async def _notify_new_listing(self, domain: str, price: int, metrics: Dict):
        """Send notification about new listing"""
        print(f"\n📢 NEW LISTING: {domain} - ${price}")
        print(f"   Estimated sale: 14-30 days")

    async def _notify_new_offers(self, offers: List[Dict]):
        """Send notification about new offers"""
        print(f"\n🎯 {len(offers)} new offers received!")
        for offer in offers:
            print(f"   {offer['domain']}: ${offer['amount']}")

    def get_sales_report(self) -> Dict:
        """Generate sales report"""

        total_listings = len(self.listings)
        active_listings = sum(1 for l in self.listings.values() if l["status"] == "active")
        sold_domains = [l for l in self.listings.values() if l["status"] == "sold"]

        total_revenue = sum(l.get("sale_price", 0) for l in sold_domains)
        total_commissions = sum(l.get("sale_price", 0) * 0.15 for l in sold_domains)  # Avg 15%

        return {
            "total_listings": total_listings,
            "active_listings": active_listings,
            "sold_count": len(sold_domains),
            "total_revenue": total_revenue,
            "total_commissions": total_commissions,
            "net_profit": total_revenue - total_commissions,
            "domains_sold": sold_domains
        }

# Export
__all__ = ['AutoSeller', 'SaleListing']
