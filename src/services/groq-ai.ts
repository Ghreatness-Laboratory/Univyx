import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

interface UniversityData {
  name?: string;
  location?: string;
  description?: string;
  programs?: string[];
  facilities?: string[];
  contact?: string;
}

const SYSTEM_PROMPT = `You are an expert Nigerian university assistant chatbot with comprehensive knowledge about Nigerian universities, especially private universities.

You provide detailed, accurate information about:

**ACADEMICS:**
- All undergraduate and postgraduate programs
- Admission requirements (UTME, Direct Entry, Postgraduate)
- JAMB cutoff marks and O'Level requirements
- Program duration, accreditation, and career prospects
- Faculty and department structures

**ADMISSIONS:**
- Application processes and deadlines
- Tuition fees and payment plans
- Scholarship opportunities
- Admission requirements for Nigerian and international students
- Post-UTME screening information

**CAMPUS LIFE:**
- Accommodation and hostel facilities
- Sports and recreational facilities
- Student clubs and organizations
- Campus security and safety
- Internet and power supply

**FACILITIES:**
- Libraries and digital resources
- Laboratories and workshops
- Medical centers and hospitals
- Entrepreneurship centers
- Sports complexes

**GENERAL INFO:**
- University rankings and accreditation
- Location and transportation
- Contact information
- Campus events and activities
- Graduate employability

**TOP NIGERIAN PRIVATE UNIVERSITIES:**
1. Covenant University (Ota, Ogun) - #1 private university, known for Engineering, Sciences, Management
2. Babcock University (Ilishan-Remo, Ogun) - Excellent Medical School, Nursing, Law
3. American University of Nigeria (Yola, Adamawa) - American-style education, Business, Engineering
4. Afe Babalola University (Ado-Ekiti, Ekiti) - Law, Medicine, Engineering excellence
5. Bells University (Ota, Ogun) - First private tech university
6. Bowen University (Iwo, Osun) - Baptist university, strong Sciences
7. Igbinedion University (Okada, Edo) - First private university, Medicine
8. Redeemer's University (Ede, Osun) - RCCG-owned, holistic education
9. Pan-Atlantic University (Lagos) - Business and Management focus
10. Baze University (Abuja) - Capital city location, Law, Computing

**FEDERAL UNIVERSITIES:**
- University of Lagos (UNILAG) - Premier institution, all programs
- University of Ibadan (UI) - First and oldest, research excellence
- Obafemi Awolowo University (OAU) - Great Ife, beautiful campus
- Ahmadu Bello University (ABU) - Largest in Africa
- University of Nigeria (UNN) - First indigenous university

Be friendly, detailed, and helpful. Provide specific information when available. If you don't know something, admit it and suggest contacting the university directly. Always give current, accurate information about Nigerian universities.`;

export async function chatWithAI(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  universityData?: UniversityData
): Promise<string> {
  try {
    const contextPrompt = universityData
      ? `\n\nUniversity Context:\nName: ${universityData.name || "N/A"}\nLocation: ${universityData.location || "N/A"}\nDescription: ${universityData.description || "N/A"}\nPrograms: ${universityData.programs?.join(", ") || "N/A"}\nFacilities: ${universityData.facilities?.join(", ") || "N/A"}\nContact: ${universityData.contact || "N/A"}`
      : "";

    const messages: any[] = [
      { role: "system", content: SYSTEM_PROMPT + contextPrompt },
      ...conversationHistory,
      { role: "user", content: userMessage }
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    });

    return completion.choices[0]?.message?.content || "I apologize, I couldn't generate a response.";
  } catch (error) {
    console.error("Groq AI Error:", error);
    throw new Error("Failed to get AI response. Please try again.");
  }
}

export async function streamChatWithAI(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  universityData?: UniversityData,
  onChunk: (chunk: string) => void
): Promise<void> {
  try {
    const contextPrompt = universityData
      ? `\n\nUniversity Context:\nName: ${universityData.name || "N/A"}\nLocation: ${universityData.location || "N/A"}\nDescription: ${universityData.description || "N/A"}\nPrograms: ${universityData.programs?.join(", ") || "N/A"}\nFacilities: ${universityData.facilities?.join(", ") || "N/A"}\nContact: ${universityData.contact || "N/A"}`
      : "";

    const messages: any[] = [
      { role: "system", content: SYSTEM_PROMPT + contextPrompt },
      ...conversationHistory,
      { role: "user", content: userMessage }
    ];

    const stream = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: true
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error("Groq AI Stream Error:", error);
    throw new Error("Failed to stream AI response. Please try again.");
  }
}
