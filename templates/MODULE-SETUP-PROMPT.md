# Agent Setup Prompt for Psychology Module Repositories

Use this prompt when setting up new psychology learning modules to create the GitHub Actions workflow and fix JSX syntax errors.

---

## Task Overview

I need you to perform these critical setup tasks for this React/TypeScript educational module:

1. **Configure package.json** with required display name
2. **Configure vite.config.ts** for proper relative asset paths
3. **Create GitHub Actions Workflow** for automated build, packaging, and deployment
4. **Verify Third-Party Library Imports** to prevent runtime errors
5. **Fix JSX Syntax Errors** specifically related to arrow syntax and special characters

---

## Task 1: Configure package.json Display Name

### Instructions

**CRITICAL**: Add a `displayName` field to `package.json` to ensure proper module identification in Psych-hub.

### Steps

1. Open `package.json`
2. Add `"displayName"` field immediately after `"name"` field
3. Use the **exact capitalization** you want displayed in the Psych-hub module menu

### Example

```json
{
  "name": "relationships",
  "displayName": "Relationships",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  ...
}
```

### Naming Guidelines

- **displayName** controls how the module appears in Psych-hub
- Should match existing capitalization if updating an existing module
- Common patterns:
  - `"displayName": "Relationships"` - Capital first letter
  - `"displayName": "schizophrenia"` - All lowercase for clinical terms
  - `"displayName": "Issues & Debates"` - Spaces and capitals for multi-word

**Important**: Without this field, the workflow will use the repository name, which may cause folder/naming mismatches!

---

## Task 2: Configure vite.config.ts for Relative Paths

### Instructions

**CRITICAL**: Update `vite.config.ts` to use relative paths so assets load correctly when deployed to Psych-hub.

### Steps

1. Open `vite.config.ts`
2. Add `base: './'` to the configuration
3. Ensure `outDir: 'dist'` is set in the build options

### Required Configuration

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths - CRITICAL for Psych-hub deployment
  build: {
    outDir: 'dist',
  }
})
```

### Why This Matters

- **Without `base: './'`**: Assets will load from absolute paths like `https://bluebaron42.github.io/assets/index.js` (WRONG)
- **With `base: './'`**: Assets will load from relative paths like `./assets/index.js` (CORRECT)

This ensures the module works when embedded in Psych-hub's subdirectory structure.

### Verify the Generated index.html

**CRITICAL POST-BUILD VERIFICATION**: After building, check that `dist/index.html` uses relative paths:

1. Run `npm run build`
2. Open `dist/index.html` and verify asset paths:

**CORRECT** (relative paths with `./`):
```html
<script type="module" crossorigin src="./assets/index-abc123.js"></script>
<link rel="stylesheet" crossorigin href="./assets/index-def456.css">
```

**WRONG** (absolute paths with `/`):
```html
<script type="module" crossorigin src="/assets/index-abc123.js"></script>
<link rel="stylesheet" crossorigin href="/assets/index-def456.css">
```

If you see absolute paths (`/assets/`), the `base: './'` configuration did not take effect. Double-check your vite.config.ts and rebuild.

**Why this causes issues**: When deployed to `https://bluebaron42.github.io/Psych-hub/modules/YourModule/`, absolute paths like `/assets/` will try to load from the root (`/assets/`) instead of the module directory (`./assets/`), resulting in 404 errors.

---

## Task 3: Create GitHub Actions Workflow

### Instructions

Create the file `.github/workflows/build-and-deploy.yml` with the following exact content:

