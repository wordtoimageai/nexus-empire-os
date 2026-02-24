"""
NEXUS Monitoring Dashboard
Real-time view of all 260+ domains
"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import json
import os
from datetime import datetime

app = FastAPI(title="NEXUS Empire Dashboard")

# Load data
def load_data():
    """Load current state"""
    data = {
        "domains": [],
        "listings": {},
        "stats": {}
    }

    # Load domain inventory
    if os.path.exists("domains/inventory.csv"):
        with open("domains/inventory.csv") as f:
            for line in f:
                if line.strip() and not line.startswith('#'):
                    data["domains"].append(line.strip())

    # Load processed state
    if os.path.exists("domains/processed.json"):
        with open("domains/processed.json") as f:
            state = json.load(f)
            data["processed"] = state.get("processed", [])
            data["live"] = state.get("live", [])

    # Load listings
    if os.path.exists("domains/listings.json"):
        with open("domains/listings.json") as f:
            data["listings"] = json.load(f)

    return data

@app.get("/", response_class=HTMLResponse)
async def dashboard():
    """Main dashboard page"""

    data = load_data()
    total = len(data["domains"])
    processed = len(data.get("processed", []))
    live = len(data.get("live", []))
    pending = total - processed

    # Calculate revenue
    listings = data.get("listings", {})
    sold = [l for l in listings.values() if l.get("status") == "sold"]
    revenue = sum(l.get("sale_price", 0) for l in sold)

    html = f"""
<!DOCTYPE html>
<html>
<head>
    <title>NEXUS Empire Dashboard</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ 
            font-family: -apple-system, system-ui, sans-serif; 
            background: #0f172a; 
            color: #e2e8f0;
            padding: 40px;
        }}
        .header {{ margin-bottom: 40px; }}
        h1 {{ font-size: 42px; color: white; margin-bottom: 10px; }}
        .subtitle {{ color: #64748b; font-size: 18px; }}

        .stats-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 24px;
            margin-bottom: 40px;
        }}

        .stat-card {{
            background: #1e293b;
            padding: 24px;
            border-radius: 12px;
            border: 1px solid #334155;
        }}

        .stat-label {{ color: #64748b; font-size: 14px; text-transform: uppercase; margin-bottom: 8px; }}
        .stat-value {{ font-size: 36px; font-weight: bold; color: white; }}
        .stat-change {{ color: #10b981; font-size: 14px; margin-top: 8px; }}

        .actions {{
            display: flex;
            gap: 16px;
            margin-bottom: 40px;
        }}

        .btn {{
            padding: 16px 32px;
            border-radius: 8px;
            border: none;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            display: inline-block;
        }}

        .btn-primary {{ background: #3b82f6; color: white; }}
        .btn-primary:hover {{ background: #2563eb; }}

        .btn-success {{ background: #10b981; color: white; }}
        .btn-success:hover {{ background: #059669; }}

        .section {{
            background: #1e293b;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            border: 1px solid #334155;
        }}

        .section h2 {{ margin-bottom: 16px; color: white; }}

        .domain-list {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 12px;
        }}

        .domain-item {{
            padding: 12px 16px;
            background: #334155;
            border-radius: 8px;
            font-family: monospace;
            font-size: 14px;
        }}

        .status-live {{ color: #10b981; }}
        .status-pending {{ color: #f59e0b; }}
        .status-sold {{ color: #ef4444; }}

        .revenue {{
            font-size: 48px;
            color: #10b981;
            font-weight: bold;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>🏭 NEXUS Empire OS</h1>
        <p class="subtitle">Managing {total} domains • Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M')}</p>
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-label">Total Domains</div>
            <div class="stat-value">{total}</div>
            <div class="stat-change">In portfolio</div>
        </div>

        <div class="stat-card">
            <div class="stat-label">Live Sites</div>
            <div class="stat-value" style="color: #3b82f6;">{live}</div>
            <div class="stat-change">+{processed} processed</div>
        </div>

        <div class="stat-card">
            <div class="stat-label">Pending Build</div>
            <div class="stat-value" style="color: #f59e0b;">{pending}</div>
            <div class="stat-change">In queue</div>
        </div>

        <div class="stat-card">
            <div class="stat-label">Revenue Generated</div>
            <div class="revenue">${revenue:,}</div>
            <div class="stat-change">From {len(sold)} sales</div>
        </div>
    </div>

    <div class="actions">
        <a href="/api/build/10" class="btn btn-primary">🚀 Build 10 Sites</a>
        <a href="/api/status" class="btn btn-success">📊 Refresh Data</a>
    </div>

    <div class="section">
        <h2>⚡ Quick Stats</h2>
        <p>Processed: {processed} | Live: {live} | Pending: {pending} | Sold: {len(sold)}</p>
        <br>
        <p>Active Listings: {len([l for l in listings.values() if l.get('status') == 'active'])}</p>
        <p>Domains with Offers: {len([l for l in listings.values() if l.get('offers')])}</p>
    </div>

    <div class="section">
        <h2>🌐 Recent Live Sites</h2>
        <div class="domain-list">
            {''.join([f'<div class="domain-item status-live">● {d}</div>' for d in (data.get('live', [])[-10:])])}
        </div>
    </div>

    <div class="section">
        <h2>💰 Recent Sales</h2>
        {''.join([f'<p style="margin-bottom: 8px;"><strong>{l.get("domain")}</strong> - ${l.get("sale_price", 0):,} <span style="color: #10b981;">✓ SOLD</span></p>' for l in list(listings.values())[-5:] if l.get('status') == 'sold']) or '<p>No sales yet</p>'}
    </div>
</body>
</html>
"""

    return html

@app.get("/api/status")
async def api_status():
    """API endpoint for status"""
    data = load_data()

    listings = data.get("listings", {})
    sold = [l for l in listings.values() if l.get("status") == "sold"]

    return {
        "total_domains": len(data["domains"]),
        "processed": len(data.get("processed", [])),
        "live": len(data.get("live", [])),
        "pending": len(data["domains"]) - len(data.get("processed", [])),
        "sold": len(sold),
        "revenue": sum(l.get("sale_price", 0) for l in sold),
        "active_listings": len([l for l in listings.values() if l.get("status") == "active"])
    }

@app.get("/api/build/{count}")
async def api_build(count: int):
    """Trigger build process"""
    # In production, this would trigger the orchestrator
    return {
        "message": f"Building {count} sites",
        "status": "started",
        "estimated_time": f"{count * 10} minutes"
    }

@app.get("/api/domains")
async def api_domains():
    """List all domains"""
    data = load_data()
    return {
        "domains": data["domains"],
        "count": len(data["domains"])
    }

# Run with: uvicorn monitoring.dashboard:app --reload
