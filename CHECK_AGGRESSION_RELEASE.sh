#!/bin/bash
# Check if Aggression repo has the required release

echo "🔍 Checking Aggression repository for releases..."
echo ""

# Check for releases
echo "📋 Releases in bluebaron42/Aggression:"
gh release list --repo bluebaron42/Aggression --limit 10

echo ""
echo "---"
echo ""

# Check for latest release specifically
echo "🎯 Checking for 'latest' release:"
if gh release view latest --repo bluebaron42/Aggression 2>/dev/null; then
    echo ""
    echo "✅ 'latest' release exists!"
    echo ""
    echo "📦 Assets:"
    gh release view latest --repo bluebaron42/Aggression --json assets --jq '.assets[].name'
    echo ""
    
    # Check if module-dist.zip exists
    if gh release view latest --repo bluebaron42/Aggression --json assets --jq '.assets[].name' | grep -q "module-dist.zip"; then
        echo "✅ module-dist.zip found in latest release"
        echo "🎉 Ready to sync!"
    else
        echo "❌ module-dist.zip NOT found in latest release"
        echo ""
        echo "💡 The workflow needs module-dist.zip. Available assets are listed above."
    fi
else
    echo ""
    echo "❌ No 'latest' release found"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Go to https://github.com/bluebaron42/Aggression/actions"
    echo "   2. Click 'Build and Deploy Module' workflow"
    echo "   3. Click 'Run workflow' → 'Run workflow'"
    echo "   4. This will create a 'latest' release with module-dist.zip"
fi
