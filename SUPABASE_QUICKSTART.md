# Supabase Quick Start - 5 Minutes Setup

## Step 1: Install Dependencies (Already Done ✅)
```bash
npm install @supabase/supabase-js
```

## Step 2: Set Up Database

1. Open Supabase Dashboard: https://supabase.com/dashboard/project/jkhqrzsaswhbewlumtyc

2. Go to **SQL Editor** (left sidebar)

3. Click **New Query**

4. Copy ALL content from `supabase-schema.sql` file

5. Paste into SQL Editor

6. Click **Run** (or press Ctrl+Enter)

7. Wait for "Success" message

## Step 3: Verify Setup

### Check Tables
1. Go to **Table Editor** (left sidebar)
2. You should see these tables:
   - articles
   - events  
   - news
   - tournaments
   - leaderboards
   - universities
   - stores
   - store_items
   - team_members
   - partners
   - gallery
   - faqs
   - homepage_stats
   - comments
   - likes
   - bookmarks

### Check Storage
1. Go to **Storage** (left sidebar)
2. You should see these buckets:
   - images
   - logos

## Step 4: Test the App

```bash
# Start development server
npm run dev

# Open browser
http://localhost:5173
```

### Test Authentication
1. Click "Sign Up"
2. Create account with email/password
3. Login with credentials
4. Should see your profile

### Test Admin Features
1. Login as admin
2. Go to `/admin`
3. Try creating an article
4. Upload an image
5. Verify it appears in the list

## Step 5: Add Sample Data (Optional)

Go to **Table Editor** and manually add some test data:

### Add a Test Article
```sql
INSERT INTO articles (title, content, category)
VALUES ('Welcome to Univyx', 'This is a test article', 'Announcement');
```

### Add a Test Event
```sql
INSERT INTO events (title, description, date, location)
VALUES ('Campus Fest', 'Annual campus festival', NOW() + INTERVAL '7 days', 'Main Campus');
```

### Add Homepage Stats
```sql
INSERT INTO homepage_stats (students, universities, events, tournaments)
VALUES (5000, 10, 50, 20);
```

## ✅ Done!

Your app is now running on Supabase!

## 🔍 Verify Everything Works

- [ ] Can register new user
- [ ] Can login
- [ ] Can view articles/events/news
- [ ] Can create content (admin)
- [ ] Can upload images
- [ ] Can like/bookmark
- [ ] Can comment

## 🐛 Common Issues

**Issue**: Tables not showing
**Fix**: Re-run the SQL schema

**Issue**: Can't upload images
**Fix**: Check storage buckets exist and are public

**Issue**: Authentication not working
**Fix**: Check .env file has correct keys

**Issue**: RLS policy errors
**Fix**: Make sure all RLS policies were created from schema

## 📞 Need Help?

Check the full guide: `SUPABASE_MIGRATION.md`
