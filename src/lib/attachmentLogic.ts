import { ATTACHMENT_QUESTIONS, type AttachmentStyle } from './attachmentData';

export interface AttachmentResult {
  scores: Record<AttachmentStyle, number>;
  primary: AttachmentStyle;
  secondary: AttachmentStyle | null;
  isMixed: boolean;
}

export const calculateAttachmentScores = (answers: Record<number, number>): AttachmentResult => {
  const scores: Record<AttachmentStyle, number> = {
    'Secure': 0,
    'Anxious': 0,
    'Avoidant': 0,
    'Fearful-Avoidant': 0
  };

  // Sum scores
  ATTACHMENT_QUESTIONS.forEach((q) => {
    const value = answers[q.id] || 3;
    scores[q.style] += value;
  });

  // Find ranks
  const sortedStyles = Object.entries(scores).sort(([, a], [, b]) => b - a) as [AttachmentStyle, number][];

  const [firstStyle, firstScore] = sortedStyles[0];
  const [secondStyle, secondScore] = sortedStyles[1];

  // Check for Mixed Style (Difference <= 3)
  const isMixed = (firstScore - secondScore) <= 3;

  return {
    scores,
    primary: firstStyle,
    secondary: isMixed ? secondStyle : null,
    isMixed
  };
};

export const generateAttachmentPrompt = (name: string, result: AttachmentResult) => {
  return `
    Act as an expert Relationship Counselor and Attachment Theorist.
    Analyze the Attachment Style results for ${name}.

    SCORES (Max 30):
    - Secure: ${result.scores.Secure}
    - Anxious: ${result.scores.Anxious}
    - Avoidant: ${result.scores.Avoidant}
    - Fearful-Avoidant: ${result.scores['Fearful-Avoidant']}

    PRIMARY STYLE: ${result.primary}
    ${result.isMixed ? `MIXED WITH: ${result.secondary}` : ''}

    TASK:
    Write a compassionate, 150-word analysis.
    1. Explain how this attachment style likely affects their relationships (trust, conflict, closeness).
    2. If mixed, explain the internal conflict (e.g., wanting closeness but fearing it).
    3. Provide 2 specific, actionable sentences on how to move toward "Secure" attachment.
    4. Tone: Non-judgmental, hopeful, and professional.
  `;
};