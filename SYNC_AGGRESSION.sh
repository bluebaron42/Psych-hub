#!/bin/bash
# Manual sync script for Aggression module

echo "🚀 Manually triggering Aggression module sync..."

gh workflow run sync-module.yml \
  -f module_repo="Aggression" \
  -f module_display_name="Aggression" \
  -f version="latest"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Workflow triggered successfully!"
    echo "📊 Check status: https://github.com/bluebaron42/Psych-hub/actions"
    echo ""
    echo "The workflow will:"
    echo "  1. Download the 'latest' release from bluebaron42/Aggression"
    echo "  2. Extract it to public/modules/Aggression and docs/modules/Aggression"
    echo "  3. Fix asset paths"
    echo "  4. Update modules.json"
    echo "  5. Trigger deployment"
else
    echo ""
    echo "❌ Failed to trigger workflow"
    echo ""
    echo "Make sure:"
    echo "  - You have GitHub CLI installed and authenticated (gh auth login)"
    echo "  - The Aggression repo has a 'latest' release with module-dist.zip"
fi
