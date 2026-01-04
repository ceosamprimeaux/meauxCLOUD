#!/bin/bash

# Cloudflare Tunnel Installation Script
# Installs and configures MeauxTunnel for Cloudflare Zero Trust

set -e

echo "🚇 Installing Cloudflare Tunnel (MeauxTunnel)..."

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This script is designed for macOS. Please use the appropriate installation method for your OS."
    exit 1
fi

# Install cloudflared if not already installed
if ! command -v cloudflared &> /dev/null; then
    echo "📦 Installing cloudflared via Homebrew..."
    brew install cloudflared
else
    echo "✅ cloudflared is already installed"
    cloudflared --version
fi

# Tunnel token (from user's Cloudflare dashboard)
TUNNEL_TOKEN="eyJhIjoiZWRlNjU5MGFjMGQyZmI3ZGFmMTU1YjM1NjUzNDU3YjIiLCJ0IjoiYmQxMjQ4N2QtMzQ2NC00YjdlLTg1OTItYzk0ZGIwZDdmMzliIiwicyI6Ik9EbGpabVV4T1RBdE4yRmpOUzAwWmpnMkxUZ3laall0T0dGaVptTTFOakk1TjJaayJ9"

echo ""
echo "🔐 Installing tunnel as a system service..."
echo "⚠️  You may be prompted for your password to install the service."

# Install as service
sudo cloudflared service install "$TUNNEL_TOKEN"

if [ $? -eq 0 ]; then
    echo "✅ Tunnel service installed successfully!"
    echo ""
    echo "📋 Service Status:"
    sudo launchctl list | grep cloudflared || echo "Service will start automatically on boot"
    echo ""
    echo "🎯 Next Steps:"
    echo "   1. The tunnel will start automatically on system boot"
    echo "   2. To start manually: sudo launchctl start com.cloudflare.cloudflared"
    echo "   3. To stop: sudo launchctl stop com.cloudflare.cloudflared"
    echo "   4. To check status: sudo launchctl list | grep cloudflared"
    echo ""
    echo "🔍 To view tunnel logs:"
    echo "   sudo tail -f /usr/local/etc/cloudflared/logs/*.log"
    echo ""
    echo "🌐 Your tunnel 'MeauxTunnel' is now connected to Cloudflare!"
else
    echo "❌ Failed to install tunnel service"
    echo ""
    echo "💡 Alternative: Run tunnel manually with:"
    echo "   cloudflared tunnel run --token $TUNNEL_TOKEN"
    exit 1
fi

