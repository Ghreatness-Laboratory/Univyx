# Hall of Fame Admin - Troubleshooting Guide

## Issue: Cannot Delete Hall of Fame Players

### Step 1: Check Database Schema
Run this SQL in Supabase SQL Editor to verify the table exists and has correct structure:

```sql
-- Check if table exists and view structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'hall_of_fame_players'
ORDER BY ordinal_position;

-- Check current data
SELECT id, name, gamertag, rank, total_mvps, total_championships, experience
FROM hall_of_fame_players
ORDER BY display_order;
```

### Step 2: Fix Row Level Security (RLS) Policies
Run the SQL file: `fix-hall-of-fame-rls.sql`

This will:
- Allow public read access
- Allow authenticated users to INSERT, UPDATE, DELETE

### Step 3: Update Database Schema
Run the SQL file: `update-hall-of-fame.sql`

This will:
- Change rank from TEXT to INTEGER (1-100)
- Remove total_wins column
- Add total_mvps, total_championships, experience columns

### Step 4: Verify User Authentication
Make sure you're logged in:
1. Open browser console (F12)
2. Run: `localStorage.getItem('supabase.auth.token')`
3. Should return a token, not null

### Step 5: Check Browser Console
When you try to delete:
1. Open browser console (F12)
2. Look for error messages
3. Common errors:
   - "new row violates row-level security policy" → Run fix-hall-of-fame-rls.sql
   - "column does not exist" → Run update-hall-of-fame.sql
   - "permission denied" → Check Supabase project permissions

### Step 6: Test Delete Operation Manually
Run this in Supabase SQL Editor:

```sql
-- Try to delete a specific player (replace with actual ID)
DELETE FROM hall_of_fame_players 
WHERE gamertag = 'ProGamer123';

-- If error, check RLS policies
SELECT * FROM pg_policies 
WHERE tablename = 'hall_of_fame_players';
```

### Step 7: Clear Mock Data
To remove all sample/mock data:

```sql
-- Delete all mock players
DELETE FROM hall_of_fame_players 
WHERE gamertag IN ('ProGamer123', 'ElitePlayer', 'ChampionX', 'QueenGamer', 'SpeedRunner');

-- Verify deletion
SELECT COUNT(*) FROM hall_of_fame_players;
```

### Step 8: Test in Admin Panel
1. Go to Admin Dashboard → Gaming → Hall of Fame
2. You should see console logs when:
   - Page loads: "Fetching Hall of Fame players..."
   - Click delete: "Attempting to delete player with ID: ..."
3. If delete fails, you'll see detailed error message

### Common Issues & Solutions

#### Issue: "Failed to delete player: new row violates row-level security policy"
**Solution:** Run `fix-hall-of-fame-rls.sql`

#### Issue: "column 'total_wins' does not exist"
**Solution:** Run `update-hall-of-fame.sql`

#### Issue: Delete button doesn't work at all
**Solution:** 
1. Check browser console for JavaScript errors
2. Verify Supabase connection: Check `.env` file has correct credentials
3. Test Supabase connection in browser console:
```javascript
import { supabase } from './src/lib/supabase';
const { data, error } = await supabase.from('hall_of_fame_players').select('*');
console.log(data, error);
```

#### Issue: Changes don't reflect on frontend
**Solution:**
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Check if HallOfFame.tsx is fetching from correct table

### Verification Checklist
- [ ] Ran `fix-hall-of-fame-rls.sql` in Supabase SQL Editor
- [ ] Ran `update-hall-of-fame.sql` in Supabase SQL Editor
- [ ] Logged in to admin panel
- [ ] Browser console shows no errors
- [ ] Can see players in admin panel
- [ ] Delete button shows confirmation dialog
- [ ] Console shows "Attempting to delete player..." message
- [ ] Player disappears from list after deletion
- [ ] Frontend Hall of Fame section updates

### Still Not Working?
1. Export your current database schema:
   - Go to Supabase Dashboard → Database → Schema
   - Copy the hall_of_fame_players table structure
   
2. Check Supabase logs:
   - Go to Supabase Dashboard → Logs
   - Look for errors related to hall_of_fame_players

3. Verify environment variables:
   - Check `.env` file has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
   - Restart dev server after changing .env

4. Test with Supabase client directly:
```javascript
// In browser console
const { data, error } = await supabase
  .from('hall_of_fame_players')
  .delete()
  .eq('id', 'PASTE_PLAYER_ID_HERE');
console.log('Delete result:', { data, error });
```
