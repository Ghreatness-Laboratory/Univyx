# 🚀 Deployment Checklist

## Pre-Deployment

### 1. Database Setup ✅
- [ ] Run `supabase-schema.sql` in Supabase SQL Editor
- [ ] Verify all 16 tables created
- [ ] Verify storage buckets (images, logos) created
- [ ] Test RLS policies work

### 2. Local Testing ✅
- [ ] `npm install` completed
- [ ] `.env` file configured
- [ ] `npm run dev` works
- [ ] Can register/login
- [ ] Can create content
- [ ] Can upload images
- [ ] All admin features work

### 3. Environment Variables ✅
```env
VITE_SUPABASE_URL=https://jkhqrzsaswhbewlumtyc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Deployment Steps

### Option 1: Netlify

1. **Push to GitHub**
```bash
git add .
git commit -m "Migrate to Supabase"
git push origin main
```

2. **Connect to Netlify**
- Go to https://app.netlify.com
- Click "Add new site" > "Import an existing project"
- Connect GitHub repository
- Select `univyx-main` repo

3. **Configure Build Settings**
```
Build command: npm run build
Publish directory: dist
```

4. **Add Environment Variables**
- Go to Site settings > Environment variables
- Add `VITE_SUPABASE_URL`
- Add `VITE_SUPABASE_ANON_KEY`

5. **Deploy**
- Click "Deploy site"
- Wait for build to complete
- Test live site

### Option 2: Vercel

1. **Push to GitHub** (same as above)

2. **Connect to Vercel**
- Go to https://vercel.com
- Click "Add New" > "Project"
- Import `univyx-main` repo

3. **Configure**
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

4. **Add Environment Variables**
- Add `VITE_SUPABASE_URL`
- Add `VITE_SUPABASE_ANON_KEY`

5. **Deploy**
- Click "Deploy"
- Wait for deployment
- Test live site

---

## Post-Deployment

### 1. Verify Production
- [ ] Site loads correctly
- [ ] Can register new user
- [ ] Can login
- [ ] Can view content
- [ ] Can create content (admin)
- [ ] Images load correctly
- [ ] No console errors

### 2. Configure Supabase for Production
- [ ] Add production URL to Supabase allowed URLs
  - Go to Supabase Dashboard
  - Authentication > URL Configuration
  - Add your Netlify/Vercel URL

### 3. Set Up Custom Domain (Optional)
- [ ] Add custom domain in Netlify/Vercel
- [ ] Update DNS records
- [ ] Enable HTTPS
- [ ] Update Supabase allowed URLs

### 4. Enable Google OAuth (Optional)
- [ ] Configure Google OAuth in Supabase
- [ ] Add authorized redirect URIs
- [ ] Test Google login

---

## Monitoring

### Supabase Dashboard
- Monitor database usage
- Check API requests
- Review error logs
- Monitor storage usage

### Hosting Platform
- Check build logs
- Monitor bandwidth
- Review function logs
- Check performance metrics

---

## Backup Strategy

### Database Backups
- Supabase automatically backs up daily
- Manual backup: Export from Table Editor
- Download SQL dump from Supabase

### Code Backups
- GitHub repository (version control)
- Local copies
- Deployment history in Netlify/Vercel

---

## Rollback Plan

### If Issues Occur:

1. **Revert Deployment**
```bash
# In Netlify/Vercel
- Go to Deployments
- Find previous working deployment
- Click "Publish deploy"
```

2. **Restore Database**
```bash
# In Supabase Dashboard
- Go to Database > Backups
- Restore from backup
```

3. **Check Logs**
```bash
# Netlify/Vercel
- Check function logs
- Check build logs

# Supabase
- Check API logs
- Check database logs
```

---

## Performance Optimization

### After Deployment:

1. **Enable Caching**
- Configure CDN caching
- Set cache headers

2. **Optimize Images**
- Use Supabase image transformations
- Lazy load images

3. **Monitor Performance**
- Use Lighthouse
- Check Core Web Vitals
- Monitor load times

---

## Security Checklist

- [ ] Environment variables not in code
- [ ] `.env` in `.gitignore`
- [ ] RLS policies enabled
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] API keys secure

---

## Final Verification

### Test All Features:

**Public Features**
- [ ] Homepage loads
- [ ] Articles page works
- [ ] Events page works
- [ ] News page works
- [ ] Store page works
- [ ] Gaming page works
- [ ] Can view content
- [ ] Can like/bookmark
- [ ] Can comment

**Authentication**
- [ ] Can register
- [ ] Can login
- [ ] Can logout
- [ ] Profile page works
- [ ] Google OAuth works (if enabled)

**Admin Features**
- [ ] Can access admin panel
- [ ] Can create articles
- [ ] Can create events
- [ ] Can create news
- [ ] Can upload images
- [ ] Can manage tournaments
- [ ] Can manage leaderboards
- [ ] Can manage universities
- [ ] Can manage stores
- [ ] Can manage team
- [ ] Can manage partners
- [ ] Can manage gallery
- [ ] Can manage FAQs
- [ ] Can update stats

---

## Success Metrics

### Day 1
- [ ] Site is live
- [ ] No critical errors
- [ ] Users can register/login
- [ ] Content is accessible

### Week 1
- [ ] Performance is good (< 2s load time)
- [ ] No database issues
- [ ] Storage working correctly
- [ ] All features functional

### Month 1
- [ ] Monitor usage patterns
- [ ] Optimize based on data
- [ ] Scale if needed
- [ ] User feedback positive

---

## Support Contacts

**Supabase Support**
- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs
- Email: support@supabase.com

**Hosting Support**
- Netlify: https://www.netlify.com/support
- Vercel: https://vercel.com/support

---

## 🎉 Deployment Complete!

Once all checkboxes are ticked, your Univyx platform is successfully deployed on Supabase!

**Estimated deployment time: 15-30 minutes**

---

**Remember:**
- Keep Supabase credentials secure
- Monitor usage regularly
- Back up data periodically
- Update dependencies monthly
- Review security settings quarterly
