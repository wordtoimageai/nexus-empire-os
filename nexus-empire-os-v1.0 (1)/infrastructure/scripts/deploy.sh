#!/bin/bash
# NEXUS Empire - Bulk Deployment Script

echo "🚀 NEXUS Empire Deployment"
echo "=========================="

# 1. Initialize Terraform
echo "📦 Initializing infrastructure..."
cd infrastructure/terraform
terraform init

# 2. Plan
echo "📋 Planning changes..."
terraform plan -out=tfplan

# 3. Apply (auto-approve for CI/CD)
echo "🏗️  Applying infrastructure..."
terraform apply tfplan

cd ../..

# 4. Build sites
echo "⚙️  Building sites..."
python3 core/orchestrator.py build 10

# 5. Deploy to Vercel
echo "🌐 Deploying to Vercel..."
for site in built_sites/*/; do
  if [ -d "$site" ]; then
    domain=$(basename "$site")
    echo "Deploying $domain..."
    cd "$site"
    vercel --prod --yes
    cd ../..
  fi
done

echo "✅ Deployment complete!"
