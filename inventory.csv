"""
NEXUS Empire Orchestrator
Coordinates all automation for 260+ domains
"""

import asyncio
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import List, Dict
import schedule
import time

from core.classifier import DomainClassifier
from core.builder import SiteBuilder

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NexusOrchestrator:
    """
    Main automation controller for the domain empire
    Runs 24/7, manages all 260+ domains
    """

    def __init__(self):
        self.classifier = DomainClassifier()
        self.builder = SiteBuilder()

        self.domains_file = "domains/inventory.csv"
        self.state_file = "domains/processed.json"
        self.state = self._load_state()

        # Statistics
        self.stats = {
            "total_domains": 0,
            "premium_built": 0,
            "flip_built": 0,
            "sold": 0,
            "revenue": 0
        }

    def _load_state(self) -> Dict:
        """Load processing state"""
        if Path(self.state_file).exists():
            with open(self.state_file) as f:
                return json.load(f)
        return {"processed": [], "building": [], "live": [], "sold": []}

    def _save_state(self):
        """Save current state"""
        with open(self.state_file, 'w') as f:
            json.dump(self.state, f, indent=2)

    def load_domains(self, csv_file: str = None) -> List[str]:
        """Load domain list from CSV"""
        if csv_file is None:
            csv_file = self.domains_file

        domains = []
        if Path(csv_file).exists():
            with open(csv_file) as f:
                for line in f:
                    domain = line.strip()
                    if domain and not domain.startswith('#'):
                        domains.append(domain)

        self.stats["total_domains"] = len(domains)
        logger.info(f"Loaded {len(domains)} domains")
        return domains

    async def run_full_pipeline(self, batch_size: int = 10):
        """
        Full automation pipeline:
        1. Classify all domains
        2. Build batch_size sites
        3. Deploy
        4. Start monitoring
        """

        # Step 1: Load and classify
        domains = self.load_domains()
        unprocessed = [d for d in domains if d not in self.state["processed"]]

        if not unprocessed:
            logger.info("All domains processed!")
            return

        logger.info(f"Processing {len(unprocessed)} unprocessed domains")

        # Classify
        analyses = self.classifier.batch_classify(unprocessed[:batch_size])

        # Step 2: Build sites
        logger.info(f"\n🏗️  Building {len(analyses)} sites...")
        build_tasks = []

        for analysis in analyses:
            if analysis.category == "PREMIUM_KEEP":
                # Premium sites take longer
                build_tasks.append(self._build_with_delay(analysis, delay=0))
            else:
                # Flip sites faster
                build_tasks.append(self._build_with_delay(analysis, delay=0))

        # Build in parallel
        results = await asyncio.gather(*build_tasks, return_exceptions=True)

        # Step 3: Process results
        for domain, result in zip([a.domain for a in analyses], results):
            if isinstance(result, Exception):
                logger.error(f"Failed to build {domain}: {result}")
            else:
                logger.info(f"✅ Successfully built {domain}")
                self.state["processed"].append(domain)
                self.state["live"].append(domain)

                if any(a.domain == domain and a.category == "PREMIUM_KEEP" for a in analyses):
                    self.stats["premium_built"] += 1
                else:
                    self.stats["flip_built"] += 1

        self._save_state()

        # Step 4: Report
        self._generate_report()

    async def _build_with_delay(self, analysis, delay: int = 0):
        """Build site with optional delay"""
        if delay > 0:
            await asyncio.sleep(delay)
        return self.builder.build_site(analysis)

    def _generate_report(self):
        """Generate status report"""
        report = f"""
{"="*60}
NEXUS EMPIRE DAILY REPORT - {datetime.now().strftime('%Y-%m-%d %H:%M')}
{"="*60}

PORTFOLIO STATUS:
  Total Domains:     {self.stats['total_domains']}
  Premium Sites:     {self.stats['premium_built']} (Revenue generators)
  Flip Sites:        {self.stats['flip_built']} (For sale)
  Sold:              {self.stats['sold']}
  Remaining:         {self.stats['total_domains'] - len(self.state['processed'])}

LIVE ASSETS:
  {len(self.state['live'])} sites currently deployed

NEXT ACTIONS:
  - Build next batch: {min(10, self.stats['total_domains'] - len(self.state['processed']))} domains
  - Monitor SEO for all live sites
  - Check flip sale inquiries

ESTIMATED VALUE:
  Current Portfolio: ${self.stats['flip_built'] * 1500 + self.stats['premium_built'] * 5000:,}
  Monthly Revenue:   ${self.stats['premium_built'] * 500:,} (projected)

{"="*60}
"""
        print(report)

        # Save report
        with open(f"reports/daily_{datetime.now().strftime('%Y%m%d')}.txt", 'w') as f:
            f.write(report)

    def schedule_automation(self):
        """Schedule recurring tasks"""
        # Build 10 sites every day at 2 AM
        schedule.every().day.at("02:00").do(
            lambda: asyncio.run(self.run_full_pipeline(batch_size=10))
        )

        # Generate report every morning at 8 AM
        schedule.every().day.at("08:00").do(self._generate_report)

        # Check for sales/inquiries every hour
        schedule.every().hour.do(self._check_sales)

        logger.info("Automation scheduled:")
        logger.info("  - Build: Daily at 2:00 AM (10 sites)")
        logger.info("  - Report: Daily at 8:00 AM")
        logger.info("  - Sales check: Every hour")

    def _check_sales(self):
        """Check for domain sale inquiries"""
        # Placeholder for sales checking logic
        logger.info("Checking for sale inquiries...")

    def run_scheduler(self):
        """Run the scheduled automation loop"""
        logger.info("\n🚀 NEXUS EMPIRE OS Running 24/7")
        logger.info("Press Ctrl+C to stop\n")

        while True:
            schedule.run_pending()
            time.sleep(60)

# CLI Interface
if __name__ == "__main__":
    import sys

    nexus = NexusOrchestrator()

    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "classify":
            # Just classify domains
            domains = nexus.load_domains()
            analyses = nexus.classifier.batch_classify(domains[:20])
            nexus.classifier.export_strategy(analyses)

        elif command == "build":
            # Build batch
            batch_size = int(sys.argv[2]) if len(sys.argv) > 2 else 5
            asyncio.run(nexus.run_full_pipeline(batch_size=batch_size))

        elif command == "auto":
            # Start 24/7 automation
            nexus.schedule_automation()
            nexus.run_scheduler()

        elif command == "report":
            # Generate report
            nexus._generate_report()

        else:
            print("Commands: classify, build [n], auto, report")
    else:
        # Default: run single batch
        asyncio.run(nexus.run_full_pipeline(batch_size=5))
