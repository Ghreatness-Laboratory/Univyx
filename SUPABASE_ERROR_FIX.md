# 🔧 Quick Fix: Supabase Error

## Error Message:
```
Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file
Uncaught Error: supabaseUrl is required.
```

## ✅ Solution:

### Step 1: Verify .env File Exists
Check that `.env` file exists in root directory with:
```env
VITE_SUPABASE_URL=https://jkhqrzsaswhbewlumtyc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpraHFyenNhc3doYmV3bHVtdHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MzU2MDQsImV4cCI6MjA4ODMxMTYwNH0.IoqCORve9kQ7QEOlxcyoHQ-eDpJ_LeMaF_Zfo_ap8Kw
```

### Step 2: Restart Dev Server
**IMPORTANT**: Vite only loads `.env` on startup!

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Clear Browser Cache
```bash
# In browser:
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

## ✅ Verification
After restart, you should NOT see the error in console.

## 🔍 Still Not Working?

### Check 1: File Location
`.env` must be in project root (same level as `package.json`)

### Check 2: File Name
Must be exactly `.env` (not `.env.local` or `env.txt`)

### Check 3: No Spaces
```env
# ❌ Wrong (space after =)
VITE_SUPABASE_URL= https://...

# ✅ Correct (no space)
VITE_SUPABASE_URL=https://...
```

### Check 4: No Quotes
```env
# ❌ Wrong
VITE_SUPABASE_URL="https://..."

# ✅ Correct
VITE_SUPABASE_URL=https://...
```

## 🎯 Quick Test
After restart, open browser console and type:
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL)
```
Should show: `https://jkhqrzsaswhbewlumtyc.supabase.co`

If it shows `undefined`, the `.env` file isn't being loaded.
