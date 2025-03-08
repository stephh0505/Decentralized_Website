#!/bin/bash
# Script to start Tor hidden service for GhostFund

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit 1
fi

# Create necessary directories
mkdir -p /var/lib/tor/hidden_service
mkdir -p /var/log/tor

# Set proper permissions
chown -R debian-tor:debian-tor /var/lib/tor
chmod 700 /var/lib/tor/hidden_service

# Copy configuration file
cp ./torrc /etc/tor/torrc

# Restart Tor service
systemctl restart tor

# Wait for the hidden service to be ready
sleep 5

# Display the onion address
if [ -f /var/lib/tor/hidden_service/hostname ]; then
  echo "GhostFund Tor hidden service is running at:"
  cat /var/lib/tor/hidden_service/hostname
  echo "Add this address to your .env file as NEXT_PUBLIC_ONION_ADDRESS"
else
  echo "Error: Hidden service hostname not found"
  exit 1
fi

# Check Tor service status
systemctl status tor

echo "Tor hidden service setup complete!" 