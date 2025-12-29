import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getPersonalityAnalysis(
  name: string,
  scores: Record<string, number>,
  primary: string,
  secondary: string
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Act as an expert Clinical Psychologist with 20 years of experience in Temperament Theory.
      Analyze the following assessment results for a client named ${name}.

      SCORES:
      - Melancholy: ${scores.Melancholy}
      - Choleric: ${scores.Choleric}
      - Sanguine: ${scores.Sanguine}
      - Phlegmatic: ${scores.Phlegmatic}

      Dominant: ${primary}
      Secondary: ${secondary}

      TASK:
      Write a personalized, 2-paragraph psychological profile (approx 100 words).

      GUIDELINES:
      1. Do NOT just define "Choleric". Analyze the specific BALANCE of these numbers.
      2. If scores are close (e.g., 6 vs 5), mention the internal conflict or versatility.
      3. If scores are extreme (e.g., 18 vs 2), mention the intensity and potential blind spots.
      4. Speak directly to the client ("You are...").
      5. Tone: Empathetic, professional, insightful, and constructive.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback text if AI fails (e.g., offline)
    return `We have analyzed your profile. Your primary temperament is ${primary} supported by ${secondary}. Your unique score combination suggests a distinct personality blend that drives your behavior.`;
  }
}