```yaml
name: Build and Deploy Module

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build module
        run: npm run build
      
      - name: Create deployment package
        run: |
          cd dist
          zip -r ../module-dist.zip .
          cd ..
          echo "✅ Created module-dist.zip ($(du -h module-dist.zip | cut -f1))"
      
      - name: Create GitHub Release
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          VERSION=${GITHUB_REF#refs/tags/}
          
          # Create release if triggered by tag
          if [[ $GITHUB_REF == refs/tags/* ]]; then
            gh release create "$VERSION" \
              module-dist.zip \
              --title "Release $VERSION" \
              --generate-notes
          else
            # For manual runs, create/update "latest" release
            gh release delete latest --yes 2>/dev/null || true
            gh release create latest \
              module-dist.zip \
              --title "Latest Build" \
              --notes "Latest development build" \
              --prerelease
          fi
      
      - name: Trigger Psych-hub sync
        env:
          DEPLOY_TOKEN: ${{ secrets.PSYCH_HUB_DEPLOY_TOKEN }}
        run: |
          if [[ $GITHUB_REF == refs/tags/* ]]; then
            VERSION=${GITHUB_REF#refs/tags/}
          else
            VERSION="latest"
          fi
          
          MODULE_NAME="${{ github.event.repository.name }}"
          
          # Extract display name from package.json or use repo name
          DISPLAY_NAME=$(node -p "try { require('./package.json').displayName } catch(e) { '$MODULE_NAME' }")
          
          echo "🚀 Triggering Psych-hub sync for: $DISPLAY_NAME"
          
          curl -X POST \
            -H "Authorization: token $DEPLOY_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            https://api.github.com/repos/bluebaron42/Psych-hub/dispatches \
            -d "{
              \"event_type\": \"module_updated\",
              \"client_payload\": {
                \"module_repo\": \"$MODULE_NAME\",
                \"module_name\": \"$DISPLAY_NAME\",
                \"version\": \"$VERSION\"
              }
            }"
          
          echo "✅ Sync triggered! Check: https://github.com/bluebaron42/Psych-hub/actions"
```

### Workflow Explanation

This workflow:
- **Triggers on**: Git tags (e.g., `v1.0.0`) or manual runs via workflow_dispatch
- **Permissions**: Includes `contents: write` to create GitHub releases (CRITICAL - without this, release creation fails with HTTP 403)
- **Build Process**: 
  - Checks out code
  - Sets up Node.js 20
  - Installs dependencies with `npm install`
  - Builds the module with `npm run build`
- **Packaging**: Creates `module-dist.zip` from the `dist/` folder
- **Release**: Creates GitHub release with the zip file attached
- **Psych-hub Sync**: Triggers repository dispatch event to update the main hub using the `displayName` from package.json

### Important Notes

1. The `.github/workflows/` directory must be created if it doesn't exist
2. The `permissions: contents: write` section is REQUIRED for release creation
3. This workflow assumes your build output goes to a `dist/` directory
4. The workflow expects `PSYCH_HUB_DEPLOY_TOKEN` secret to be configured in repository settings
5. The workflow reads `displayName` from package.json - ensure Task 1 is completed first!

---

## Task 3.5: Verify Third-Party Library Imports

### Problem Description

When using charting libraries (Chart.js, Recharts, etc.) or other complex third-party dependencies, you may encounter runtime errors like `ReferenceError: Scale is not defined` even though the build succeeds.

### Common Issues

1. **Missing auto-registration imports** - Some libraries require specific imports to register components
2. **Tree-shaking removing needed code** - Build optimization may incorrectly remove required dependencies
3. **Circular dependencies** - Library internals may have dependency order requirements

### Solution for Chart.js

If using Chart.js, ensure you import and register all required components:

**Incorrect** (may cause `ReferenceError: Scale is not defined`):
```typescript
import { Chart } from 'chart.js';
import { Line } from 'react-chartjs-2';
```

**Correct** (properly registers all required components):
```typescript
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
```

### Solution for Other Libraries

1. **Check documentation** - Look for "installation" or "setup" sections that mention required imports
2. **Test in production mode** - Run `npm run build` and test the built output, not just dev mode
3. **Check browser console** - Runtime errors often reveal missing dependencies
4. **Verify package.json** - Ensure all peer dependencies are installed

### Verification Steps

1. **Build the module:**
   ```bash
   npm run build
   ```

2. **Test the built output locally:**
   ```bash
   npx serve dist
   ```
   
3. **Open browser console** and interact with features that use third-party libraries
4. **Look for runtime errors** like `ReferenceError`, `undefined is not a function`, etc.
5. **Fix any missing imports** before deploying

### Common Libraries and Import Requirements

- **Chart.js**: Requires explicit scale registration (CategoryScale, LinearScale, etc.)
- **Recharts**: Usually works with just component imports
- **D3.js**: May require multiple sub-package imports (d3-scale, d3-axis, etc.)
- **Three.js**: Often needs specific loader imports for different file types
- **date-fns**: Use specific function imports to reduce bundle size

