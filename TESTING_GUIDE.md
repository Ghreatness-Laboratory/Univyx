# 🧪 Testing Guide - AI Integration

## 🎯 Test Scenarios

### 1. AI Chatbot Tests

#### Basic Functionality
- [ ] Bot icon visible on Academics page (bottom-right)
- [ ] Bot icon has pulse animation
- [ ] Clicking icon opens chatbot
- [ ] Welcome message displays
- [ ] Input field is focused and ready

#### Messaging
- [ ] Can type in input field
- [ ] Enter key sends message
- [ ] Send button works
- [ ] User message appears on right (purple/blue)
- [ ] AI response appears on left (white)
- [ ] Text streams in real-time (word by word)
- [ ] Loading dots show while waiting

#### UI Controls
- [ ] Minimize button reduces to small window
- [ ] Maximize button restores full window
- [ ] Close button closes chatbot
- [ ] Can reopen after closing
- [ ] Conversation persists during session
- [ ] Scroll works in message area

#### AI Responses
Test these questions:

**Programs & Academics**
```
Q: "What programs does the university offer?"
Expected: Lists available programs

Q: "Tell me about the Computer Science program"
Expected: Details about CS program

Q: "What degrees are available?"
Expected: Bachelor, Master, PhD info
```

**Admissions**
```
Q: "How do I apply?"
Expected: Application process info

Q: "What are the admission requirements?"
Expected: Requirements details

Q: "When is the application deadline?"
Expected: Deadline information
```

**Campus & Facilities**
```
Q: "What facilities are available?"
Expected: Lists campus facilities

Q: "Tell me about the campus"
Expected: Campus description

Q: "Where is the library?"
Expected: Library location info
```

**Contact Information**
```
Q: "How can I contact the university?"
Expected: Contact methods

Q: "What's the phone number?"
Expected: Phone number

Q: "What's the email address?"
Expected: Email address
```

**General Questions**
```
Q: "Tell me about student life"
Expected: Student activities info

Q: "What clubs are available?"
Expected: Student clubs info

Q: "Is there housing available?"
Expected: Housing information
```

---

### 2. Gaming Events Tests

#### Events Display
- [ ] Gaming page loads successfully
- [ ] Gaming events display (tournaments, competitions)
- [ ] Events show game names
- [ ] Prize pools visible
- [ ] Participant counts shown
- [ ] Registration deadlines displayed

#### Event Details
- [ ] Event titles clear
- [ ] Descriptions readable
- [ ] Dates formatted correctly
- [ ] Locations shown
- [ ] Status indicators work (upcoming/ongoing/completed)

#### Separation from Entertainment
- [ ] Gaming events NOT on Entertainment page
- [ ] Entertainment events NOT on Gaming page
- [ ] No duplicate events
- [ ] Each page shows correct event type

---

### 3. Entertainment Events Tests

#### Events Display
- [ ] Entertainment page loads
- [ ] Campus events display
- [ ] Music festivals shown
- [ ] Tech talks visible
- [ ] Art exhibitions listed

#### Event Types
- [ ] Music events
- [ ] Technology events
- [ ] Arts events
- [ ] Social gatherings
- [ ] Academic events

---

### 4. Database Tests

#### Tables Exist
Open browser console and check for errors:
- [ ] No "table not found" errors
- [ ] No "relation does not exist" errors
- [ ] No Supabase connection errors

#### Data Loading
- [ ] Articles load
- [ ] Events load
- [ ] Gaming events load
- [ ] News loads
- [ ] Universities load
- [ ] Products load

#### Queries Work
- [ ] Can fetch data
- [ ] Sorting works
- [ ] Filtering works
- [ ] Pagination works (if implemented)

---

### 5. Performance Tests

#### Load Times
- [ ] Page loads < 3 seconds
- [ ] AI response < 2 seconds
- [ ] Smooth animations
- [ ] No lag when typing

#### Streaming
- [ ] AI text streams smoothly
- [ ] No stuttering
- [ ] Consistent speed
- [ ] Complete responses

---

### 6. Mobile Tests

#### Responsive Design
- [ ] Chatbot works on mobile
- [ ] Bot icon visible and clickable
- [ ] Chat window fits screen
- [ ] Input field accessible
- [ ] Keyboard doesn't cover input
- [ ] Messages readable

#### Touch Interactions
- [ ] Can tap bot icon
- [ ] Can tap send button
- [ ] Can scroll messages
- [ ] Can minimize/maximize
- [ ] Can close chatbot

---

### 7. Error Handling Tests

#### Network Errors
- [ ] Disconnect internet → Send message
- [ ] Should show error message
- [ ] Should not crash app

#### Invalid Input
- [ ] Send empty message → Should not send
- [ ] Send very long message → Should handle
- [ ] Special characters → Should work

#### API Errors
- [ ] Invalid API key → Should show error
- [ ] Rate limit → Should handle gracefully
- [ ] Timeout → Should retry or show error

---

### 8. Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile browsers

---

### 9. Security Tests

#### Environment Variables
- [ ] API keys not exposed in browser
- [ ] .env file not committed to Git
- [ ] No sensitive data in console logs

#### Supabase RLS
- [ ] Can read public data
- [ ] Cannot modify without auth
- [ ] User data protected

---

### 10. Integration Tests

#### Full User Flow
1. [ ] Open app
2. [ ] Navigate to Academics
3. [ ] Click bot icon
4. [ ] Ask question
5. [ ] Get response
6. [ ] Ask follow-up
7. [ ] Get response
8. [ ] Minimize chat
9. [ ] Navigate to other page
10. [ ] Return to Academics
11. [ ] Maximize chat
12. [ ] Conversation still there
13. [ ] Close chat
14. [ ] Reopen chat
15. [ ] New conversation starts

---

## 🐛 Bug Report Template

If you find issues, document them:

```
**Bug**: [Short description]
**Steps to Reproduce**:
1. 
2. 
3. 

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Browser**: [Chrome/Firefox/Safari]
**Device**: [Desktop/Mobile]
**Console Errors**: [Any errors in console]
**Screenshots**: [If applicable]
```

---

## ✅ Success Criteria

### Must Pass
- ✅ AI chatbot responds to questions
- ✅ Gaming events separate from entertainment
- ✅ No database errors
- ✅ Mobile responsive
- ✅ No console errors

### Should Pass
- ✅ Fast response times
- ✅ Smooth animations
- ✅ Good error handling
- ✅ Works in all browsers

### Nice to Have
- ✅ Conversation context maintained
- ✅ Smart AI responses
- ✅ Beautiful UI
- ✅ Accessibility features

---

## 📊 Test Results Template

```
Date: [Date]
Tester: [Name]
Environment: [Dev/Staging/Production]

AI Chatbot: ✅ / ❌
Gaming Events: ✅ / ❌
Entertainment Events: ✅ / ❌
Database: ✅ / ❌
Performance: ✅ / ❌
Mobile: ✅ / ❌
Security: ✅ / ❌

Issues Found: [Number]
Critical: [Number]
Major: [Number]
Minor: [Number]

Notes:
[Additional comments]
```

---

## 🎉 Ready to Test!

Follow this guide to ensure everything works perfectly before deployment.
