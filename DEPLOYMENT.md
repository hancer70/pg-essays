# Deploying to GitHub Pages with Custom Domain (hancer.org)

## Prerequisites
- GitHub account (create one at https://github.com if you don't have one)
- Git installed on your computer
- Access to GoDaddy DNS settings

## Step 1: Check if Git is Installed

Open PowerShell and run:
```powershell
git --version
```

If you see a version number, you're good! If not, download Git from: https://git-scm.com/download/win

## Step 2: Initialize Git Repository

Open PowerShell in the `pg-essays-site` folder and run:

```powershell
cd c:\Users\hance\.gemini\antigravity\playground\phantom-photon\pg-essays-site
git init
git add .
git commit -m "Initial commit: Paul Graham essays website"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `pg-essays` (or any name you like)
3. Description: "Interactive collection of Paul Graham essays"
4. Choose **Public** (required for free GitHub Pages)
5. **DO NOT** check "Add a README file"
6. Click "Create repository"

## Step 4: Push to GitHub

GitHub will show you commands. Use these (replace `YOUR-USERNAME` with your actual GitHub username):

```powershell
git remote add origin https://github.com/YOUR-USERNAME/pg-essays.git
git branch -M main
git push -u origin main
```

You'll be prompted to log in to GitHub.

## Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Source", select **main** branch
5. Click **Save**
6. Wait 1-2 minutes for deployment

Your site will be live at: `https://YOUR-USERNAME.github.io/pg-essays/`

## Step 6: Add Custom Domain (hancer.org)

### 6A: Configure GitHub Pages

1. Still in Settings > Pages
2. Under "Custom domain", enter: `hancer.org`
3. Click **Save**
4. Check "Enforce HTTPS" (after DNS propagates)

### 6B: Update GoDaddy DNS Settings

1. Log in to GoDaddy: https://dcc.godaddy.com/
2. Go to **My Products** > **DNS** for hancer.org
3. Add these DNS records:

**For root domain (hancer.org):**
- Type: `A`
- Name: `@`
- Value: `185.199.108.153`
- TTL: 600 seconds

Add 3 more A records with these IPs:
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `YOUR-USERNAME.github.io`
- TTL: 1 Hour

4. Click **Save**

### 6C: Wait for DNS Propagation

DNS changes can take 5 minutes to 48 hours (usually 15-30 minutes).

Check status at: https://www.whatsmydns.net/#A/hancer.org

## Step 7: Verify Deployment

Once DNS propagates:
1. Visit https://hancer.org
2. Test search functionality
3. Test category filters
4. Open an essay modal
5. Toggle dark mode

## Updating the Site Later

When you make changes to the website:

```powershell
cd c:\Users\hance\.gemini\antigravity\playground\phantom-photon\pg-essays-site
git add .
git commit -m "Description of changes"
git push
```

GitHub Pages will automatically update within 1-2 minutes!

## Troubleshooting

**Site not loading?**
- Check DNS propagation: https://www.whatsmydns.net/#A/hancer.org
- Verify GitHub Pages is enabled in Settings > Pages
- Make sure repository is Public

**404 error?**
- Check that files are in the root of the repository
- Verify `index.html` exists

**Features not working?**
- Check browser console for errors (F12)
- Verify all files (essays.js, app.js, styles.css) are uploaded

## Need Help?

If you run into issues, let me know which step you're on and I'll help troubleshoot!
