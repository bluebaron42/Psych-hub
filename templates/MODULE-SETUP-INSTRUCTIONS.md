# Module Setup Instructions

This template contains the GitHub Actions workflow for automatically building and deploying your module to Psych-hub.

## Setup Steps

### 1. Add the PAT Token to Your Module Repo

1. Go to your module repo on GitHub: `https://github.com/bluebaron42/YOUR-MODULE-NAME`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `PSYCH_HUB_DEPLOY_TOKEN`
5. Value: Paste your Personal Access Token
6. Click **Add secret**

### 2. Add the Workflow to Your Module Repo

1. In your module repo, create the directory: `.github/workflows/`
2. Copy `module-build-deploy.yml` to `.github/workflows/build-and-deploy.yml`
3. Commit and push:
   ```bash
   git add .github/workflows/build-and-deploy.yml
   git commit -m "Add automated build and deploy workflow"
   git push origin main
   ```

### 3. (Optional) Add Display Name to package.json

To set a custom display name in Psych-hub's modules menu, add this to your `package.json`:

```json
{
  "name": "psychology-schizophrenia",
  "displayName": "schizophrenia",
  "version": "1.0.0",
  ...
}
```

If not specified, the repo name will be used.

### 4. Test the Workflow

**Option A: Manual trigger (recommended for first test)**
1. Go to **Actions** tab in your module repo
2. Click **Build and Deploy Module**
3. Click **Run workflow** → **Run workflow**
4. Watch it build and deploy!

**Option B: Tag a release**
```bash
git tag v1.0.0
git push origin v1.0.0
```

### 5. Verify Deployment

After the workflow completes:
1. Check your module repo's **Releases** - you should see a new release with `module-dist.zip`
2. Check Psych-hub's **Actions** - you should see "Sync Module from External Repo" running
3. Once complete, check Psych-hub's `public/modules/schizophrenia/` and `modules.json`

## Troubleshooting

**"Error: Resource not accessible by integration"**
→ Make sure you added the `PSYCH_HUB_DEPLOY_TOKEN` secret

**"Release already exists"**
→ Delete the old release or use a new version tag

**Build fails**
→ Make sure your `npm run build` works locally and outputs to `dist/` folder
