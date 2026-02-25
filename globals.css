terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.15"
    }
  }
}

# Variables
variable "cloudflare_api_token" {
  type = string
  sensitive = true
}

variable "vercel_api_token" {
  type = string
  sensitive = true
}

variable "domains" {
  type = list(string)
  description = "List of all domains to manage"
}

# Cloudflare Provider
provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# Vercel Provider
provider "vercel" {
  api_token = var.vercel_api_token
}

# Create Cloudflare zones for all domains
resource "cloudflare_zone" "domains" {
  for_each = toset(var.domains)
  zone     = each.value
  plan     = "free"
}

# SSL/TLS settings
resource "cloudflare_zone_settings_override" "ssl" {
  for_each = cloudflare_zone.domains
  zone_id  = each.value.id

  settings {
    ssl                      = "strict"
    always_use_https         = "on"
    automatic_https_rewrites = "on"
  }
}

# DNS Records - Point to Vercel
resource "cloudflare_record" "root" {
  for_each = cloudflare_zone.domains
  zone_id  = each.value.id
  name     = "@"
  type     = "A"
  value    = "76.76.21.21"
  ttl      = 1
  proxied  = true
}

output "managed_domains" {
  value = length(var.domains)
}