---

## Task 4: Fix JSX Syntax Errors

### Problem Description

React/JSX does not allow raw special characters like `>`, `<`, or `->` in text content between JSX tags. These must be:
- Replaced with Unicode equivalents (preferred for arrows)
- Or properly escaped with HTML entities

### Common Error Pattern

When you see build errors like:
```
The character '>' is not valid inside a JSX element
```

This is typically caused by text like:
```jsx
<p>Activating Event -> Belief -> Consequence</p>
```

### Solution: Replace Arrow Syntax

**Step-by-step process:**

#### Step 1: Search for Problematic Patterns

Use grep to find all instances of `->` in TSX/JSX files:

```bash
grep -rn "->.*>" --include="*.tsx" --include="*.jsx" .
```

Or more comprehensively:

```bash
grep -rn "\->" --include="*.tsx" --include="*.jsx" .
```

#### Step 2: Identify JSX Text Content

Look for `->` that appears:
- Inside JSX element text: `<p>text -> more text</p>`
- In string templates within JSX: `<p>{someVar}->{otherVar}</p>`
- **DO NOT REPLACE** `->` in:
  - TypeScript type definitions: `(arg) => result` or `Array<string>`
  - Arrow functions: `() => {}`
  - Comments: `// some -> comment`
  - Import/require statements

#### Step 3: Replace with Unicode Arrow

Replace ASCII `->` with Unicode rightwards arrow `→` (U+2192):

**Before:**
```tsx
<p>Dopamine hypothesis -> explains positive symptoms</p>
<div>Assessment -> Engagement -> ABC -> Normalisation</div>
<span>{variable}->{otherVariable}</span>
```

**After:**
```tsx
<p>Dopamine hypothesis → explains positive symptoms</p>
<div>Assessment → Engagement → ABC → Normalisation</div>
<span>{variable}→{otherVariable}</span>
```

### Specific Patterns to Fix

#### Pattern 1: Text with arrows
```tsx
// WRONG - causes JSX syntax error
<p>Step A -> Step B -> Step C</p>

// CORRECT
<p>Step A → Step B → Step C</p>
```

#### Pattern 2: Malformed escape attempts
```tsx
// WRONG - this pattern is malformed
<p>Text {'->'}>more text</p>

// CORRECT - just use Unicode
<p>Text → more text</p>
```

#### Pattern 3: Multiple arrows in sequence
```tsx
// WRONG
<div>Activating Event -> Belief -> Consequence -> Emotional Response</div>

// CORRECT - replace ALL instances
<div>Activating Event → Belief → Consequence → Emotional Response</div>
```

### Complete Replacement Strategy

1. **Search systematically** through all `.tsx` and `.jsx` files
2. **Read the context** of each match to ensure it's in JSX text content
3. **Use multi_replace_string_in_file** when fixing multiple files for efficiency
4. **Include context** - when using replace tools, include 3-5 lines before and after for accuracy
5. **Verify** - After fixes, run `grep -rn "\->" --include="*.tsx" .` to confirm no JSX text arrows remain

### Verification Steps

After making fixes:

1. **Search for remaining issues:**
   ```bash
   grep -rn "\->" --include="*.tsx" --include="*.jsx" .
   ```
   
2. **Run build to verify:**
   ```bash
   npm run build
   ```
   
3. **Check for no errors** - The build should complete without JSX syntax errors

### Common Files to Check

Based on typical React module structure, check these files especially:
- `App.tsx` - Main application component
- `components/*.tsx` - All component files
- Any file with educational content rendering
- Essay/lesson content components
- Interactive simulation components

### Example Fix Session

Here's what a complete fix might look like:

**File: components/EssayPlanReveal.tsx**
```tsx
// BEFORE (line 23):
<p>Dopamine Hypothesis: {'->'}>Excess dopamine in mesolimbic pathway</p>

// AFTER:
<p>Dopamine Hypothesis: → Excess dopamine in mesolimbic pathway</p>
```

**File: App.tsx**
```tsx
// BEFORE (line 230):
<p>Activating Event -> Belief -> Consequence</p>

// AFTER:
<p>Activating Event → Belief → Consequence</p>
```

