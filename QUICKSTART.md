# ⚡ Quick Start - AI Chatbot

## 🚀 Get Started in 3 Minutes

### Step 1: Database Setup (1 minute)
1. Open: https://supabase.com/dashboard/project/jkhqrzsaswhbewlumtyc
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy ALL content from `supabase-complete-schema.sql`
5. Paste and click **Run** (or Ctrl+Enter)
6. Wait for "Success" message

### Step 2: Verify Environment (30 seconds)
Check your `.env` file has:
```env
VITE_SUPABASE_URL=https://jkhqrzsaswhbewlumtyc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GROQ_API_KEY=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
```

### Step 3: Start App (30 seconds)
```bash
npm run dev
```

### Step 4: Test Chatbot (1 minute)
1. Open http://localhost:5173
2. Click **Academics** in navigation
3. Look for purple/blue bot icon (bottom-right corner)
4. Click the bot icon
5. Type: "What programs does the university offer?"
6. Watch AI respond in real-time! 🎉

---

## 🎯 Test Questions

Try asking the chatbot:
- "What programs does the university offer?"
- "Tell me about campus facilities"
- "How do I apply for admission?"
- "What's the contact information?"
- "Tell me about student services"
- "What are the tuition fees?"

---

## ✅ What to Check

### Chatbot Working?
- ✅ Bot icon appears on Academics page
- ✅ Chatbot opens when clicked
- ✅ Messages send successfully
- ✅ AI responds with text
- ✅ Text streams in real-time
- ✅ Minimize/maximize works
- ✅ Can close and reopen

### Gaming Events Separated?
- ✅ Gaming page shows gaming events only
- ✅ Entertainment page shows campus events only
- ✅ No overlap between the two

### Database Working?
- ✅ No "table not found" errors in console
- ✅ Data loads successfully
- ✅ No Supabase errors

---

## 🐛 Quick Fixes

### Chatbot Not Appearing?
```bash
# Restart dev server
Ctrl+C
npm run dev
```

### "Table not found" Error?
- Run `supabase-complete-schema.sql` in Supabase SQL Editor

### AI Not Responding?
- Check Groq API key in `.env`
- Check browser console for errors
- Verify internet connection

---

## 📱 Mobile Testing

1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Open on phone: `http://YOUR_IP:5173`
3. Test chatbot on mobile device

---

## 🎉 You're Done!

The AI chatbot is now live and ready to answer questions about your university!

**Next**: Read `AI_INTEGRATION_GUIDE.md` for advanced features
