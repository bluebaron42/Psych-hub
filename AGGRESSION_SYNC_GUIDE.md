# Aggression Module Sync Troubleshooting Guide

## Problem
The Aggression module workflow completed successfully in its repository, but the module isn't syncing to Psych-hub.

## Root Causes (Common Issues)

### 1. ❌ Missing Release
The Psych-hub sync workflow downloads from GitHub Releases. Even if the workflow ran successfully, it needs to create a **"latest"** release.

### 2. ❌ Missing Deploy Token  
The Aggression workflow tries to trigger Psych-hub via `repository_dispatch`, but this requires `PSYCH_HUB_DEPLOY_TOKEN` secret to be configured in the Aggression repository.

### 3. ❌ Repository Dispatch Failed Silently
Even if the workflow shows success, the curl command to trigger Psych-hub may have failed without breaking the workflow.

---

## Diagnostic Steps

### Step 1: Check if Release Exists

Run this command:
```bash
chmod +x CHECK_AGGRESSION_RELEASE.sh
./CHECK_AGGRESSION_RELEASE.sh
```

**Expected output if working:**
- Lists releases in Aggression repo
- Shows "latest" release exists
- Confirms `module-dist.zip` is attached

**If missing "latest" release:**
Go to Step 2.

**If release exists but no module-dist.zip:**
The workflow didn't package correctly. Check Aggression repo workflow logs.

---

### Step 2: Manually Create/Trigger Release

If no release exists, manually trigger the build workflow:

1. Go to: https://github.com/bluebaron42/Aggression/actions
2. Click **"Build and Deploy Module"** workflow
3. Click **"Run workflow"** dropdown → **"Run workflow"** button
4. Wait for completion (~1-2 minutes)
5. Verify release created: https://github.com/bluebaron42/Aggression/releases
6. Should see a "latest" release with `module-dist.zip` attached

---

### Step 3: Configure Deploy Token (If Missing)

The deploy token allows Aggression to trigger Psych-hub syncs.

**Check if configured:**
```bash
# In Aggression repo, check workflow logs for:
# "Triggering Psych-hub sync"
# If you see curl errors or 401/403, token is missing or invalid
```

**To configure:**
1. Create a Personal Access Token (classic):
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Name: `Psych-hub Deploy Token`
   - Select scopes: `repo` (all), `workflow`
   - Click "Generate token"
   - **Copy the token immediately!**

2. Add to Aggression repository:
   - Go to: https://github.com/bluebaron42/Aggression/settings/secrets/actions
   - Click "New repository secret"
   - Name: `PSYCH_HUB_DEPLOY_TOKEN`
   - Value: Paste the token
   - Click "Add secret"

3. Re-run the Aggression workflow to test

---

### Step 4: Manual Sync (Workaround)

If you want to sync immediately without fixing the dispatch:

```bash
chmod +x SYNC_AGGRESSION.sh
./SYNC_AGGRESSION.sh
```

This manually triggers the Psych-hub sync workflow, which:
1. Downloads the "latest" release from Aggression repo
2. Extracts to `public/modules/Aggression/` and `docs/modules/Aggression/`
3. Fixes asset paths
4. Updates `modules.json`
5. Commits and pushes changes
6. Triggers deployment

**Monitor progress:**
https://github.com/bluebaron42/Psych-hub/actions

---

## Verification Checklist

After attempting fixes, verify:

- [ ] Aggression repo has a "latest" release
- [ ] Release includes `module-dist.zip` asset
- [ ] `PSYCH_HUB_DEPLOY_TOKEN` secret is configured in Aggression repo
- [ ] Psych-hub sync workflow ran successfully
- [ ] Files exist in `public/modules/Aggression/` and `docs/modules/Aggression/`
- [ ] `modules.json` includes Aggression entry
- [ ] Website shows Aggression module

---

## Quick Command Reference

```bash
# Check Aggression releases
gh release list --repo bluebaron42/Aggression

# View latest release details
gh release view latest --repo bluebaron42/Aggression

# Manually trigger Psych-hub sync
gh workflow run sync-module.yml \
  -f module_repo="Aggression" \
  -f module_display_name="Aggression" \
  -f version="latest"

# Check Psych-hub workflow runs
gh run list --workflow=sync-module.yml --limit 5

# View specific workflow run
gh run view <run-id>
```

---

## Common Errors and Solutions

### Error: "No latest release found for Aggression"
**Solution:** Run the build workflow in Aggression repo (Step 2)

### Error: "HTTP 403: Resource not accessible"  
**Solution:** Check `permissions: contents: write` in Aggression workflow YAML

### Error: "curl: (22) HTTP 401"
**Solution:** Configure `PSYCH_HUB_DEPLOY_TOKEN` (Step 3)

### Module syncs but doesn't appear on website
**Solution:** 
- Check `modules.json` includes correct entry
- Verify files in `docs/modules/Aggression/` (used by GitHub Pages)
- Wait for GitHub Pages deployment to complete (~30-60 seconds)
- Clear browser cache

---

## Repository Structure Check

Verify these files exist in **Aggression repo**:

```
.github/
  workflows/
    build-and-deploy.yml  ← Must include permissions: contents: write
package.json            ← Must include "displayName": "Aggression"
dist/                   ← Created during build, contains module output
```

Verify these exist in **Psych-hub repo** after sync:

```
public/modules/Aggression/
  index.html
  assets/
    [various files].js
    [various files].css
docs/modules/Aggression/
  index.html
  assets/
    [various files].js
    [various files].css
modules.json  ← Includes: "Aggression": "/Psych-hub/modules/Aggression/index.html"
```

---

## Still Not Working?

1. **Check Aggression workflow logs:**
   - https://github.com/bluebaron42/Aggression/actions
   - Look for the most recent "Build and Deploy Module" run
   - Check each step for errors

2. **Check Psych-hub workflow logs:**
   - https://github.com/bluebaron42/Psych-hub/actions
   - Look for "Sync Module from External Repo" runs
   - Check download step for errors

3. **Verify displayName match:**
   - In Aggression `package.json`: `"displayName": "Aggression"`
   - In Psych-hub `modules.json`: `"Aggression": "..."`
   - **Must match exactly** (case-sensitive)

4. **Manual debugging:**
   ```bash
   # Clone both repos locally
   # Check Aggression repo has release
   # Manually download module-dist.zip
   # Extract and compare with expected structure
   ```

---

## Next Steps

Choose the fastest path:

**Option A: Quick Fix (Recommended)**
1. Run `./CHECK_AGGRESSION_RELEASE.sh` to diagnose
2. If no release: Manually trigger build in Aggression repo
3. Run `./SYNC_AGGRESSION.sh` to sync
4. Done!

**Option B: Full Fix**
1. Configure `PSYCH_HUB_DEPLOY_TOKEN` secret
2. Re-run Aggression build workflow  
3. Verify automatic sync triggered
4. Future updates will sync automatically

---

**Created:** 2026-01-16  
**For:** Psych-hub Module Sync System
