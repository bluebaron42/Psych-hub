# Module Build Troubleshooting Guide

## Overview

This guide explains the JSX compatibility fixes that have been implemented to handle common build errors when uploading module zip files.

## The Problem

When exporting modules from AI Studio and uploading them to the modules-zips folder, the build process can fail due to JSX syntax incompatibilities. The most common issues are:

1. **HTML Entities** - AI Studio exports sometimes contain HTML entities like `&lt;`, `&gt;`, `&amp;` in the JSX code
2. **Special Characters** - Characters like `<`, `>`, `->` in text content can be misinterpreted by the JSX parser
3. **Comparison Operators** - Patterns like `(<18 months)` or `(>18mo)` cause parsing errors

## The Solution

### Automated Fixes

The system now includes an automated JSX fixer that runs during the build process:

**Location:** `.github/scripts/fix_jsx.py`

This script automatically:
- ✅ Converts `&lt;` to `{"<"}` 
- ✅ Converts `&gt;` to `{">"}` 
- ✅ Converts `&amp;` to `{"&"}`
- ✅ Fixes arrow operators (`->`) in text
- ✅ Fixes double angle brackets (`>>`)
- ✅ Handles comparison operators in parentheses
- ✅ Cleans up incorrectly wrapped function arguments

### How It Works

1. **GitHub Actions Workflow** (`.github/workflows/process-modules.yml`)
   - Triggers when you push a `.zip` file to `modules-zips/`
   - Extracts the zip
   - Runs `fix_jsx.py` on `App.tsx` before building
   - Builds the module with Vite
   - Deploys to `public/modules/`

2. **Local Testing** (`test_module.sh`)
   - Test your module locally before uploading
   - Same process as GitHub Actions
   - Provides detailed feedback

## Usage

### Testing a Module Locally (RECOMMENDED)

Before uploading to GitHub, always test your module locally:

```bash
# Make the test script executable (first time only)
chmod +x test_module.sh

# Test your module
./test_module.sh modules-zips/your-module.zip
```

**What to expect:**
- ✅ Success: "Build succeeded! Module is ready to upload."
- ❌ Failure: Build errors will be displayed for you to fix

### Uploading a Module

Once local testing passes:

```bash
# Add and commit your zip file
git add modules-zips/your-module.zip
git commit -m "Add [module name] module"
git push

# GitHub Actions will automatically:
# 1. Extract the zip
# 2. Fix JSX syntax errors
# 3. Build the module
# 4. Deploy to public/modules/
```

### Manual JSX Fixing

If you need to manually fix JSX in a file:

```bash
python3 .github/scripts/fix_jsx.py path/to/App.tsx
```

## Common Build Errors & Solutions

### Error: "Unexpected token '<'"

**Cause:** HTML entity `&lt;` in JSX text  
**Example:** `Similarity in Attitudes (&lt;18mo)`  
**Auto-fixed to:** `Similarity in Attitudes ({"<"}18mo)`

### Error: "Unexpected token '>'"

**Cause:** HTML entity `&gt;` or comparison operator in JSX  
**Example:** `long-term (&gt;18 months)`  
**Auto-fixed to:** `long-term ({">"}18 months)`

### Error: "Adjacent JSX elements must be wrapped"

**Cause:** Missing parent element  
**Solution:** This requires manual fixing - wrap elements in a `<>` fragment or `<div>`

### Error: "Type errors" or "Cannot find module"

**Cause:** Missing dependencies or TypeScript configuration issues  
**Solution:** 
1. Ensure `package.json` includes all required dependencies
2. Check `tsconfig.json` has `"jsx": "react-jsx"`
3. Check `vite.config.ts` includes `@vitejs/plugin-react`

## Required Files for Building Modules

Your zip must include:

1. **App.tsx** - Main component
2. **index.tsx** - Entry point
3. **index.html** - HTML template
4. **package.json** - Dependencies and build script
5. **tsconfig.json** - TypeScript configuration
6. **vite.config.ts** - Vite build configuration
7. **metadata.json** (optional) - Module metadata

## History of Changes

Based on git commits, here's what has been tried and refined:

1. **Initial Approach** - Used `sed` commands inline (commits 28c8d97, fc81fca)
2. **Python Script Created** - Replaced sed with `fix_jsx.py` (commit 9fcfc99)
3. **Multiple Refinements** - Script improved to handle more patterns (commits af47122, 24a738b, 359eb8e)
4. **Test Script Added** - Created `test_module.sh` for local validation (commit 9b13a33)
5. **Enhanced Reporting** - Added detailed feedback and fix tracking (current version)

## Tips for Module Creation

1. **Always test locally first** using `test_module.sh`
2. **Check for HTML entities** - AI Studio sometimes exports these
3. **Use JSX expressions** for special characters: `{"<"}`, `{">"}`, `{"&"}`
4. **Avoid bare `<` or `>` in text** - wrap in JSX expressions
5. **Keep dependencies up to date** - use the same versions as the main project

## Troubleshooting Workflow

If a build fails:

1. **Check GitHub Actions logs** for the specific error
2. **Extract the zip locally** and examine `App.tsx`
3. **Look for problematic patterns:**
   - HTML entities (`&lt;`, `&gt;`, `&amp;`)
   - Bare comparison operators in text
   - Missing imports or dependencies
4. **Run the fix script manually:**
   ```bash
   unzip your-module.zip -d temp/
   python3 .github/scripts/fix_jsx.py temp/App.tsx
   ```
5. **Test the build:**
   ```bash
   cd temp
   npm install
   npm run build
   ```
6. **If successful, re-zip and upload:**
   ```bash
   cd ..
   zip -r your-module-fixed.zip temp/*
   mv your-module-fixed.zip modules-zips/your-module.zip
   ```

## Need Help?

If you encounter an error that the automated fixes don't handle:

1. Check the [GitHub Actions run logs](../../actions)
2. Review this troubleshooting guide
3. Manually inspect the `App.tsx` file for JSX syntax issues
4. Consider adding a new fix pattern to `fix_jsx.py`

---

**Last Updated:** January 2026  
**Version:** 2.0
