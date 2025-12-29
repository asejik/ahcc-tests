export interface BigFiveQuestion {
  id: number;
  text: string;
  trait: 'Openness' | 'Conscientiousness' | 'Extraversion' | 'Agreeableness' | 'Neuroticism';
  isReverse: boolean;
}

export const BIG_FIVE_QUESTIONS: BigFiveQuestion[] = [
  // A. OPENNESS (Focus: Imagination, Curiosity, Tradition)
  { id: 1, text: "I enjoy trying new experiences and exploring new ideas.", trait: "Openness", isReverse: false },
  { id: 2, text: "I have a vivid imagination.", trait: "Openness", isReverse: false },
  { id: 3, text: "I enjoy learning about different cultures or viewpoints.", trait: "Openness", isReverse: false },
  { id: 4, text: "I prefer routine and familiar things.", trait: "Openness", isReverse: true },

  // B. CONSCIENTIOUSNESS (Focus: Order, Goals, Reliability)
  { id: 5, text: "I keep things tidy and well organized.", trait: "Conscientiousness", isReverse: false },
  { id: 6, text: "I work hard to achieve my goals.", trait: "Conscientiousness", isReverse: false },
  { id: 7, text: "I follow through on commitments.", trait: "Conscientiousness", isReverse: false },
  { id: 8, text: "I often procrastinate.", trait: "Conscientiousness", isReverse: true },

  // C. EXTRAVERSION (Focus: Energy, Sociability, Assertiveness)
  { id: 9, text: "I feel energized when I spend time with people.", trait: "Extraversion", isReverse: false },
  { id: 10, text: "I am comfortable starting conversations.", trait: "Extraversion", isReverse: false },
  { id: 11, text: "I take the lead in social situations.", trait: "Extraversion", isReverse: false },
  { id: 12, text: "I prefer quiet time to recharge.", trait: "Extraversion", isReverse: true },

  // D. AGREEABLENESS (Focus: Empathy, Trust, Harmony)
  { id: 13, text: "I try to see things from others’ perspectives.", trait: "Agreeableness", isReverse: false },
  { id: 14, text: "I enjoy helping others.", trait: "Agreeableness", isReverse: false },
  { id: 15, text: "I value harmony in my relationships.", trait: "Agreeableness", isReverse: false },
  { id: 16, text: "I can be stubborn or hard to convince.", trait: "Agreeableness", isReverse: true },

  // E. NEUROTICISM (Focus: Stress, Resilience, Worry)
  { id: 17, text: "I get stressed easily.", trait: "Neuroticism", isReverse: false },
  { id: 18, text: "I often feel overwhelmed.", trait: "Neuroticism", isReverse: false },
  { id: 19, text: "I worry about many things.", trait: "Neuroticism", isReverse: false },
  { id: 20, text: "I stay calm under pressure.", trait: "Neuroticism", isReverse: true },
];

export const BIG_FIVE_INTERPRETATIONS = {
  Openness: {
    High: "Creative, curious, expressive, adaptable, imaginative.",
    Moderate: "Open to ideas but balanced with practicality.",
    Low: "Prefers routine, structure, predictability, familiar patterns."
  },
  Conscientiousness: {
    High: "Responsible, disciplined, reliable, organized, goal-driven.",
    Moderate: "Generally dependable, sometimes inconsistent.",
    Low: "Spontaneous, flexible, may struggle with structure or planning."
  },
  Extraversion: {
    High: "Outgoing, energetic, expressive, enjoys social settings.",
    Moderate: "Balanced — enjoys people but also values alone time.",
    Low: "Introverted, reflective, prefers quiet environments."
  },
  Agreeableness: {
    High: "Kind, cooperative, empathetic, supportive, peace-loving.",
    Moderate: "Usually warm but can be firm when needed.",
    Low: "Direct, competitive, blunt, may prioritize logic over emotion."
  },
  Neuroticism: {
    High: "Sensitive, easily stressed, reactive to emotions.",
    Moderate: "Experiences emotions normally, manages stress fairly well.",
    Low: "Calm, steady, emotionally stable, handles pressure well."
  }
};