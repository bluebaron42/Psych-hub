# Module Upload Guide

## Quick Start

1. **Download your module** from AI Studio as a zip file
2. **Test locally** (IMPORTANT!):
   ```bash
   ./test_module.sh modules-zips/your-module.zip
   ```
3. **Rename the zip** to match your module name (e.g., `schizophrenia.zip`, `memory.zip`)
4. **Copy the zip** into the `modules-zips/` folder in this repo
5. **Commit and push** to GitHub

That's it! GitHub Actions will automatically:
- Extract the zip to `public/modules/`
- Fix common JSX syntax errors
- Build the module (if needed)
- Update the modules registry
- Deploy the updated site

## Testing Before Upload (RECOMMENDED)

Always test your module locally to catch build errors:

```bash
# First time setup - make script executable
chmod +x test_module.sh

# Test your module
./test_module.sh modules-zips/your-module.zip
```

**Expected output:**
- ✅ `Build succeeded! Module is ready to upload.`
- ❌ Error messages if there are issues to fix

## Common Issues & Auto-Fixes

The build system automatically fixes these JSX errors:

| Issue | Example | Auto-Fixed To |
|-------|---------|---------------|
| HTML entities | `(&lt;18mo)` | `({"<"}18mo)` |
| Comparison operators | `(&gt;18 months)` | `({">"}18 months)` |
| Ampersands | `Tom &amp; Jerry` | `Tom {"&"} Jerry` |
| Arrows in text | `Field -> Desirables` | `Field {"->"} Desirables` |

## Full Example

```bash
# After downloading from AI Studio, rename and test:
mv ~/Downloads/export.zip modules-zips/aggression.zip

# Test the build locally
./test_module.sh modules-zips/aggression.zip

# If successful, commit and push:
git add modules-zips/aggression.zip
git commit -m "Add Aggression module"
git push
```

Wait a few minutes for GitHub Actions to complete, then your module will be live!

## Troubleshooting

If the build fails:

1. **Check the test output** for specific errors
2. **Review the [detailed troubleshooting guide](../docs/MODULE_BUILD_TROUBLESHOOTING.md)**
3. **Inspect your App.tsx** for JSX syntax issues
4. **Common fixes:**
   - Replace `&lt;` with `{"<"}` manually if auto-fix missed it
   - Wrap special characters in JSX expressions
   - Ensure all imports are correct
   - Check package.json has all dependencies

## Need More Help?

See the [MODULE_BUILD_TROUBLESHOOTING.md](../docs/MODULE_BUILD_TROUBLESHOOTING.md) guide for:
- Detailed explanations of common errors
- Manual fixing procedures
- Build system architecture
- History of fixes applied

