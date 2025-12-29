import type { Question, TemperamentProfile } from "../types";

export const TEST_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "How do you usually respond when you are upset?",
    options: [
      { label: "I withdraw to think quietly", value: "Melancholy" },
      { label: "I express myself immediately", value: "Choleric" },
      { label: "I look for something fun to distract myself", value: "Sanguine" },
      { label: "I stay calm and try to avoid conflict", value: "Phlegmatic" },
    ],
  },
  {
    id: 2,
    text: "How do you handle tasks?",
    options: [
      { label: "I plan thoroughly before starting", value: "Melancholy" },
      { label: "I take charge and get it done quickly", value: "Choleric" },
      { label: "I start excitedly but may not finish", value: "Sanguine" },
      { label: "I move at a steady, relaxed pace", value: "Phlegmatic" },
    ],
  },
  {
    id: 3,
    text: "How would your friends describe you?",
    options: [
      { label: "Thoughtful and deep", value: "Melancholy" },
      { label: "Assertive and confident", value: "Choleric" },
      { label: "Cheerful and fun", value: "Sanguine" },
      { label: "Peaceful and easygoing", value: "Phlegmatic" },
    ],
  },
  {
    id: 4,
    text: "How do you handle conflict?",
    options: [
      { label: "I keep it inside and overthink", value: "Melancholy" },
      { label: "I confront it directly", value: "Choleric" },
      { label: "I talk emotionally and passionately", value: "Sanguine" },
      { label: "I avoid conflict if possible", value: "Phlegmatic" },
    ],
  },
  {
    id: 5,
    text: "How do you make decisions?",
    options: [
      { label: "Slowly, carefully, with analysis", value: "Melancholy" },
      { label: "Quickly and confidently", value: "Choleric" },
      { label: "Based on how I feel", value: "Sanguine" },
      { label: "With calmness and consideration", value: "Phlegmatic" },
    ],
  },
  {
    id: 6,
    text: "What best describes your energy level?",
    options: [
      { label: "Reserved and disciplined", value: "Melancholy" },
      { label: "High energy and productive", value: "Choleric" },
      { label: "Energetic and expressive", value: "Sanguine" },
      { label: "Low-key and relaxed", value: "Phlegmatic" },
    ],
  },
  {
    id: 7,
    text: "What motivates you the most?",
    options: [
      { label: "Excellence and doing things right", value: "Melancholy" },
      { label: "Achievement and control", value: "Choleric" },
      { label: "Recognition and excitement", value: "Sanguine" },
      { label: "Harmony and stability", value: "Phlegmatic" },
    ],
  },
  {
    id: 8,
    text: "How do you respond to pressure?",
    options: [
      { label: "I become anxious or perfectionistic", value: "Melancholy" },
      { label: "I take charge and push harder", value: "Choleric" },
      { label: "I get overwhelmed or distracted", value: "Sanguine" },
      { label: "I shut down or detach", value: "Phlegmatic" },
    ],
  },
  {
    id: 9,
    text: "How do you handle social gatherings?",
    options: [
      { label: "I prefer smaller groups or deep conversations", value: "Melancholy" },
      { label: "I network with purpose", value: "Choleric" },
      { label: "I love meeting everyone and being expressive", value: "Sanguine" },
      { label: "I attend but stay in the background", value: "Phlegmatic" },
    ],
  },
  {
    id: 10,
    text: "What describes your communication style?",
    options: [
      { label: "Detailed and thoughtful", value: "Melancholy" },
      { label: "Direct and firm", value: "Choleric" },
      { label: "Expressive and animated", value: "Sanguine" },
      { label: "Soft and gentle", value: "Phlegmatic" },
    ],
  },
  {
    id: 11,
    text: "How do you handle responsibilities?",
    options: [
      { label: "Consistently and seriously", value: "Melancholy" },
      { label: "Efficiently and strategically", value: "Choleric" },
      { label: "Unpredictably but enthusiastically", value: "Sanguine" },
      { label: "Steadily and dependably", value: "Phlegmatic" },
    ],
  },
  {
    id: 12,
    text: "How do you react when things don’t go as planned?",
    options: [
      { label: "I get disappointed or frustrated", value: "Melancholy" },
      { label: "I take control to fix it", value: "Choleric" },
      { label: "I complain emotionally", value: "Sanguine" },
      { label: "I accept it and adjust", value: "Phlegmatic" },
    ],
  },
  {
    id: 13,
    text: "How do you prefer to work?",
    options: [
      { label: "Alone with structure", value: "Melancholy" },
      { label: "Leading others", value: "Choleric" },
      { label: "In a lively group", value: "Sanguine" },
      { label: "In a peaceful environment", value: "Phlegmatic" },
    ],
  },
  {
    id: 14,
    text: "How do you express emotions?",
    options: [
      { label: "Privately and internally", value: "Melancholy" },
      { label: "Controlled and firm", value: "Choleric" },
      { label: "Openly and dramatically", value: "Sanguine" },
      { label: "Slowly and subtly", value: "Phlegmatic" },
    ],
  },
  {
    id: 15,
    text: "What describes your discipline level?",
    options: [
      { label: "Very disciplined", value: "Melancholy" },
      { label: "Highly driven", value: "Choleric" },
      { label: "Starts strong but inconsistent", value: "Sanguine" },
      { label: "Consistent but slow", value: "Phlegmatic" },
    ],
  },
  {
    id: 16,
    text: "How do you handle criticism?",
    options: [
      { label: "I internalize it deeply", value: "Melancholy" },
      { label: "I defend myself strongly", value: "Choleric" },
      { label: "I react emotionally", value: "Sanguine" },
      { label: "I accept it quietly", value: "Phlegmatic" },
    ],
  },
  {
    id: 17,
    text: "What describes your leadership style?",
    options: [
      { label: "Structured and thoughtful", value: "Melancholy" },
      { label: "Strong and decisive", value: "Choleric" },
      { label: "Inspiring and enthusiastic", value: "Sanguine" },
      { label: "Calm and supportive", value: "Phlegmatic" },
    ],
  },
  {
    id: 18,
    text: "What do you dislike the most?",
    options: [
      { label: "Disorder or incompetence", value: "Melancholy" },
      { label: "Weakness or indecision", value: "Choleric" },
      { label: "Boredom or restrictions", value: "Sanguine" },
      { label: "Pressure or conflict", value: "Phlegmatic" },
    ],
  },
  {
    id: 19,
    text: "What describes your emotional pattern?",
    options: [
      { label: "Serious and sensitive", value: "Melancholy" },
      { label: "Controlled and firm", value: "Choleric" },
      { label: "Open and expressive", value: "Sanguine" },
      { label: "Calm and steady", value: "Phlegmatic" },
    ],
  },
  {
    id: 20,
    text: "What is your natural pace in life?",
    options: [
      { label: "Careful and intentional", value: "Melancholy" },
      { label: "Fast and forceful", value: "Choleric" },
      { label: "Spontaneous and lively", value: "Sanguine" },
      { label: "Slow and peaceful", value: "Phlegmatic" },
    ],
  },
];

