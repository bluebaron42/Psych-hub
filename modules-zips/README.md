# Module Upload Guide

## How to Add New Modules

1. **Download your module** from AI Studio as a zip file
2. **Rename the zip** to match your module name (e.g., `schizophrenia.zip`, `memory.zip`)
3. **Copy the zip** into the `modules-zips/` folder in this repo
4. **Commit and push** to GitHub

That's it! GitHub Actions will automatically:
- Extract the zip to `public/modules/`
- Update the modules registry
- Deploy the updated site

## Example

```bash
# After downloading from AI Studio, rename and move:
mv ~/Downloads/export.zip modules-zips/aggression.zip

# Commit and push:
git add modules-zips/aggression.zip
git commit -m "Add Aggression module"
git push
```

Wait a few minutes for GitHub Actions to complete, then your module will be live!
