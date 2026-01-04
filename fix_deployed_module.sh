#!/bin/bash
# Quick fix script for JSX issues in already deployed modules

if [ -z "$1" ]; then
    echo "Usage: ./fix_deployed_module.sh <module-name>"
    echo "Example: ./fix_deployed_module.sh psychology_-relationships"
    echo ""
    echo "This will fix JSX syntax errors in public/modules/<module-name>/App.tsx"
    exit 1
fi

MODULE=$1
APPTSX="public/modules/$MODULE/App.tsx"

if [ ! -f "$APPTSX" ]; then
    echo "❌ Error: $APPTSX not found"
    echo ""
    echo "Available modules:"
    ls -1 public/modules/ 2>/dev/null || echo "  (none found)"
    exit 1
fi

echo "🔧 Fixing JSX syntax in: $APPTSX"
python3 .github/scripts/fix_jsx.py "$APPTSX"

echo ""
echo "✅ Done! You can now:"
echo "   1. Review the changes: git diff $APPTSX"
echo "   2. Commit if satisfied: git add $APPTSX && git commit -m 'Fix JSX syntax in $MODULE'"
