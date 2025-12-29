#!/bin/bash
# Test script to validate module build before uploading

set -e

ZIPFILE=$1

if [ -z "$ZIPFILE" ]; then
    echo "Usage: ./test_module.sh path/to/module.zip"
    exit 1
fi

echo "Testing module: $ZIPFILE"

# Create temp directory
TEMPDIR="test_module_temp"
rm -rf "$TEMPDIR"
mkdir -p "$TEMPDIR"

# Extract zip
unzip -q "$ZIPFILE" -d "$TEMPDIR"

# Check if needs building
if [ -f "$TEMPDIR/package.json" ]; then
    echo "Found package.json - will build module"
    
    # Run JSX fix script
    if [ -f "$TEMPDIR/App.tsx" ]; then
        echo "Fixing JSX syntax..."
        python3 .github/scripts/fix_jsx.py "$TEMPDIR/App.tsx"
    fi
    
    # Install and build
    echo "Installing dependencies..."
    cd "$TEMPDIR"
    npm install --silent
    
    echo "Building..."
    npm run build
    
    if [ -d "dist" ]; then
        echo "✅ Build succeeded! Module is ready to upload."
        echo "Built files are in: $TEMPDIR/dist"
        cd ..
        exit 0
    else
        echo "❌ Build failed - no dist folder created"
        cd ..
        exit 1
    fi
else
    echo "✅ No build required - static files only"
    rm -rf "$TEMPDIR"
    exit 0
fi