export const TEMPERAMENT_PROFILES: Record<string, TemperamentProfile> = {
  Melancholy: {
    type: "Melancholy",
    strengths: ["Deep thinker", "Detail-oriented", "Loyal and consistent", "Creative and analytical"],
    growthAreas: ["Overthinking", "Perfectionism", "Fear of failure", "Emotional withdrawal"],
    description: "You possess a deep, thoughtful nature. You value structure and detail, often analyzing situations before acting. Your creativity and loyalty run deep, but you may struggle with perfectionism.",
  },
  Choleric: {
    type: "Choleric",
    strengths: ["Natural leader", "Decisive and bold", "Goal-driven", "Highly productive"],
    growthAreas: ["Impatience", "Dominating tendencies", "Low empathy during conflict", "Can be harsh"],
    description: "You are a natural-born leader who thrives on achievement. You are decisive and bold, often taking charge to solve problems. While highly productive, you may sometimes find it hard to slow down.",
  },
  Sanguine: {
    type: "Sanguine",
    strengths: ["Warm and friendly", "Energetic and expressive", "Inspiring and fun", "Adaptable"],
    growthAreas: ["Inconsistency", "Impulsiveness", "Emotional reactivity", "Difficulty with routines"],
    description: "You are the life of the party—expressive, warm, and energetic. You bring joy and inspiration to those around you. However, your enthusiasm can sometimes lead to impulsiveness or inconsistency.",
  },
  Phlegmatic: {
    type: "Phlegmatic",
    strengths: ["Calm and peaceful", "Stable and dependable", "Great listener", "Patient and relational"],
    growthAreas: ["Avoiding conflict", "Procrastination", "Low motivation", "Indecision"],
    description: "You are a steady, calming presence. People rely on you for your stability and patience. You prioritize peace and harmony, though this can sometimes make it difficult for you to face conflict directly.",
  },
};