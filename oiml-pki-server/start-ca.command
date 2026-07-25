#!/bin/bash
# Double-click this file on macOS to start the OIML PKI CA Server.
cd "$(dirname "$0")"

echo "Starting OIML PKI CA Server on http://localhost:4455 ..."
echo "Press Ctrl+C to stop."
echo ""

bundle install --quiet 2>/dev/null
ruby app.rb
