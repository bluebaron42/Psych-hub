#!/bin/bash
# Fix GitHub CLI authentication for workflow triggering

echo "🔐 Re-authenticating GitHub CLI with workflow scope..."
echo ""
echo "This will open a browser window for authentication."
echo "Make sure to authorize the 'workflow' scope when prompted."
echo ""

gh auth login --scopes "repo,workflow" --web

echo ""
echo "✅ Authentication complete!"
echo ""
echo "Now try triggering the sync again:"
echo "  gh workflow run sync-module.yml -f module_repo=\"Aggression\" -f module_display_name=\"Aggression\" -f version=\"latest\""
