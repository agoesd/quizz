# ⚡ Deploy Cheatsheet - Quick Reference

## 🚀 Method 1: GitHub + Vercel (EASIEST)

```bash
# 1. Setup Git
git init
git add .
git commit -m "Initial commit"

# 2. Push to GitHub
git remote add origin https://github.com/USERNAME/quizz.git
git push -u origin main

# 3. Deploy on Vercel
# - Go to vercel.com
# - Login with GitHub
# - Click "Add New..." → "Project"
# - Import "quizz" repo
# - Click "Deploy"
# Done! ✅
```

## 💻 Method 2: Vercel CLI (FASTEST)

```bash
# 1. Install CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
cd quizz
vercel --prod

# Done! ✅
```

---

## 🔄 Update After Deploy

### Via GitHub (Auto)
```bash
git add .
git commit -m "Update content"
git push
# Auto-deploy! ✅
```

### Via CLI
```bash
vercel --prod
```

---

## 📝 Essential Files

### vercel.json (Root folder)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### .gitignore
```
node_modules/
dist/
.env
.DS_Store
```

---

## 🔧 Common Commands

```bash
# Build test
npm run build

# Deploy preview
vercel

# Deploy production
vercel --prod

# Check deployments
vercel ls

# View logs
vercel logs

# Remove deployment
vercel rm [deployment-url]
```

---

## 🐛 Quick Fixes

### Build Failed?
```bash
npm run build  # Test locally first
```

### 404 on refresh?
→ Add `vercel.json` with rewrites

### JSON not loading?
→ Check files in `public/quiz-data/`

### Need to rollback?
→ Vercel Dashboard → Deployments → Redeploy old version

---

## 📱 Get Your URL

After deploy:
- Preview: `https://quizz-xxxx.vercel.app`
- Production: `https://quizz.vercel.app`
- Custom: Setup in Settings → Domains

---

## ✅ Pre-Deploy Checklist

- [ ] `npm run build` works
- [ ] No errors in console
- [ ] Quiz data in `public/quiz-data/`
- [ ] `.gitignore` created
- [ ] `vercel.json` created
- [ ] Tested locally

---

## 🆓 Free Tier Limits

- Bandwidth: 100GB/month
- Deployments: Unlimited
- Build time: 6,000 min/month
- Custom domain: Yes (1 domain)

**Perfect for quiz app!** ✅

---

## 🔗 Quick Links

- Dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
- Docs: [vercel.com/docs](https://vercel.com/docs)
- Status: [vercel-status.com](https://vercel-status.com)

---

## 💡 Pro Tips

1. **Auto Deploy:** Connect GitHub → Every push = auto deploy
2. **Preview URLs:** Each commit gets preview URL
3. **Instant Rollback:** One click to previous version
4. **Zero Config:** Vercel detects Vite automatically
5. **Fast CDN:** Global edge network included

---

## 📊 Workflow

```
Local Development
    ↓ git push
GitHub Repository
    ↓ auto trigger
Vercel Build & Deploy
    ↓
Production URL ✅
```

---

**That's it! Deploy in 2 minutes! 🎉**
