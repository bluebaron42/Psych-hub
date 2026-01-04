#!/bin/bash
# Manual module sync script
# Usage: ./scripts/sync-module.sh <repo-name> <display-name> [version]

MODULE_REPO=$1
MODULE_NAME=$2
VERSION=${3:-latest}

if [ -z "$MODULE_REPO" ] || [ -z "$MODULE_NAME" ]; then
    echo "❌ Usage: ./scripts/sync-module.sh <repo-name> <display-name> [version]"
    echo ""
    echo "Examples:"
    echo "  ./scripts/sync-module.sh psychology-relationships Relationships v1.0.0"
    echo "  ./scripts/sync-module.sh psychology-schizophrenia schizophrenia latest"
    echo ""
    exit 1
fi

echo "🚀 Triggering workflow to sync module..."
echo "   Repo: $MODULE_REPO"
echo "   Name: $MODULE_NAME"
echo "   Version: $VERSION"
echo ""

gh workflow run sync-module.yml \
  -f module_repo="$MODULE_REPO" \
  -f module_display_name="$MODULE_NAME" \
  -f version="$VERSION"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Workflow triggered successfully!"
    echo "📊 Check status: https://github.com/bluebaron42/Psych-hub/actions"
else
    echo ""
    echo "❌ Failed to trigger workflow"
    echo "Make sure you have the GitHub CLI installed and authenticated:"
    echo "  gh auth login"
fi
