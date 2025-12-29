import { TEMPERAMENT_PROFILES } from './data';
import type { TemperamentType, TestResult } from '../types';

export const calculateAssessmentResult = (answers: Record<number, string>): TestResult => {
  const scores: Record<TemperamentType, number> = {
    Choleric: 0,
    Sanguine: 0,
    Phlegmatic: 0,
    Melancholy: 0,
  };

  // Count scores
  Object.values(answers).forEach((trait) => {
    // We cast trait as TemperamentType to satisfy TypeScript
    if (trait in scores) {
      scores[trait as TemperamentType]++;
    }
  });

  // Sort to find Primary and Secondary
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const primary = sorted[0][0] as TemperamentType;
  const secondary = sorted[1][0] as TemperamentType;
  const isBlend = sorted[0][1] === sorted[1][1];

  return {
    primary,
    secondary,
    scores,
    isBlend,
    timestamp: new Date() // Now allowed by TestResult
  };
};

export const generateBlendDescription = (
  primary: TemperamentType,
  secondary: TemperamentType,
  isBlend: boolean = false
): string => {
  if (isBlend) {
    return `You have a balanced blend of ${primary} and ${secondary}. This means you can adapt easily between the strengths of both temperaments depending on the situation.`;
  }

  const pDesc = TEMPERAMENT_PROFILES[primary]?.description || "";
  return `${pDesc} You also show traits of ${secondary}, which adds nuance to your primary personality.`;
};