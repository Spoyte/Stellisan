#!/bin/bash

# Navigate to the frontend directory
cd "$(dirname "$0")/frontend"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Make sure you're running this from the Stellisan root directory."
    exit 1
fi

echo "Starting Stellisan frontend..."
echo "Current directory: $(pwd)"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the development server with WSL2 configuration
echo "Starting development server on http://0.0.0.0:3000"
echo "To access from Windows, use: http://$(hostname -I | awk '{print $1}'):3000"
npm run dev -- --hostname 0.0.0.0 --port 3000 