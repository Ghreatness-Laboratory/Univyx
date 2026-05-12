# Supabase Migration Guide

## Step-by-Step Instructions to Migrate to New Supabase Project

### Step 1: Create New Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `univyx-new` (or your preferred name)
   - Database Password: (save this securely)
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait for project to be ready (2-3 minutes)

### Step 2: Get New Project Credentials
1. In your new project dashboard, click "Settings" (gear icon)
2. Go to "API" section
3. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

### Step 3: Run Migration SQL
1. In your new Supabase project, click "SQL Editor" in the left sidebar
2. Click "New Query"
3. Open the file `COMPLETE_MIGRATION.sql` from your project
4. Copy ALL the contents
5. Paste into the SQL Editor
6. Click "Run" (or press Ctrl+Enter)
7. Wait for completion (should see success message)

### Step 4: Verify Tables Created
1. Click "Table Editor" in left sidebar
2. You should see all these tables:
   - articles
   - events
   - news
   - gaming_events
   - tournaments
   - leaderboards
   - hall_of_fame_players ✅ (with updated structure)
   - gaming_wiki
   - gallery
   - universities
   - programs
   - stores
   - store_items
   - jobs
   - skills
   - team_members
   - partners
   - faqs
   - slideshow
   - site_settings
   - popups
   - likes
   - bookmarks
   - comments
   - ai_chat_history

### Step 5: Update Environment Variables
1. Open your project folder
2. Edit `.env` file
3. Replace with NEW credentials:
```env
VITE_SUPABASE_URL=https://YOUR_NEW_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_NEW_ANON_KEY
VITE_GROQ_API_KEY=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
```

### Step 6: Restart Development Server
```bash
# Stop current server (Ctrl+C)
# Start fresh
npm run dev
```

### Step 7: Test Admin Panel
1. Go to http://localhost:5173
2. Login/Register a new account
3. Go to Admin Dashboard
4. Try each section:
   - ✅ Articles - Create, Edit, Delete
   - ✅ Events - Create, Edit, Delete
   - ✅ News - Create, Edit, Delete
   - ✅ Gaming Events - Create, Edit, Delete
   - ✅ Tournaments - Create, Edit, Delete
   - ✅ Power Rankings - Create, Edit, Delete
   - ✅ Hall of Fame - Create, Edit, Delete (should work now!)
   - ✅ Gaming Wiki - Create, Edit, Delete
   - ✅ Stores - Create, Edit, Delete
   - ✅ Jobs - Create, Edit, Delete
   - ✅ Skills - Create, Edit, Delete

### Step 8: Configure Storage (Optional)
If you need to upload images:
1. Go to "Storage" in Supabase dashboard
2. The `images` bucket should already be created
3. If not, create it manually:
   - Click "New bucket"
   - Name: `images`
   - Public: Yes
   - Click "Create bucket"

### Step 9: Set Up Authentication (Optional)
If you want Google OAuth:
1. Go to "Authentication" → "Providers"
2. Enable "Google"
3. Add your Google OAuth credentials
4. Save

### Step 10: Deploy to Vercel (When Ready)
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Update:
   - `VITE_SUPABASE_URL` = your new URL
   - `VITE_SUPABASE_ANON_KEY` = your new key
5. Redeploy

## What's Different in New Database?

### Hall of Fame Table - Updated Structure:
- ✅ `rank` is now INTEGER (1-100) instead of TEXT
- ✅ `total_mvps` replaces `total_wins`
- ✅ `total_championships` added
- ✅ `experience` added (e.g., "5 years")
- ✅ All RLS policies properly configured

### All Tables Have:
- ✅ Proper UUID primary keys
- ✅ Created_at and updated_at timestamps
- ✅ Row Level Security enabled
- ✅ Public read access
- ✅ Authenticated user write access
- ✅ Optimized indexes for performance

## Troubleshooting

### Issue: "relation does not exist"
**Solution:** Run `COMPLETE_MIGRATION.sql` again

### Issue: "permission denied"
**Solution:** Make sure you're logged in to admin panel

### Issue: Can't delete items
**Solution:** Check browser console for errors. RLS policies should allow authenticated users to delete.

### Issue: Images not uploading
**Solution:** 
1. Check Storage bucket exists
2. Verify bucket is public
3. Check storage policies are created

### Issue: Old data still showing
**Solution:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Check you updated .env file
4. Restart dev server

## Benefits of New Database

✅ **Clean slate** - No old mock data
✅ **Updated structure** - Hall of Fame with rank 1-100, MVPs, Championships
✅ **Proper RLS** - All permissions configured correctly
✅ **Better performance** - Optimized indexes
✅ **Complete schema** - All tables from day one
✅ **No migration issues** - Fresh start

## Need Help?

Check these files:
- `COMPLETE_MIGRATION.sql` - Full database schema
- `HALL_OF_FAME_TROUBLESHOOTING.md` - Debugging guide
- `.env.example` - Environment variable template

Console logs will show detailed errors if anything fails!
