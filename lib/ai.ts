import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

const resumeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    message: {
      type: Type.STRING,
      description: "A friendly conversational response to the user.",
    },
    resume: {
      type: Type.OBJECT,
      properties: {
        personalInfo: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            location: { type: Type.STRING },
            jobTitle: { type: Type.STRING },
            website: { type: Type.STRING },
          },
        },
        summary: {
          type: Type.STRING,
          description: "Professional summary paragraph. Keep it to 3-4 sentences. Format as plain text.",
        },
        experience: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              company: { type: Type.STRING },
              position: { type: Type.STRING },
              startDate: { type: Type.STRING },
              endDate: { type: Type.STRING, description: "e.g., 'Present' or 'Dec 2023'" },
              description: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Bullet points outlining achievements. Optimize for ATS.",
              },
            },
          },
        },
        education: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              institution: { type: Type.STRING },
              degree: { type: Type.STRING },
              graduationYear: { type: Type.STRING },
            },
          },
        },
        skills: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, description: "e.g., 'Languages', 'Frameworks'" },
              items: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
          },
        },
        projects: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              link: { type: Type.STRING },
            },
          },
        },
      },
    },
  },
};

export async function processChatWithAI(
  userMessage: string,
  currentResume: any,
  chatHistory: { role: string; content: string }[]
) {
  const historyText = chatHistory
    .map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.content}`)
    .join("\n");

  const prompt = `
You are an expert ATS-friendly Resume Builder AI. 
Help the user build their resume interactively.
Update the JSON resume data with the new information provided by the user. Ensure the resume sounds professional, uses strong action verbs, and is optimized for ATS parsing. If the user provides messy text, structure it nicely. Maintain existing data unless the user asks to change or remove it.
If the user asks to "improve" the resume, rewrite the summary and experience bullet points to be more impactful.

Current Resume State:
${JSON.stringify(currentResume, null, 2)}

Chat History:
${historyText}

User's Latest message:
"${userMessage}"

Respond with an object containing your conversational "message" (e.g. asking a follow-up question or confirming the update) and the completely updated "resume". Keep the message brief.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: resumeSchema,
      temperature: 0.2, // Low temperature for more structured, less hallucination
      maxOutputTokens: 8192,
    },
  });

  if (!response.text) throw new Error("No response from AI.");
  
  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to parse JSON response. The output may have been truncated.", error);
    // Incomplete response, try to extract whatever message we can, or just throw
    throw new Error("AI response was truncated or invalid. Please try a shorter request.");
  }
}
