#!/bin/bash
# Test script to validate module build before uploading

set -e

ZIPFILE=$1

if [ -z "$ZIPFILE" ]; then
    echo "Usage: ./test_module.sh path/to/module.zip"
    exit 1
fi

if [ ! -f "$ZIPFILE" ]; then
    echo "❌ Error: File '$ZIPFILE' not found"
    exit 1
fi

echo "========================================"
echo "Testing module: $ZIPFILE"
echo "========================================"

# Create temp directory
TEMPDIR="test_module_temp"
rm -rf "$TEMPDIR"
mkdir -p "$TEMPDIR"

# Extract zip
echo "📦 Extracting module..."
unzip -q "$ZIPFILE" -d "$TEMPDIR"

# Check if needs building
if [ -f "$TEMPDIR/package.json" ]; then
    echo "✓ Found package.json - module requires building"
    
    # Check for TypeScript/React configuration
    if [ -f "$TEMPDIR/tsconfig.json" ]; then
        echo "✓ Found tsconfig.json"
    fi
    
    if [ -f "$TEMPDIR/vite.config.ts" ]; then
        echo "✓ Found vite.config.ts"
    fi
    
    # Run JSX fix script
    if [ -f "$TEMPDIR/App.tsx" ]; then
        echo ""
        echo "🔧 Fixing JSX syntax in App.tsx..."
        python3 .github/scripts/fix_jsx.py "$TEMPDIR/App.tsx"
    fi
    
    # Install and build
    echo ""
    echo "📥 Installing dependencies..."
    cd "$TEMPDIR"
    npm install --silent
    
    echo ""
    echo "🏗️  Building module..."
    npm run build 2>&1
    
    if [ -d "dist" ]; then
        echo ""
        echo "========================================"
        echo "✅ Build succeeded!"
        echo "========================================"
        echo "Built files are in: $PWD/dist"
        echo ""
        echo "Contents of dist/:"
        ls -lh dist/
        cd ..
        echo ""
        echo "⚠️  Note: The temporary build directory has been kept at: $TEMPDIR"
        echo "   You can inspect it or delete it manually with: rm -rf $TEMPDIR"
        exit 0
    else
        echo ""
        echo "========================================"
        echo "❌ Build failed - no dist folder created"
        echo "========================================"
        cd ..
        exit 1
    fi
else
    echo "✓ No build required - static files only"
    echo ""
    echo "Contents:"
    ls -lh "$TEMPDIR"
    rm -rf "$TEMPDIR"
    echo ""
    echo "✅ Module is ready for upload!"
    exit 0
fi
