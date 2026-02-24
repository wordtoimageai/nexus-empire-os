#!/usr/bin/env python3
"""
NEXUS Empire OS - Main Entry Point
Run: python3 main.py [command]
"""

import sys
import asyncio
import argparse
from pathlib import Path

# Add core to path
sys.path.insert(0, str(Path(__file__).parent))

from core.orchestrator import NexusOrchestrator
from core.classifier import DomainClassifier
from core.monetizer import AutoMonetizer
from core.seller import AutoSeller
from workers.content_worker import ContentAutomation

async def main():
    parser = argparse.ArgumentParser(
        description="NEXUS Empire OS - Domain Empire Automation",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 main.py classify              # Classify all domains
  python3 main.py build 10              # Build 10 sites
  python3 main.py auto                  # Start 24/7 automation
  python3 main.py content               # Generate content
  python3 main.py list                  # List domains for sale
  python3 main.py report                # Generate report
        """
    )

    parser.add_argument(
        'command',
        choices=['classify', 'build', 'auto', 'content', 'list', 'report', 'dashboard', 'test'],
        help='Command to execute'
    )
    parser.add_argument(
        'arg',
        nargs='?',
        help='Additional argument (e.g., number of sites to build)'
    )

    args = parser.parse_args()

    # Initialize orchestrator
    nexus = NexusOrchestrator()

    print("""
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║                 🏭 NEXUS EMPIRE OS v1.0                       ║
║                                                               ║
║           Automated Domain Empire Management                  ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    """)

    if args.command == "classify":
        print("\n🔍 CLASSIFYING DOMAINS...")
        print("="*60)

        domains = nexus.load_domains()
        classifier = DomainClassifier()
        analyses = classifier.batch_classify(domains)

        # Show breakdown
        premium = sum(1 for a in analyses if a.category == "PREMIUM_KEEP")
        flip_hold = sum(1 for a in analyses if a.category == "FLIP_HOLD")
        flip_fast = sum(1 for a in analyses if a.category == "FLIP_FAST")

        print(f"\n📊 RESULTS:")
        print(f"   Premium (Keep):  {premium:3d} domains")
        print(f"   Flip (Hold):     {flip_hold:3d} domains")
        print(f"   Flip (Fast):     {flip_fast:3d} domains")
        print(f"   Total Value:     ${sum(a.estimated_flip_price for a in analyses):,}")

        # Export
        classifier.export_strategy(analyses)

    elif args.command == "build":
        count = int(args.arg) if args.arg else 5
        print(f"\n🏗️  BUILDING {count} SITES...")
        print("="*60)

        await nexus.run_full_pipeline(batch_size=count)

        print(f"\n✅ Build complete!")
        print(f"   Check built_sites/ folder")

    elif args.command == "auto":
        print("\n🤖 STARTING 24/7 AUTOMATION...")
        print("="*60)
        print("\nScheduled tasks:")
        print("   • Build 10 sites daily at 2:00 AM")
        print("   • Generate content at 3:00 AM")
        print("   • Check offers hourly")
        print("   • Generate report at 8:00 AM")
        print("\nPress Ctrl+C to stop\n")

        nexus.schedule_automation()
        nexus.run_scheduler()

    elif args.command == "content":
        print("\n✍️  GENERATING CONTENT...")
        print("="*60)

        worker = ContentAutomation()

        # Load live sites
        domains = nexus.load_domains()[:10]  # First 10 for demo
        sites = [{"domain": d, "niche": "AI Tools", "category": "FLIP_HOLD"} for d in domains]

        await worker.batch_content_generation(sites)

    elif args.command == "list":
        print("\n🏷️  LISTING DOMAINS FOR SALE...")
        print("="*60)

        seller = AutoSeller()

        # Get flip-ready domains
        domains = nexus.load_domains()[:5]  # Demo with 5

        for domain in domains:
            analysis = {
                "value_score": 70,
                "niche": "AI Tools",
                "estimated_flip_price": 1500
            }

            result = await seller.auto_list_domain(domain, analysis, f"built_sites/{domain}")
            print(f"\n✓ {domain} listed at ${result['price']}")
            print(f"   Platforms: {', '.join(result['listings'])}")

    elif args.command == "report":
        print("\n📊 GENERATING REPORT...")
        print("="*60)

        nexus._generate_report()

        # Sales report
        seller = AutoSeller()
        sales = seller.get_sales_report()

        print(f"\n💰 SALES SUMMARY:")
        print(f"   Total Listings: {sales['total_listings']}")
        print(f"   Active:         {sales['active_listings']}")
        print(f"   Sold:           {sales['sold_count']}")
        print(f"   Total Revenue:  ${sales['total_revenue']:,}")
        print(f"   Net Profit:     ${sales['net_profit']:,}")

    elif args.command == "dashboard":
        print("\n🌐 STARTING DASHBOARD...")
        print("="*60)
        print("\nDashboard available at: http://localhost:3000")
        print("\nStarting server...")

        import uvicorn
        from monitoring.dashboard import app
        uvicorn.run(app, host="0.0.0.0", port=3000)

    elif args.command == "test":
        print("\n🧪 RUNNING TEST...")
        print("="*60)

        # Test full pipeline with 1 domain
        print("\n1. Testing classifier...")
        classifier = DomainClassifier()
        test = classifier.analyze_domain("aipics.pics")
        print(f"   ✓ {test.domain} -> {test.category}")

        print("\n2. Testing builder...")
        from core.builder import SiteBuilder
        builder = SiteBuilder()
        path = builder.build_site(test)
        print(f"   ✓ Built at: {path}")

        print("\n3. Testing monetizer...")
        monetizer = AutoMonetizer()
        config = monetizer.setup_monetization(test.domain, test.category, test.niche)
        print(f"   ✓ Revenue model: {config.revenue_model}")

        print("\n✅ All tests passed!")
        print(f"\nTest site built at: built_sites/{test.domain}/")

    print("\n" + "="*60)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n👋 Stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
