import type { ConflictStyleType } from './conflictStyleData';

export interface ConflictStyleResult {
  scores: Record<ConflictStyleType, number>;
  primary: ConflictStyleType;
  secondary: ConflictStyleType;
}

export const calculateConflictStyleScores = (answers: Record<number, ConflictStyleType>): ConflictStyleResult => {
  const scores: Record<ConflictStyleType, number> = {
    'Avoiding': 0,
    'Accommodating': 0,
    'Competing': 0,
    'Compromising': 0,
    'Collaborating': 0
  };

  Object.values(answers).forEach((selected) => {
    if (scores[selected] !== undefined) {
      scores[selected]++;
    }
  });

  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a) as [ConflictStyleType, number][];

  return {
    scores,
    primary: sorted[0][0],
    secondary: sorted[1][0]
  };
};

export const generateConflictStylePrompt = (name: string, result: ConflictStyleResult) => {
  return `
    Act as an expert Conflict Resolution Counsellor.
    Analyze the Conflict Resolution Style results for ${name}.

    SCORES (out of 20):
    - Avoiding: ${result.scores.Avoiding}
    - Accommodating: ${result.scores.Accommodating}
    - Competing: ${result.scores.Competing}
    - Compromising: ${result.scores.Compromising}
    - Collaborating: ${result.scores.Collaborating}

    DOMINANT STYLE: ${result.primary}
    SECONDARY STYLE: ${result.secondary}

    TASK:
    Write a 150-word profile.
    1. Explain their dominant conflict style (strengths and weaknesses).
    2. Discuss how their secondary style supports or conflicts with this.
    3. Provide 2 actionable tips for better conflict management in relationships.
  `;
};