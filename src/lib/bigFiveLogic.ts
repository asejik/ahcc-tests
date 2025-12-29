import { BIG_FIVE_QUESTIONS } from './bigFiveData';

export interface BigFiveResult {
  scores: Record<string, number>;
  levels: Record<string, 'Low' | 'Moderate' | 'High'>;
}

export const calculateBigFiveScores = (answers: Record<number, number>): BigFiveResult => {
  const scores: Record<string, number> = {
    Openness: 0,
    Conscientiousness: 0,
    Extraversion: 0,
    Agreeableness: 0,
    Neuroticism: 0,
  };

  BIG_FIVE_QUESTIONS.forEach((q) => {
    const userValue = answers[q.id] || 3;
    const finalValue = q.isReverse ? (6 - userValue) : userValue;
    scores[q.trait] += finalValue;
  });

  // NEW THRESHOLDS (Based on 4 questions per trait, Max Score = 20)
  // Range: 4 to 20
  const levels: Record<string, 'Low' | 'Moderate' | 'High'> = {};

  Object.entries(scores).forEach(([trait, score]) => {
    if (score <= 10) levels[trait] = 'Low';       // 4-10
    else if (score <= 14) levels[trait] = 'Moderate'; // 11-14
    else levels[trait] = 'High';                  // 15-20
  });

  return { scores, levels };
};

export const generateBigFivePrompt = (name: string, result: BigFiveResult) => {
  return `
    Act as an expert Clinical Psychologist. Analyze the Big Five Personality Test results for ${name}.

    SCORES (Range 4-20):
    - Openness: ${result.scores.Openness} (${result.levels.Openness})
    - Conscientiousness: ${result.scores.Conscientiousness} (${result.levels.Conscientiousness})
    - Extraversion: ${result.scores.Extraversion} (${result.levels.Extraversion})
    - Agreeableness: ${result.scores.Agreeableness} (${result.levels.Agreeableness})
    - Neuroticism: ${result.scores.Neuroticism} (${result.levels.Neuroticism})

    TASK:
    Write a personalized 150-word psychological profile.
    1. Do NOT list the traits one by one. Synthesize them.
    2. Example: If High Conscientiousness + High Neuroticism, discuss "Perfectionist Anxiety".
    3. Example: If High Extraversion + Low Agreeableness, discuss "Domineering Leadership".
    4. Conclude with a brief, encouraging sentence about using these strengths.
  `;
};