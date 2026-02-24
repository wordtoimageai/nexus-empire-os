#!/bin/bash
# NEXUS Empire - Quick Start Script

echo "🏭 NEXUS Empire OS - Quick Start"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo ""
    echo "Please:"
    echo "1. cp .env.template .env"
    echo "2. Edit .env and add your API keys"
    echo ""
    exit 1
fi

echo "✅ Environment check passed"
echo ""

# Show menu
echo "What would you like to do?"
echo ""
echo "1) Test the system (recommended first step)"
echo "2) Classify all domains"
echo "3) Build 5 sites"
echo "4) Start full automation"
echo "5) Launch dashboard"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🧪 Testing system..."
        python3 main.py test
        ;;
    2)
        echo ""
        echo "🔍 Classifying domains..."
        python3 main.py classify
        ;;
    3)
        echo ""
        echo "🏗️  Building 5 sites..."
        python3 main.py build 5
        ;;
    4)
        echo ""
        echo "🤖 Starting 24/7 automation..."
        echo "Press Ctrl+C to stop"
        python3 main.py auto
        ;;
    5)
        echo ""
        echo "🌐 Starting dashboard..."
        echo "Open http://localhost:3000"
        python3 main.py dashboard
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
