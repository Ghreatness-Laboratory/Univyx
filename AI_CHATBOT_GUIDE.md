# AI Chatbot - Nigerian Universities Training Guide

## Changes Made

### 1. Chatbot Position Fixed ✅
- Moved from `bottom-6` to `bottom-24` 
- Now sits above the bottom navigation bar
- No more overlap issues on mobile or desktop

### 2. Extensive AI Training ✅

The AI chatbot is now extensively trained with:

#### **Nigerian Universities Knowledge**
- 15 major universities (10 private + 5 federal)
- Detailed information for each university
- Rankings and reputation data
- Location and contact information

#### **Academic Programs**
- All major faculties and departments
- Undergraduate programs (BSc, BEng, BA, LLB, MBBS)
- Postgraduate programs (MSc, MEng, PhD, PGD)
- Program duration and requirements
- Career prospects for each program
- Accreditation information (NUC, COREN, ICAN, etc.)

#### **Admission Information**
- UTME requirements and cutoff marks
- Direct Entry requirements
- Postgraduate admission criteria
- O'Level requirements
- JAMB subject combinations
- Application processes and deadlines
- Tuition fees ranges
- Scholarship opportunities

#### **Campus Facilities**
- Libraries and digital resources
- Laboratories and workshops
- Sports complexes
- Medical centers
- Hostels and accommodation
- Entrepreneurship centers
- Power supply and internet

#### **Universities Covered**

**Private Universities:**
1. **Covenant University** - #1 private, Engineering, Sciences, Management
2. **Babcock University** - Medical School, Nursing, Law excellence
3. **American University of Nigeria** - American-style, Business, Engineering
4. **Afe Babalola University** - Law, Medicine, Engineering
5. **Bells University** - First private tech university
6. **Bowen University** - Baptist, strong Sciences
7. **Igbinedion University** - First private, Medicine
8. **Redeemer's University** - RCCG-owned, holistic
9. **Pan-Atlantic University** - Business focus, Lagos
10. **Baze University** - Abuja location, Law, Computing

**Federal Universities:**
1. **University of Lagos (UNILAG)** - Premier, all programs
2. **University of Ibadan (UI)** - First and oldest
3. **Obafemi Awolowo University (OAU)** - Great Ife
4. **Ahmadu Bello University (ABU)** - Largest in Africa
5. **University of Nigeria (UNN)** - First indigenous

## Database Setup

### Run the SQL File
Execute `supabase-universities-data.sql` in Supabase SQL Editor to:
- Add comprehensive university data
- Create programs table with detailed program info
- Create facilities table with campus facilities
- Create admissions table with admission requirements
- Insert sample data for Covenant University

### Tables Created
1. **universities** - Main university information
2. **university_programs** - Detailed program information
3. **university_facilities** - Campus facilities and features
4. **university_admissions** - Admission requirements and processes

## What the AI Can Answer

### Sample Questions the AI Can Handle:

**About Programs:**
- "What programs does Covenant University offer?"
- "Tell me about Computer Engineering at Covenant University"
- "What are the admission requirements for Medicine at Babcock?"
- "How long is the Accounting program?"
- "What can I do with a Mass Communication degree?"

**About Admissions:**
- "What is the JAMB cutoff for Covenant University?"
- "How do I apply for Direct Entry?"
- "What are the O'Level requirements for Engineering?"
- "When is the application deadline?"
- "How much are the tuition fees?"
- "Are there scholarships available?"

**About Facilities:**
- "What facilities does Covenant University have?"
- "Tell me about the library"
- "Is there 24/7 power supply?"
- "What sports facilities are available?"
- "How are the hostels?"

**About Universities:**
- "Which is the best private university in Nigeria?"
- "Compare Covenant and Babcock universities"
- "Tell me about American University of Nigeria"
- "What makes Covenant University special?"
- "Where is Bells University located?"

**General Questions:**
- "What universities offer Medicine?"
- "Best universities for Engineering in Nigeria"
- "Private vs Federal universities"
- "How to choose a university"
- "University rankings in Nigeria"

## Adding More Data

### Add More Universities
```sql
INSERT INTO universities (name, abbreviation, website, location, description, established_year) VALUES
('University Name', 'ABBR', 'https://website.com', 'City, State', 'Detailed description...', 2020);
```

### Add Programs
```sql
INSERT INTO university_programs (university_id, faculty, department, program_name, degree_type, duration, requirements, career_prospects, accreditation) VALUES
((SELECT id FROM universities WHERE abbreviation = 'CU'), 
'Engineering', 'Mechanical Engineering', 'Mechanical Engineering', 'BEng', 
'5 years', 'UTME requirements...', 'Career options...', 'NUC, COREN');
```

### Add Facilities
```sql
INSERT INTO university_facilities (university_id, facility_name, facility_type, description, capacity, features) VALUES
((SELECT id FROM universities WHERE abbreviation = 'CU'),
'New Lab', 'laboratory', 'Description...', 100, 
ARRAY['Feature 1', 'Feature 2']);
```

### Add Admission Info
```sql
INSERT INTO university_admissions (university_id, admission_type, requirements, cutoff_mark, application_process, fees_range, scholarships) VALUES
((SELECT id FROM universities WHERE abbreviation = 'CU'),
'UTME', 'Requirements...', 200, 'Process...', '₦800,000 - ₦1,200,000', 'Available scholarships...');
```

## AI Model Details

- **Model**: Llama 3.3 70B (via Groq API)
- **Temperature**: 0.7 (balanced creativity and accuracy)
- **Max Tokens**: 1024 (detailed responses)
- **Streaming**: Yes (real-time responses)
- **Context**: Full conversation history maintained

## Features

✅ Real-time streaming responses
✅ Conversation history maintained
✅ Context-aware answers
✅ Comprehensive Nigerian university knowledge
✅ Detailed program information
✅ Admission requirements and processes
✅ Campus facilities information
✅ Career prospects guidance
✅ Friendly and helpful tone
✅ Admits when it doesn't know something

## Testing the Chatbot

1. Go to `/academics` page
2. Click the purple chatbot button (bottom right, above nav)
3. Try these questions:
   - "What programs does Covenant University offer?"
   - "Tell me about admission requirements"
   - "What facilities are available?"
   - "Compare Covenant and Babcock"
   - "Best universities for Computer Science"

## Customization

### Update System Prompt
Edit `src/services/groq-ai.ts` to modify the AI's behavior and knowledge.

### Add More Training Data
Add more universities, programs, and facilities to the database tables.

### Adjust AI Parameters
- `temperature`: 0.1-1.0 (lower = more focused, higher = more creative)
- `max_tokens`: Response length limit
- `model`: Can switch to other Groq models

## Troubleshooting

**Chatbot not appearing:**
- Check VITE_GROQ_API_KEY in .env file
- Verify Groq API key is valid
- Check browser console for errors

**Responses not accurate:**
- Add more data to database tables
- Update system prompt with more context
- Verify university data is correct

**Slow responses:**
- Check internet connection
- Groq API may be rate-limited
- Consider reducing max_tokens

## Future Enhancements

Potential improvements:
- Voice input/output
- Multi-language support
- Image recognition for campus maps
- Integration with admission portal
- Personalized recommendations
- Chat history persistence
- Admin dashboard for training data
- Analytics on common questions