**File: components/CBT_TherapistSim.tsx**
```tsx
// BEFORE (line 324):
<p>Process flow: Assessment -> Engagement -> ABC -> Normalisation -> Dispute</p>

// AFTER:
<p>Process flow: Assessment → Engagement → ABC → Normalisation → Dispute</p>
```

---

## Complete Execution Checklist

- [ ] **Task 1**: Add `displayName` field to `package.json`
- [ ] **Task 2**: Update `vite.config.ts` with `base: './'` for relative paths
- [ ] Verify `dist/index.html` uses relative paths (`./assets/`) after build
- [ ] **Task 3**: Create `.github/workflows/build-and-deploy.yml` with exact content above
- [ ] Ensure `permissions: contents: write` is included in workflow
- [ ] **Task 3.5**: Verify all third-party library imports are complete
- [ ] Test built output locally with `npx serve dist` and check browser console
- [ ] **Task 4**: Search all `.tsx` and `.jsx` files for `->` patterns
- [ ] Replace all JSX text content arrows with `→` Unicode character
- [ ] Verify no malformed patterns like `{'->'}>` remain
- [ ] Run `npm run build` to confirm no JSX syntax errors
- [ ] Test the module in browser to ensure no runtime errors
- [ ] Commit all changes with descriptive message
- [ ] Push to repository
- [ ] Trigger workflow manually or create a tag to test deployment

---

## Expected Results

After completing all tasks:

1. ✅ `package.json` has correct `displayName` field
2. ✅ `vite.config.ts` configured with `base: './'` for relative asset paths
3. ✅ `dist/index.html` uses relative paths (`./assets/`) not absolute paths (`/assets/`)
4. ✅ GitHub Actions workflow file exists and is properly configured
5. ✅ Workflow has correct permissions to create releases
6. ✅ All third-party library dependencies properly imported and registered
7. ✅ No runtime errors in browser console when testing with `npx serve dist`
8. ✅ All JSX syntax errors related to arrow characters are resolved
9. ✅ `npm run build` completes successfully with no errors
10. ✅ Workflow can be triggered manually or via tags
11. ✅ Module deploys to correct folder name in Psych-hub (matching displayName)
12. ✅ Assets load correctly with relative paths (no 404 errors)
13. ✅ No `ReferenceError` or missing dependency errors at runtime

---

## Troubleshooting

### If assets fail to load (404 errors or wrong MIME type)
- Verify `vite.config.ts` has `base: './'` 
- Rebuild and redeploy the module
- Check browser console for asset path errors

### If module deploys to wrong folder name
- Check that `displayName` in `package.json` matches desired folder name
- Verify capitalization matches existing modules (e.g., "Relationships" not "relationships")

### If workflow fails with "HTTP 403: Resource not accessible"
- Ensure `permissions: contents: write` is in the workflow YAML
- Check that it's at the top level, not nested inside jobs

### If JSX errors persist
- Run comprehensive search: `grep -rn "[<>]" --include="*.tsx" . | grep -v "import\|export\|function\|const\|type\|interface"`
- Look for comparison operators in JSX: `{value > 5}` should be `{value > 5}` (already valid)
- Check for HTML entities that need escaping

### If build fails after fixes
- Verify you didn't accidentally replace TypeScript syntax
- Check that arrow functions `=>` are still intact
- Ensure generic types like `Array<T>` weren't modified

### If runtime errors occur (ReferenceError, undefined, etc.)
- **Chart.js "Scale is not defined"**: Add missing scale imports (CategoryScale, LinearScale, etc.) and register them
- **"X is not a function"**: Check that library components are properly imported from correct packages
- **Build succeeds but runtime fails**: Test with `npx serve dist` and check browser console for specific errors
- **Only happens in production**: Ensure all tree-shaken code has required registrations/imports
- **Works in dev but not build**: Check for dynamic imports or lazy loading issues

---

## Unicode Reference

Use these Unicode characters for common symbols in JSX text:

- Right arrow: `→` (U+2192) - replaces `->`
- Left arrow: `←` (U+2190) - replaces `<-`
- Greater than: `&gt;` or `>` (in expressions)
- Less than: `&lt;` or `<` (in expressions)
- Ampersand: `&amp;` if displaying literally

---

**End of prompt. Execute these tasks systematically and verify each step.**
