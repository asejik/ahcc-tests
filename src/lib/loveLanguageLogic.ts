import type { LoveLanguageType } from './loveLanguageData';

export interface LoveLanguageResult {
  scores: Record<LoveLanguageType, number>;
  primary: LoveLanguageType;
  secondary: LoveLanguageType;
}

export const calculateLoveLanguageScores = (answers: Record<number, LoveLanguageType>): LoveLanguageResult => {
  // Initialize scores
  const scores: Record<LoveLanguageType, number> = {
    'Words of Affirmation': 0,
    'Quality Time': 0,
    'Acts of Service': 0,
    'Receiving Gifts': 0,
    'Physical Touch': 0
  };

  // Tally up votes
  Object.values(answers).forEach((selectedLanguage) => {
    if (scores[selectedLanguage] !== undefined) {
      scores[selectedLanguage]++;
    }
  });

  // Sort to find winners
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a) as [LoveLanguageType, number][];

  return {
    scores,
    primary: sorted[0][0],
    secondary: sorted[1][0]
  };
};

export const generateLoveLanguagePrompt = (name: string, result: LoveLanguageResult) => {
  return `
    Act as an expert Relationship Counselor. Analyze the 5 Love Languages results for ${name}.

    SCORES (out of 20):
    - Words of Affirmation: ${result.scores['Words of Affirmation']}
    - Quality Time: ${result.scores['Quality Time']}
    - Acts of Service: ${result.scores['Acts of Service']}
    - Receiving Gifts: ${result.scores['Receiving Gifts']}
    - Physical Touch: ${result.scores['Physical Touch']}

    PRIMARY: ${result.primary}
    SECONDARY: ${result.secondary}

    TASK:
    Write a warm, insightful 150-word analysis.
    1. Explain what their Primary Language means for their daily relationships (what fills their tank).
    2. Mention how their Secondary Language supports this.
    3. Give 1 specific "Do" and 1 "Don't" for their partner to love them well.
  `;
};