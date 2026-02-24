"""
NEXUS Alerts System
Sends notifications for important events
"""

import os
import json
import asyncio
from datetime import datetime
from typing import Dict, List
import requests

class AlertManager:
    """
    Manages all notifications for the empire
    - Slack for real-time alerts
    - Email for daily summaries
    - SMS for critical events (optional)
    """

    def __init__(self):
        self.slack_webhook = os.getenv("SLACK_WEBHOOK_URL")
        self.email_config = {
            "smtp_server": os.getenv("EMAIL_SMTP_SERVER"),
            "username": os.getenv("EMAIL_USERNAME"),
            "password": os.getenv("EMAIL_PASSWORD"),
            "from": os.getenv("EMAIL_FROM", "nexus@empire.local")
        }

    async def send_sale_alert(self, domain: str, price: int, buyer: str):
        """Alert when domain sells"""

        message = f"""
🎉 **DOMAIN SOLD!** 🎉

**{domain}** sold for **${price:,}**

Buyer: {buyer}
Time: {datetime.now().strftime('%Y-%m-%d %H:%M')}

Next steps:
• Transfer domain
• Send handover email
• Update records
        """

        await self._send_slack(message)
        await self._send_email(
            subject=f"🎉 Sold: {domain} for ${price:,}",
            body=message
        )

    async def send_offer_alert(self, domain: str, amount: int, platform: str):
        """Alert when offer received"""

        message = f"""
💰 **NEW OFFER RECEIVED**

Domain: **{domain}**
Amount: **${amount:,}**
Platform: {platform}

Action needed: Review and respond
        """

        await self._send_slack(message)

    async def send_build_complete(self, domains: List[str]):
        """Alert when batch build completes"""

        domains_str = "\n".join([f"• {d}" for d in domains])

        message = f"""
✅ **BUILD COMPLETE**

{len(domains)} sites built and deployed:
{domains_str}

All sites are now live!
        """

        await self._send_slack(message)

    async def send_daily_report(self, stats: Dict):
        """Daily summary report"""

        message = f"""
📊 **DAILY EMPIRE REPORT** - {datetime.now().strftime('%Y-%m-%d')}

**Portfolio Status:**
• Total Domains: {stats.get('total_domains', 0)}
• Live Sites: {stats.get('live', 0)}
• Pending: {stats.get('pending', 0)}

**Revenue:**
• Today: ${stats.get('daily_revenue', 0):,}
• Month: ${stats.get('monthly_revenue', 0):,}
• Total: ${stats.get('total_revenue', 0):,}

**Sales:**
• New Offers: {stats.get('new_offers', 0)}
• Domains Sold: {stats.get('domains_sold_today', 0)}
• Active Listings: {stats.get('active_listings', 0)}

Keep growing! 🚀
        """

        await self._send_slack(message)
        await self._send_email(
            subject=f"📊 Daily Report: ${stats.get('daily_revenue', 0):,} revenue",
            body=message
        )

    async def send_error_alert(self, error: str, context: str):
        """Alert on critical errors"""

        message = f"""
🚨 **ERROR ALERT** 🚨

**Error:** {error}
**Context:** {context}
**Time:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Please check the system immediately.
        """

        await self._send_slack(message)

    async def _send_slack(self, message: str):
        """Send Slack notification"""
        if not self.slack_webhook:
            print(f"[SLACK] {message}")
            return

        try:
            payload = {"text": message}
            response = requests.post(self.slack_webhook, json=payload)
            if response.status_code != 200:
                print(f"Failed to send Slack: {response.status_code}")
        except Exception as e:
            print(f"Slack error: {e}")

    async def _send_email(self, subject: str, body: str):
        """Send email notification"""
        # In production, use smtplib
        print(f"[EMAIL] {subject}")
        print(f"         {body[:100]}...")

# Export
__all__ = ['AlertManager']
