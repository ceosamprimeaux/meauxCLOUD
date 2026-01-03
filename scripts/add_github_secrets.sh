#!/bin/bash
# Script to add all GitHub Actions secrets
# Usage: ./scripts/add_github_secrets.sh

set -e

REPO="ceosamprimeaux/meauxCLOUD"
GITHUB_TOKEN="${GITHUB_PAT}"

echo "🔐 Adding GitHub Actions secrets to $REPO..."
echo ""

# Function to add secret
add_secret() {
    local name=$1
    local value=$2
    
    if [ -z "$value" ]; then
        echo "⚠️  Skipping $name (value is empty)"
        return
    fi
    
    echo "Adding: $name"
    echo "$value" | gh secret set "$name" --repo "$REPO" || {
        echo "❌ Failed to add $name"
        return 1
    }
    echo "✅ Added: $name"
    echo ""
}

# Core Cloudflare
add_secret "CLOUDFLARE_ACCOUNT_ID" "ede6590ac0d2fb7daf155b35653457b2"
add_secret "CLOUDFLARE_API_TOKEN" "hFWNgfyv09nhrDH27BW6yYVqLK2y-PhMqJMxBOMA"

# Google OAuth & API
add_secret "GOOGLE_CLIENT_ID" "365932368784-h35rgbm0aqimihjbqqaj1jitpif1cnfu.apps.googleusercontent.com"
add_secret "GOOGLE_API_KEY" "AIzaSyBs5S9tnSIYCMbqp4xaqsnvDBAUGw2ubyk"
echo "⚠️  GOOGLE_CLIENT_SECRET - Please add manually from Google Cloud Console"
echo "   https://console.cloud.google.com/apis/credentials"
echo ""

# Resend Email
add_secret "RESEND_API_KEY" "re_Dkh3uDgE_8j9HKZBHcfFytGWQpSuE8Jtb"
add_secret "RESEND_WEBHOOK_SECRET" "whsec_S3L3dbw9ttxraxfd6/Hrzi636WPfY429"

# Supabase
add_secret "SUPABASE_URL" "https://nkeavhmqvudknofavuid.supabase.co"
add_secret "SUPABASE_ANON_KEY" "sb_publishable_I8YNzmXs2_cT8IkUfjTrng_cJ5HfYQt"
add_secret "SUPABASE_SERVICE_ROLE_KEY" "sb_secret_dCkmJkZ-6-Jng0ChaodPpg_zJ495Lu3"

# Third-Party APIs
add_secret "MESHYAI_API_KEY" "msy_CwgKmtLEhYOFrBe7fV0P7B1v2bISUG0PhcwC"

# Twilio (if using SMS)
# Uncomment and add your Twilio credentials:
# add_secret "TWILIO_ACCOUNT_SID" "<your-twilio-account-sid>"
# add_secret "TWILIO_AUTH_TOKEN" "<your-twilio-auth-token>"

echo ""
echo "✅ Secrets added successfully!"
echo ""
echo "⚠️  Manual steps required:"
echo "   1. Add GOOGLE_CLIENT_SECRET from Google Cloud Console"
echo "   2. Add SFU/TURN keys if using video features:"
echo "      - SFU_APP_ID"
echo "      - SFU_API_TOKEN"
echo "      - TURN_TOKEN_ID"
echo "      - TURN_API_TOKEN"
echo ""
echo "   Get them from: https://dash.cloudflare.com/?to=/:account/calls"
echo ""

