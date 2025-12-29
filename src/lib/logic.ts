import type { QuestionOption, TemperamentType, TestResult } from "../types";

export function calculateAssessmentResult(answers: Record<number, QuestionOption>): TestResult {
  // 1. Initialize counters
  const scores: Record<TemperamentType, number> = {
    Melancholy: 0,
    Choleric: 0,
    Sanguine: 0,
    Phlegmatic: 0,
  };

  // 2. Tally up the votes
  Object.values(answers).forEach((option) => {
    if (option.value) {
      scores[option.value]++;
    }
  });

  // 3. Sort temperaments by score (Highest to Lowest)
  const sortedTemperaments = Object.entries(scores).sort(
    ([, scoreA], [, scoreB]) => scoreB - scoreA
  ) as [TemperamentType, number][];

  const primary = sortedTemperaments[0];   // e.g., ["Melancholy", 8]
  const secondary = sortedTemperaments[1]; // e.g., ["Phlegmatic", 5]

  // 4. Check for a Tie (Blend)
  // If the top two scores are equal, it's a Co-Dominant Blend
  const isBlend = primary[1] === secondary[1];

  return {
    primary: primary[0],
    secondary: secondary[0],
    scores,
    isBlend,
    timestamp: new Date(),
  };
}

export function generateBlendDescription(
  primary: TemperamentType,
  secondary: TemperamentType,
  isBlend: boolean
): string {
  // If it's a true blend (tie), we emphasize the balance
  if (isBlend) {
    return `You possess a unique, balanced blend of the ${primary} and ${secondary} temperaments. Your personality equally draws from the strengths of both, allowing you to switch between them depending on the situation.`;
  }

  // Otherwise, standard dominant/sub-dominant phrasing
  return `Your primary temperament is ${primary}, which drives your core behavior. This is supported by your secondary ${secondary} traits, which often surface in specific environments or under stress.`;
}